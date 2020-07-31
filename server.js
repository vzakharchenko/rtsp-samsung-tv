const {CronJob} = require('cron');
const express = require("express");
const fs = require("fs");
const Stream = require('./index');

const app = express();

app.use(express.static(__dirname + "/CameraDevice"));


console.log = () => {
};
console.error = () => {
};
console.debug = () => {
};

function readConfig() {
    let channelJson = {channels: []};
    const defaultChannelFile = './config/channels.json';
    if (fs.existsSync(defaultChannelFile)) {
        const defaultChannelJson = JSON.parse(fs.readFileSync(defaultChannelFile, 'UTF-8'));
        channelJson = defaultChannelJson;
    }
    const ovverideChannelFile = './config/userChannels.json';
    if (fs.existsSync(ovverideChannelFile)) {
        const overrideChannel = JSON.parse(fs.readFileSync(ovverideChannelFile, 'UTF-8'));
        channelJson = overrideChannel;
    }
    const channelsFile = '/opt/config/channels.json';
    if (fs.existsSync(channelsFile)) {
        const overrideChannel = JSON.parse(fs.readFileSync(channelsFile, 'UTF-8'));
        channelJson = overrideChannel;
    }

    return channelJson;
};

const config = readConfig();

function readChannels() {
    return config.channels;
}

function readCurrentChannel() {
    const currentChannelFile = '.currentChannel';
    if (fs.existsSync(currentChannelFile)) {
        const curJson = JSON.parse(fs.readFileSync(currentChannelFile, 'UTF-8'));
        currentChannel = Number(curJson.currentChannel);
        width = Number(curJson.width);
        height = Number(curJson.height);
    } else {
        currentChannel = 0;
        width = 1920;
        width = 1080;
    }
}

function saveCurrentChannel() {
    const currentChannelFile = '.currentChannel';
    fs.writeFileSync(currentChannelFile, JSON.stringify({currentChannel, width, height}));
}

const channels = readChannels();

let currentChannel = 0;
let width = 1920;
let height = 1080;

readCurrentChannel();

let stream = null;

function recreateStream() {
    if (stream) {
        stream.mpeg1Muxer.stream.kill();
        stream.wsServer.close();
    }
    let channel = channels[currentChannel];
    stream = new Stream({
        name: currentChannel,
        streamUrl: channel.streamUrl,
        wsPort: 9999,
        ffmpegOptions: { // options ffmpeg flags
            '-rtsp_transport':channel.transport || config.transport || 'udp',
            '-vf': `scale=${width}:${height}`,
            '-nostats': '',
            '-loglevel': 'quiet',
            //'-stats': '', // an option with no neccessary value uses a blank string
            '-r': 30,
        }
    });

}

recreateStream();
app.get('/next', (req, res) => {
    var width0 = req.query.width;
    if (width0) {
        width = width0;
    }
    var height0 = req.query.height;
    if (height0) {
        height = height0;
    }
    const nextChannel = currentChannel + 1;
    if (channels[nextChannel]) {
        currentChannel = nextChannel;
    } else {
        currentChannel = 0;
    }
    saveCurrentChannel();
    recreateStream();
    return res.send('OK');
});

app.get('/prev', (req, res) => {
    const nextChannel = currentChannel - 1;
    var width0 = req.query.width;
    if (width0) {
        width = width0;
    }
    var height0 = req.query.height;
    if (height0) {
        height = height0;
    }
    if (channels[nextChannel]) {
        currentChannel = nextChannel;
    } else {
        currentChannel = channels.length;
    }
    recreateStream();
    saveCurrentChannel();
    return res.send('OK');
});

app.get('/reload', (req, res) => {
    var width0 = req.query.width;
    if (width0) {
        width = width0;
    }
    var height0 = req.query.height;
    if (height0) {
        height = height0;
    }
    recreateStream();
    return res.send('OK');
});

function installCrons() {
    const cronJob = new CronJob("0 */2 * * * *", (() => {
        if (stream.mpeg1Muxer.stream.exitCode > 0 ||
        !stream.mpeg1Muxer.stream.pid > 0 ||
        !stream.mpeg1Muxer.inputStreamStarted ||
        stream.mpeg1Muxer.stream.killed,
        stream.mpeg1Muxer.stream._closesGot > 0) {
            recreateStream();
        }
    }), null, true, 'America/Los_Angeles');
    console.debug('System TZ next 5: ', cronJob.nextDates(5));
}

installCrons();


app.listen(3004);
