const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const mkdirp = require('mkdirp');
const { exec } = require('child_process');
const Stream = require('./index');

// TODO:   
//         make channels 1-based
//         give streams a name
//         mixed tcp/udp config possible in 4/9/16-way?
//         wrap around(?) channels up/down
//         obviate next/prev http calls, use channelCount to wrap in client
//         remove need for "off" camera
//         make "-" button toggle on/off
//         Add 9-way, expose 16
//         improve UI of app, for configuring address and port
//         move content of .currentChannel to settings
//         let different clients stream different cams
//         enable a/b/c/d buttons for cams
//       X make keyboard inputs work on camera.html
//       X make exit button work in addition to "back"
//       X merge multiple -vf options, utilize OSD
//       X fix entry of "0" as channel digit
//       X shut down ffmpeg if no clients
//         Never Blank (1) server shut down notice
//
//         AUDIO?
//         PTZ controls?
//         Templates, break out params like IP & PORT?


const {
  connectAuthentication, protect,
} = require('./authenticationConnection');

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
const corsOptions = {
  origin(o, callback) {
    callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: true,
  credentials: true,
  maxAge: 3600,
};

let currentChannel = 0;
let width = 1920;
let height = 1080;

let streams = [];

app.use(cors(corsOptions));
// eslint-disable-next-line no-use-before-define
const connectionType = connectAuthentication(app, readConfig);

//console.log = () => {
//};
console.error = () => {
};
console.debug = () => {
};

function readConfig() {
  let channelJson = { channels: [] };
  const defaultChannelFile = './config/channels.json';
  if (fs.existsSync(defaultChannelFile)) {
    const text = fs.readFileSync(defaultChannelFile, 'UTF-8');
    const defaultChannelJson = text ? JSON.parse(text) : {};
    defaultChannelJson.file = defaultChannelFile;
    channelJson = defaultChannelJson;
  }
  const ovverideChannelFile = `${process.env.HOME}/.rtsp/userChannels.json`;
  if (fs.existsSync(ovverideChannelFile)) {
    const text = fs.readFileSync(ovverideChannelFile, 'UTF-8');
    const overrideChannel = text ? JSON.parse(text) : {};
    overrideChannel.file = ovverideChannelFile;
    channelJson = overrideChannel;
  }
  const channelsFile = '/opt/config/channels.json';
  if (fs.existsSync(channelsFile)) {
    const text = fs.readFileSync(channelsFile, 'UTF-8');
    const overrideChannel = text ? JSON.parse(text) : {};
    overrideChannel.file = channelsFile;
    channelJson = overrideChannel;
  }
  if (channelJson.killAll === undefined) {
    channelJson.killAll = true;
  }
  if (!channelJson.ffmpeg) {
    channelJson.ffmpeg = {
      '-nostats': '',
      '-r': 31,
      '-loglevel': 'quiet',
      '-f': 'mpegts',
      '-codec:v': 'mpeg1video',
    };
  }
  if (!channelJson.ffmpeg['-codec:v']) {
    channelJson.ffmpeg['-codec:v'] = 'mpeg1video';
  }
  if (!channelJson.ffmpeg['-f']) {
    channelJson.ffmpeg['-f'] = 'mpegts';
  }
  if (!channelJson.ffmpeg['-r']) {
    channelJson.ffmpeg['-r'] = '32';
  }

  if (!channelJson.ffmpegPre) {
    channelJson.ffmpegPre = {};
  }
  if (!channelJson.transport) {
    channelJson.transport = 'udp';
  }
  if (channelJson.transport === 'tcp') {
    channelJson.ffmpegPre['-rtsp_transport'] = 'tcp';
  } else if (channelJson.transport === 'udp') {
    channelJson.ffmpegPre['-rtsp_transport'] = 'udp';
  } else if (channelJson.transport === 'none') {
    delete channelJson.ffmpegPre['-rtsp_transport'];
  }
  if (!channelJson.channels) {
    channelJson.channels = [];
  }
  channelJson.channels.forEach((channel) => {
    const ch = channel;
    if (!ch.ffmpeg) {
      ch.ffmpeg = {};
    }

    if (!ch.ffmpegPre) {
      ch.ffmpegPre = {};
    }
    if (ch.transport === 'tcp') {
      ch.ffmpegPre['-rtsp_transport'] = 'tcp';
    } else if (ch.transport === 'udp') {
      ch.ffmpegPre['-rtsp_transport'] = 'udp';
    } else if (ch.transport === 'none') {
      delete ch.ffmpegPre['-rtsp_transport'];
    }
  });
  if (!channelJson.users) {
    channelJson.users = [
      {
        userId: 0,
        username: 'admin',
        password: 'admin',
      },
    ];
  }
  channelJson.connectionType = connectionType;
  return channelJson;
}

let config = readConfig();

function readChannels() {
  return config.channels;
}

let channels = readChannels();

function saveConfig() {
  streams.forEach(((stream) => {
    stream.mpeg1Muxer.stream.kill();
    //stream.wsServer.close();
    stream.stop();
  }));
  streams = [];
  const configFile = { ...config };
  delete configFile.file;
  let path = config.file;
  if (!config.file || config.file === './config/config.json') {
    mkdirp.sync(`${process.env.HOME}/.rtsp`);
    path = `${process.env.HOME}/.rtsp/userChannels.json`;
  }
  fs.writeFileSync(path, JSON.stringify(configFile, null, 1), 'UTF-8');
  config = readConfig();
  channels = readChannels();
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
  fs.writeFileSync(currentChannelFile, JSON.stringify({ currentChannel, width, height }, null, 1));
}

function getMode() {
  let mode;
  if (channels[currentChannel] && Array.isArray(channels[currentChannel].streamUrl)) {
    if (channels[currentChannel].streamUrl.length === 1) {
      mode = 1;
    } else if (channels[currentChannel].streamUrl.length === 0) {
      mode = 0;
    } if (channels[currentChannel].streamUrl.length > 1
        && channels[currentChannel].streamUrl.length <= 4) {
      mode = 4;
    } else {
      mode = 16;
    }
  } else {
    mode = 1;
  }
  return mode;
}

readCurrentChannel();

function getNextChannel(cChannel) {
  let nextChannel = cChannel + 1;
  if (!channels[nextChannel]) {
    nextChannel = 0;
  }
  return nextChannel;
}

async function killall() {
  return new Promise((resolve) => {
    exec(
      'killall ffmpeg',
      (error, stdout, stderr) => {
        console.debug(`stdout: ${stdout}`);
        console.debug(`stderr: ${stderr}`);
        if (error !== null) {
          console.error(`exec error: ${error}`);
          // reject(error);
        }
        resolve();
      },
    );
  });
}

function clientClose( stream ) {
  console.log("clientClose");
  if ( stream.wsServer.clients.size == 0 ) {
    dropAllStreams();
  }
}

function dropAllStreams() {
  streams.forEach(((stream) => {
    stream.mpeg1Muxer.kill();
    stream.stop();
  }));
}

async function recreateStream() {
  dropAllStreams();
  if (config.killAll) {
    await killall();
  }
  streams = [];
  const mode = getMode();
  readCurrentChannel();
  const selectChannel = channels[currentChannel];
  console.log('current channel is: ' + currentChannel);
  //console.log(selectChannel);
  if (selectChannel && selectChannel.streamUrl != 'off' ) {
    for (let i = 0; i < mode; i++) { // eslint-disable-line no-plusplus
      if ((i === 0 && selectChannel.streamUrl) || selectChannel.streamUrl[i]) {
        let scalefactor = Math.sqrt(mode);

        const ffmpegPre = config.ffmpegPre ? config.ffmpegPre : {};
        const ffmpegPost = config.ffmpeg ? config.ffmpeg : {};
        const ffmpegChannelPre = selectChannel.ffmpegPre ? selectChannel.ffmpegPre : {};
        const ffmpegChannel = selectChannel.ffmpeg ? selectChannel.ffmpeg : {};
        const ffmpegPreOptions = {
          ...ffmpegPre,
          ...ffmpegChannelPre,
        };
        //console.log( selectChannel.ffmpeg );
        let ffmpegOptions = {
          ...{
            '-nostats': '',
            '-r': 33,
            '-loglevel': 'quiet',
          },
          ...ffmpegPost,
          ...ffmpegChannel,
          //...{
          //  '-vf': `scale=${width / scalefactor}:${height / scalefactor}`,
          //},
        };
        if (ffmpegOptions['-vf']) {
            ffmpegOptions['-vf'] = ffmpegOptions['-vf'].replace( '`c`', currentChannel ).replace( '`n`', i )
            ffmpegOptions['-vf'] += ',' + `scale=${width / scalefactor}:${height / scalefactor}`
        } else {
            ffmpegOptions['-vf'] = `scale=${width / scalefactor}:${height / scalefactor}`
        }

        const stream = new Stream({
          name: `${currentChannel} ${i}`,
          streamUrl: Array.isArray(selectChannel.streamUrl)
            ? selectChannel.streamUrl[i] : selectChannel.streamUrl,
          wsPort: 9999 + i,
          onClientClose : clientClose,
          ffmpegOptions,
          ffmpegPreOptions,
        });
        stream.mpeg1Muxer.on('exitWithError', () => {
          recreateStream();
        });
        stream.mpeg1Muxer.on('exitWithoutError', () => {
          recreateStream();
        });
        streams.push(stream);
      }
    }
  }
}

recreateStream().then();

app.get('/lib.js', async (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const currentDir = path.dirname(__filename);
  const filePath = path.join(currentDir, 'lib.js');
  console.log(filePath);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    return res.send(data);
  });
});

