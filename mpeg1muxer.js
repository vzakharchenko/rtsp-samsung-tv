var Mpeg1Muxer, child_process, events, util

child_process = require('child_process')

util = require('util')

events = require('events')

Mpeg1Muxer = function (options) {
    var key
    this.url = options.url
    this.ffmpegOptions = options.ffmpegOptions
    const ffmpegOptionsDefault = {
        '-f': 'mpegts',
        '-codec:v': 'mpeg1video',
    }
    this.ffmpegChannelPre = options.ffmpegPreOptions;
    this.exitCode = undefined
    this.signal = undefined
    this.killed = false;
    this.additionalFlags = []
    this.additionalPreFlags = []
    if (this.ffmpegOptions) {
        for (key in this.ffmpegOptions) {
            if (ffmpegOptionsDefault[key] != null) {
                ffmpegOptionsDefault[key] = String(this.ffmpegOptions[key]);
            } else {
                this.additionalFlags.push(key)
                if (String(this.ffmpegOptions[key]) !== '') {
                    this.additionalFlags.push(String(this.ffmpegOptions[key]))
                }
            }
        }
    }
    if (this.ffmpegChannelPre) {
        for (key in this.ffmpegChannelPre) {
            this.additionalPreFlags.push(key)
            if (String(this.ffmpegChannelPre[key]) !== '') {
                this.additionalPreFlags.push(String(this.ffmpegChannelPre[key]))
            }
        }
    }

    if (ffmpegOptionsDefault) {
        for (key in ffmpegOptionsDefault) {
            this.additionalFlags.push(key)
            if (String(ffmpegOptionsDefault[key]) !== '') {
                this.additionalFlags.push(String(ffmpegOptionsDefault[key]))
            }
        }
    }

    this.spawnOptions = [
        ...this.additionalPreFlags,
        "-i",
        this.url,
        // additional ffmpeg options go here
        ...this.additionalFlags,
        '-'
    ]
    this.stream = child_process.spawn(options.ffmpegPath, this.spawnOptions, {
        detached: false
    })
    this.kill=()=>{
        this.killed=true;
        this.stream.kill();
    }
    this.inputStreamStarted = true
    this.stream.stdout.on('data', (data) => {
        return this.emit('mpeg1data', data)
    })
    this.stream.stderr.on('data', (data) => {
        return this.emit('ffmpegStderr', data)
    })
    this.stream.on('error', (e) => {
         console.log('error spawning ffmpegPath: ' + e);
    })
    this.stream.on('exit', (code, signal) => {
        if (this.killed){
            return ;
        }
        if (code === 0) {
            return this.emit('exitWithoutError')
        } else {
            console.error('RTSP stream exited with error')
            this.exitCode = code
            this.signal = signal
            return this.emit('exitWithError')
        }
    })
    return this
}

util.inherits(Mpeg1Muxer, events.EventEmitter)

module.exports = Mpeg1Muxer
