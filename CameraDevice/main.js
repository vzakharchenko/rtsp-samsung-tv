/* eslint no-sequences: 0 */ // --> OFF
/* eslint no-unused-expressions: 0 */ // --> OFF
/* eslint no-restricted-globals: 0 */ // --> OFF
/* eslint no-unused-vars: 0 */ // --> OFF
/* eslint func-names: 0 */ // --> OFF
const serverInfo = {
  ip: localStorage.getItem('SERVER.IP') || '0.0.0.0', // <-- Server IP
  port: localStorage.getItem('SERVER.PORT') || '3004',
  inited: localStorage.getItem('SERVER.INITED') || false,
};

let queue = [];

let changeChannel = false;

const next = () => {
  const xhr = new XMLHttpRequest();
  const url = `http://${serverInfo.ip}:${serverInfo.port}/next?width=${window.screen.width}&height=${window.screen.height}`;
  xhr.withCredentials = true;
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        console.log(xhr.responseText);
        location.reload();
      } else {
        console, error('There was a problem with the request.');
      }
    }
  };
  xhr.onerror = function (e) {
    console.error(xhr.statusText);
  };
  xhr.send(null);
};
const prev = () => {
  const xhr = new XMLHttpRequest();
  const url = `http://${serverInfo.ip}:${serverInfo.port}/prev?width=${window.screen.width}&height=${window.screen.height}`;
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        console.log(xhr.responseText);
        location.reload();
      } else {
        console, error('There was a problem with the request.');
      }
    }
  };
  xhr.onerror = function (e) {
    console.error(xhr.statusText);
  };
  xhr.send(null);
};

const getInfo = (callback, error) => {
  if (!serverInfo.inited) {
    window.location.href = '/server.html';
  } else {
    const xhr = new XMLHttpRequest();
    const url = `http://${serverInfo.ip}:${serverInfo.port}/info?width=${window.screen.width}&height=${window.screen.height}`;
    xhr.open('GET', url, true);
    xhr.withCredentials = true;
    xhr.onreadystatechange = function () {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
          callback(JSON.parse(xhr.responseText));
        } else {
          window.location.href = '/server.html';
        }
      }
    };
    xhr.onerror = function (e) {
      window.location.href = '/server.html';
      console.error(xhr.statusText);
    };
    xhr.send();
  }
};

const reload = () => {
  if (serverInfo.inited) {
    const xhr = new XMLHttpRequest();
    const url = `http://${serverInfo.ip}:${serverInfo.port}/reload?width=${window.screen.width}&height=${window.screen.height}`;
    xhr.withCredentials = true;
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
          console.log(xhr.responseText);
          location.reload();
        } else {
          console.error('There was a problem with the request.');
        }
      }
    };
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
    };
    xhr.send();
  } else {
    getInfo();
  }
};

function getChannel(ch) {
  const value = queue.shift();
  if (value) {
    ch.value = `${ch.value}${value}`; // eslint-disable-line no-param-reassign
    getChannel(ch);
  }
  return ch;
}

const sel0 = (c) => {
  const xhr = new XMLHttpRequest();
  const url = `http://${serverInfo.ip}:${serverInfo.port}/sel?channel=${c}&width=${window.screen.width}&height=${window.screen.height}`;
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        console.log(xhr.responseText);
        location.reload();
      } else {
        console.error('There was a problem with the request.');
      }
    }
  };
  xhr.onerror = function (e) {
    console.error(xhr.statusText);
  };
  xhr.send(null);
};

const sel = (c) => {
  queue.push(c);
  if (!changeChannel) {
    changeChannel = true;
    window.setTimeout(() => {
      const ch = { value: '' };
      const newch = getChannel(ch);
      changeChannel = false;
      queue = [];
      sel0(newch.value);
    }, 2000);
  }
};

//
// channelList()

// Initialize function
const init = function () {
  console.log('init() called');
  window.tizen.tvinputdevice.registerKeyBatch([
    'ChannelUp',
    'ChannelDown',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0']);
  document.addEventListener('visibilitychange', () => {
    reload();
  });

  // add eventListener for keydown
  document.addEventListener('keydown', (e) => {
    switch (e.keyCode) {
      case 48:
        sel(0);
        break;
      case 49:
        sel(1);
        break;
      case 50:
        sel(2);
        break;
      case 51:
        sel(3);
        break;
      case 52:
        sel(4);
        break;
      case 53:
        sel(5);
        break;
      case 54:
        sel(6);
        break;
      case 55:
        sel(7);
        break;
      case 56:
        sel(8);
        break;
      case 57:
        sel(9);
        break;
      case 37: // LEFT arrow
        prev();
        break;
      case 38: // UP arrow
        next();
        break;
      case 39: // RIGHT arrow
        next();
        break;
      case 40: // DOWN arrow
        prev();
        break;
      case 13: // OK button
        reload();
        break;
      case 427:
        next();
        break;
      case 428:
        prev();
        break;
      case 10009: // RETURN button
        tizen.application.getCurrentApplication().exit();
        break;
      default:
        console.log(`Key code : ${e.keyCode}`);
        break;
    }
  }, true);
  const voicecontrol = tizen.voicecontrol;
  if (voicecontrol) {
    const client = voicecontrol.getVoiceControlClient();
    if (client) {
      const commands = [
        new tizen.VoiceControlCommand('ChannelUp'),
        new tizen.VoiceControlCommand('ChannelDown'),
        new tizen.VoiceControlCommand('Refresh'),
        new tizen.VoiceControlCommand('Select'),
        new tizen.VoiceControlCommand('OK'),

      ];
      for (let i = 0; i < 1000; i++) { // eslint-disable-line no-plusplus
        commands.push(new tizen.VoiceControlCommand(`${i}`));
      }
      try {
        client.setCommandList(commands, 'FOREGROUND');

        const resultListenerCallback = function (event, list, result) {
          if (event === 'SUCCESS') {
            if (!isNaN(result)) {
              sel(result);
            }
            if (result === 'OK' || result === 'Refresh' || result === 'Select') {
              reload();
            }
          }
          console.log(`Result callback - event: ${event}, result: ${result}`);
        };

        client.addResultListener(resultListenerCallback);
      } catch (e) {
        console.error('Voice Control Error', e);
      }
    }
  }
};
// window.onload can work without <body onload="">
window.onload = init;