app.get('/next', async (req, res) => {
  const width0 = req.query.width;
  if (width0) {
    width = width0;
  }
  const height0 = req.query.height;
  if (height0) {
    height = height0;
  }
  currentChannel = getNextChannel(currentChannel);
  saveCurrentChannel();
  await recreateStream();
  return res.send('OK');
});

app.get('/prev', async (req, res) => {
  const nextChannel = currentChannel - 1;
  const width0 = req.query.width;
  if (width0) {
    width = width0;
  }
  const height0 = req.query.height;
  if (height0) {
    height = height0;
  }
  if (channels[nextChannel]) {
    currentChannel = nextChannel;
  } else {
    currentChannel = channels.length;
  }
  saveCurrentChannel();
  await recreateStream();
  return res.send('OK');
});

app.get('/sel', async (req, res) => {
  const channel = req.query.channel;
  if (channel) {
    currentChannel = channel;
  }
  const width0 = req.query.width;
  if (width0) {
    width = width0;
  }
  const height0 = req.query.height;
  if (height0) {
    height = height0;
  }
  saveCurrentChannel();
  await recreateStream();
  return res.send('OK');
});

app.get('/reload', async (req, res) => {
  const width0 = req.query.width;
  if (width0) {
    width = width0;
  }
  const height0 = req.query.height;
  if (height0) {
    height = height0;
  }
  saveCurrentChannel();
  await recreateStream();
  return res.send('OK');
});

