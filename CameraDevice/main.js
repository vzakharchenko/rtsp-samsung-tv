var serverInfo = {
    ip: 'localhost', // <-- Server IP
    port:'3004',
};



var next = () =>{
    var xhr = new XMLHttpRequest();
    const url = 'http://'+serverInfo.ip+':'+serverInfo.port+'/next?width='+window.innerWidth+'&height='+window.innerHeight;
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {        // ready state event, will be executed once the server send back the data
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
                location.reload();
            } else {
            	console,error('There was a problem with the request.');
            }
        }
    };
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
    };
    xhr.send(null);
}
var prev = () =>{
    var xhr = new XMLHttpRequest();
    const url = 'http://'+serverInfo.ip+':'+serverInfo.port+'/prev?width='+window.innerWidth+'&height='+window.innerHeight
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {        // ready state event, will be executed once the server send back the data
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
                location.reload();
            } else {
            	console,error('There was a problem with the request.');
            }
        }
    };
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
    };
    xhr.send(null);
}

var reload = () =>{
    var xhr = new XMLHttpRequest();
    const url = 'http://'+serverInfo.ip+':'+serverInfo.port+'/reload?width='+window.innerWidth+'&height='+window.innerHeight
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {        // ready state event, will be executed once the server send back the data
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
                location.reload();
            } else {
                console,error('There was a problem with the request.');
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
    // TODO:: Do your initialization job
    console.log('init() called');

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
            case 10009: //RETURN button
                tizen.application.getCurrentApplication().exit();
                break;
            default:
                console.log('Key code : ' + e.keyCode);
                break;
        }
    });
    document.body.focus();
};
// window.onload can work without <body onload="">
window.onload = init;

