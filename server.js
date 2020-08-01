const {CronJob} = require('cron');
const express = require("express");
const cors = require('cors');
const fs = require("fs");
const bodyParser = require('body-parser');
const Stream = require('./index');

const {
    connectKeycloak, protect,
} = require('./keycloakConnection');

const app = express();

app.use(bodyParser.json());
const corsOptions = {
    origin(o, callback) {
        callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: true,
    credentials: true,
    maxAge: 3600,
};

app.use(cors(corsOptions));
connectKeycloak(app);

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
        defaultChannelJson.file = defaultChannelFile;
        channelJson = defaultChannelJson;

    }
    const ovverideChannelFile = './config/userChannels.json';
    if (fs.existsSync(ovverideChannelFile)) {
        const overrideChannel = JSON.parse(fs.readFileSync(ovverideChannelFile, 'UTF-8'));
        overrideChannel.file = ovverideChannelFile;
        channelJson = overrideChannel;
    }
    const channelsFile = '/opt/config/channels.json';
    if (fs.existsSync(channelsFile)) {
        const overrideChannel = JSON.parse(fs.readFileSync(channelsFile, 'UTF-8'));
        overrideChannel.file = channelsFile;
        channelJson = overrideChannel;
    }

    return channelJson;
};


let config = readConfig();

function saveConfig() {
    streams.forEach((stream => {
        stream.mpeg1Muxer.stream.kill();
        stream.wsServer.close();
    }));
    streams = [];
    const configFile = {...config};
    delete configFile.file;
    const path = config.file === './config/channels.json' ? './config/userChannels.json' : config.file;
    fs.writeFileSync(path, JSON.stringify(configFile), 'UTF-8');
    config = readConfig();
    channels = readChannels();
}

function readChannels() {
    return config.channels;
}

function readCurrentChannel() {
    const currentChannelFile = '.currentChannel';
    if (fs.existsSync(currentChannelFile)) {
        const curJson = JSON.parse(fs.readFileSync(currentChannelFile, 'UTF-8'));
        currentChannel = channels[Number(curJson.currentChannel)] ? Number(curJson.currentChannel) : 0;
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

let channels = readChannels();

function getMode() {
    let mode;
    if (channels[currentChannel] && Array.isArray(channels[currentChannel].streamUrl)) {
        if (channels[currentChannel].streamUrl.length === 1) {
            mode = 1;
        } else if (channels[currentChannel].streamUrl.length === 0) {
            mode = 0;
        } else {
            mode = 4
        }
    } else {
        mode = 1;
    }
    return mode;
}

let currentChannel = 0;
let width = 1920;
let height = 1080;

readCurrentChannel();

let streams = [];


function getNextChannel(cChannel) {
    let nextChannel = cChannel + 1;
    if (!channels[nextChannel]) {
        nextChannel = 0;
    }
    return nextChannel;
}

function recreateStream() {
    streams.forEach((stream => {
        stream.mpeg1Muxer.stream.kill();
        stream.wsServer.close();
    }));
    streams = [];
    let mode = getMode();
    readCurrentChannel()
    let selectChannel = channels[currentChannel];
    if (selectChannel) {
        for (let i = 0; i < mode; i++) {
            if ((i === 0 && selectChannel.streamUrl) || selectChannel.streamUrl[i]) {
                var number = mode === 1 ? 1 : 2;
                const stream = new Stream({
                    name: currentChannel + ' ' + i,
                    streamUrl: Array.isArray(selectChannel.streamUrl) ? selectChannel.streamUrl[i] : selectChannel.streamUrl,
                    wsPort: 9999 + i,
                    ffmpegOptions: { // options ffmpeg flags
                        '-rtsp_transport': selectChannel.transport || config.transport || 'udp',
                        '-vf': `scale=${width / number}:${height / number}`,
                        '-nostats': '',
                        //   '-loglevel': 'quiet',
                        //'-stats': '', // an option with no neccessary value uses a blank string
                        '-r': 30,
                    }
                });
                streams.push(stream);
            }
        }
    }
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
    currentChannel = getNextChannel(currentChannel);
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
    saveCurrentChannel();
    recreateStream();
    return res.send('OK');
});


app.get('/info', cors(corsOptions), (req, res) => {
    let mode = getMode()
    return res.send(JSON.stringify({
        mode: mode
    }));
});

function installCrons() {
    const cronJob = new CronJob("0 */2 * * * *", (() => {
        let error = false;
        streams.forEach((stream => {
            if (stream.mpeg1Muxer.stream.exitCode > 0 ||
            !stream.mpeg1Muxer.stream.pid > 0 ||
            !stream.mpeg1Muxer.inputStreamStarted ||
            stream.mpeg1Muxer.stream.killed,
            stream.mpeg1Muxer.stream._closesGot > 0) {
                error = true;
            }
        }));
        if (error) {
            recreateStream();
        }
    }), null, true, 'America/Los_Angeles');
    console.debug('System TZ next 5: ', cronJob.nextDates(5));
}

installCrons();

app.use('/', protect(), express.static(__dirname + "/camera-admin-ui/build"));

app.get('/admin/config/get', (req, res) => {
    return res.send(JSON.stringify({
        config
    }));
});

app.get('/admin/status/get', (req, res) => {
    readCurrentChannel();
    return res.send(JSON.stringify({
        currentChannel,
        width,
        height
    }));
});

app.post('/admin/status/save', (req, res) => {
    const newStatus = req.body;
    currentChannel = newStatus.currentChannel;
    saveCurrentChannel();
    readCurrentChannel();
    recreateStream();
    return res.send(JSON.stringify({
        currentChannel,
        width,
        height
    }));
});

app.post('/admin/config/save', (req, res) => {
    const newConfig = req.body;
    config = {...config, ...newConfig};
    saveConfig();
    recreateStream();
    return res.send(JSON.stringify({
        config
    }));
});

app.listen(3004);