app.get('/info', cors(corsOptions), (req, res) => {
  readCurrentChannel();
  const mode = getMode();
  const channelCount = channels.length;
  return res.send(JSON.stringify({
    mode,
    currentChannel,
    channelCount,
  }));
});

app.use('/', protect(), express.static(`${__dirname}/camera-admin-ui/build`));

app.get('/admin/config/get', protect(), (req, res) => res.send(JSON.stringify({
  config,
})));

app.get('/admin/status/get', protect(), (req, res) => {
  readCurrentChannel();
  return res.send(JSON.stringify({
    currentChannel,
    width,
    height,
  }));
});

app.post('/admin/status/save', protect(), async (req, res) => {
  const newStatus = req.body;
  currentChannel = newStatus.currentChannel;
  saveCurrentChannel();
  readCurrentChannel();
  await recreateStream();
  return res.send(JSON.stringify({
    currentChannel,
    width,
    height,
  }));
});

app.post('/admin/config/save', protect(), async (req, res) => {
  const newConfig = req.body;
  if (newConfig.transport === 'tcp') {
    newConfig.ffmpegPre['-rtsp_transport'] = 'tcp';
  } else if (newConfig.transport === 'udp') {
    newConfig.ffmpegPre['-rtsp_transport'] = 'udp';
  } else if (newConfig.transport === 'none') {
    delete newConfig.ffmpegPre['-rtsp_transport'];
  }

  if (!newConfig.channels) {
    newConfig.channels = [];
  }
  newConfig.channels.forEach((channel) => {
    const ch = channel;
    if (ch.transport === 'tcp') {
      ch.ffmpegPre['-rtsp_transport'] = 'tcp';
    } else if (ch.transport === 'udp') {
      ch.ffmpegPre['-rtsp_transport'] = 'udp';
    } else if (ch.transport === 'none') {
      delete ch.ffmpegPre['-rtsp_transport'];
    }
  });
  config = { ...config, ...newConfig };
  saveConfig();
  await recreateStream();
  return res.send(JSON.stringify({
    config,
  }));
});

app.listen(3004);
