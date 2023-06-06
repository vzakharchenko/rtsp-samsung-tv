{ http: ( { 
queue : [],
changeChannel : false,

req : ( function req( path ) {
  var xhr = new XMLHttpRequest();
  var url = 'http://' + serverInfo.ip + ':' + serverInfo.port + path;
  xhr.withCredentials = true;
  xhr.open('GET', url, true);
  return xhr;
} ),

dorequest : ( function dorequest( path ) {
  var xhr = lib.req( path );
  xhr.onreadystatechange = function () {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        console.log(xhr.responseText);
        location.reload();
      } else {
        console.log('There was a problem with the request.');
      }
    }
  };
  xhr.onerror = function (e) {
    console.log(xhr.statusText);
  };
  xhr.send();
}),

next : ( function next() {
  lib.dorequest('/next?width=' + window.screen.width + '&height=' + window.screen.height);
}),

prev : ( function prev() {
  lib.dorequest('/prev?width=' + window.screen.width + '&height=' + window.screen.height);
}),

sel0 : ( function sel0(c) {
  lib.dorequest('/sel?channel=' + c + '&width=' + window.screen.width + '&height=' + window.screen.height);
}),

sel : ( function sel(c) {
  lib.queue.push(c);
  notice.innerHTML=lib.queue.join("")
  if (!lib.changeChannel) {
    lib.changeChannel = true;
    window.setTimeout(function () {
      var ch = { value: '' };
      var newch = lib.queue.join("");
      lib.changeChannel = false;
      lib.queue = [];
      lib.sel0(parseInt(newch));
    }, 1000);
  }
}),

render : ( function render(resp) {
  const mode = resp.mode;
  let scalefactor = Math.sqrt(mode);
  currentChannel = resp.currentChannel;
  channelCount = resp.channelCount;
  var notice = document.getElementById("notice");
  if (currentChannel == 0) {
    notice.innerHTML = 'OFF';
  } else {
    notice.innerHTML = currentChannel + " of " + channelCount;
  }
  var frames = 0;
  var lastFrames = -1;

  setInterval(function() { if ( frames == lastFrames ) { notice.innerHTML = "Video Stalled"; frames = 0 }; lastFrames = frames } , 10000);

  const table = document.getElementById("canvas");
  const trs = [];
  let tds = [];
  for (let i = 1; i < mode + 1; i++) {
      if (i !== 1 && ((i - 1) % (scalefactor) === 0)) {
          trs.push('<tr>' + tds.join('\n') + '</tr>');
          tds = [];
      }
      tds.push('<td> <canvas id="canvas' + i + '"/> </td>')
  }
  trs.push('<tr>' + tds.join('\n') + '</tr>');
  table.innerHTML = trs.join('\n')
  for (let i = 0; i < mode; i++) {
      const url = 'ws://' + serverInfo.ip + ':' + (9999 + i);
      new JSMpeg.Player(url, {
          canvas: document.getElementById('canvas' + (i + 1)),
          onVideoDecode: function ondecode( ) { if ( frames == 60 ) { notice.innerHTML = ""; } else if ( frames > 1000000 ) { frames = 10000 } else { frames = frames + 1 } },
          disableGl : true,
          //poster: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/1600px-Sunflower_from_Silesia2.jpg?20091008132228',
          //onPlay: function a( ) { notice.innerHTML = "a" },
          //onPause: function b( ) { notice.innerHTML = "b" },
          //onEnded: function c( ) { notice.innerHTML = "c" },
          //onStalled: function d( ) { notice.innerHTML = "d" },
          //onSourceEstablished: function e( ) { notice.innerHTML = "e" },
          //onSourceCompleted: function f( ) { notice.innerHTML = "f" },
      })
  }
} )
} ) }
