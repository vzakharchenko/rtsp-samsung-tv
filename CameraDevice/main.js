var serverInfo = {
    ip: '192.100.200.148', // <-- Server IP
    port: '3004',
};

var queue = [];

var changeChannel = false;

var next = () => {
    var xhr = new XMLHttpRequest();
    const url = 'http://' + serverInfo.ip + ':' + serverInfo.port + '/next?width=' + window.screen.width + '&height=' + window.screen.height;
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {        // ready state event, will be executed once the server send back the data
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
}
var prev = () => {
    var xhr = new XMLHttpRequest();
    const url = 'http://' + serverInfo.ip + ':' + serverInfo.port + '/prev?width=' + window.screen.width + '&height=' + window.screen.height
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {        // ready state event, will be executed once the server send back the data
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
}

var reload = () => {
    var xhr = new XMLHttpRequest();
    const url = 'http://' + serverInfo.ip + ':' + serverInfo.port + '/reload?width=' + window.screen.width + '&height=' + window.screen.height
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {        // ready state event, will be executed once the server send back the data
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
}

function getChannel(ch){
    const value = queue.shift();
    if (value){
        ch.value=ch.value+''+value;
        getChannel(ch);
    }
    return ch;
}

var sel = (c) => {
    queue.push(c);
	if (!changeChannel){
	 changeChannel = true;
	 window.setTimeout(()=>{
	     const ch = {value:''};
	     const newch = getChannel(ch);
         changeChannel = false;
	     queue = [];
	     sel0(newch.value)
     },2000);
    }
}
var sel0 = (c) => {
    var xhr = new XMLHttpRequest();
    const url = 'http://' + serverInfo.ip + ':' + serverInfo.port + '/sel?channel=' + c + '&width=' + window.screen.width + '&height=' + window.screen.height
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {        // ready state event, will be executed once the server send back the data
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
}

var getInfo = (callback) => {
    var xhr = new XMLHttpRequest();
    const url = 'http://' + serverInfo.ip + ':' + serverInfo.port + '/info?width=' + window.screen.width + '&height=' + window.screen.height
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {        // ready state event, will be executed once the server send back the data
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                callback(JSON.parse(xhr.responseText))
            } else {
                console, error('There was a problem with the request.');
            }
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.statusText);
    };
    xhr.send(null);
}

//
// channelList()

//Initialize function
var init = function () {

    console.log('init() called');
    window.tizen.tvinputdevice.registerKeyBatch([
        'ChannelUp',
        'ChannelDown', "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]);
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            // Something you want to do when hide or exit.
        } else {
            reload();
        }
    });

    // add eventListener for keydown
    document.addEventListener('keydown', function (e) {
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
            case 37: //LEFT arrow
                prev();
                break;
            case 38: //UP arrow
                next();
                break;
            case 39: //RIGHT arrow
                next();
                break;
            case 40: //DOWN arrow
                prev();
                break;
            case 13: //OK button
                reload()
                break;
            case 427:
                next();
                break;
            case 428:
                prev();
                break;
            case 10009: //RETURN button
                tizen.application.getCurrentApplication().exit();
                break;
            default:
                console.log('Key code : ' + e.keyCode);
                break;
        }
    }, true);
    document.body.focus();
};
// window.onload can work without <body onload="">
window.onload = init;

