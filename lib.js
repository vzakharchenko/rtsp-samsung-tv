{ http: ( { 
queue : [],
changeChannel : false,
loadExpected : false,

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

fullScreen : ( function fullScreen() {
  fullScreenApi.requestFullScreen(document.documentElement);
} ),

handleSourceEstablished : ( function handleSourceEstablished() {
  if ( !lib.loadExpected ) {
      notice.innerHTML == "...";
      lib.loadExpected = true;
      location.reload();
  }
} ),

render : ( function render(resp) {
  const mode = resp.mode;
  let scalefactor = Math.ceil(Math.sqrt(mode));
  lib.initFullScreen();
  lib.loadExpected = true;

  currentChannel = resp.currentChannel;
  channelCount = resp.channelCount;
  var notice = document.getElementById("notice");
  if (currentChannel == 0) {
    notice.innerHTML = 'OFF';
  } else {
    notice.innerHTML = currentChannel + " of " + channelCount;
  }
  var lastFrames = -1;

  setInterval(function() { if ( frames == lastFrames ) { notice.innerHTML = "Video Stalled"; frames = 0; lastFrames = -1 } else { lastFrames = frames } } , 10000);

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
          onVideoDecode: function ondecode( ) { if ( frames == 60 ) { lib.loadExpected = false; frames = 61; notice.innerHTML = ""; } else if ( frames > 1000000 ) { frames = 10000 } else { frames = frames + 1 } },
      
          disableGl : true,
          onSourceEstablished: function sourceEstablished( ) { lib.handleSourceEstablished(); }
          //poster: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/1600px-Sunflower_from_Silesia2.jpg?20091008132228',
          // onPlay: function a( ) { notice.innerHTML = "a" },
          // onPause: function b( ) { notice.innerHTML = "b" },
          // onEnded: function c( ) { notice.innerHTML = "c" },
          // onStalled: function d( ) { notice.innerHTML = "d" },
          // onSourceCompleted: function f( ) { notice.innerHTML = "f" },
      })
  }
} ),

initFullScreen : 
(function() {
	var
		fullScreenApi = {
			supportsFullScreen: false,
			isFullScreen: function() { return false; },
			requestFullScreen: function() {},
			cancelFullScreen: function() {},
			fullScreenEventName: '',
			prefix: ''
		},
		browserPrefixes = 'webkit moz o ms khtml'.split(' ');
	// check for native support
	if (typeof document.cancelFullScreen != 'undefined') {
		fullScreenApi.supportsFullScreen = true;
	} else {
		// check for fullscreen support by vendor prefix
		for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
			fullScreenApi.prefix = browserPrefixes[i];
			if (typeof document[fullScreenApi.prefix + 'CancelFullScreen' ] != 'undefined' ) {
				fullScreenApi.supportsFullScreen = true;
				break;
			}
		}
	}
	// update methods to do something useful
	if (fullScreenApi.supportsFullScreen) {
		fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';
		fullScreenApi.isFullScreen = function() {
			switch (this.prefix) {
				case '':
					return document.fullScreen;
				case 'webkit':
					return document.webkitIsFullScreen;
				default:
					return document[this.prefix + 'FullScreen'];
			}
		}
		fullScreenApi.requestFullScreen = function(el) {
			return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
		}
		fullScreenApi.cancelFullScreen = function(el) {
			return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
		}
	}
	// jQuery plugin
	if (typeof jQuery != 'undefined') {
		jQuery.fn.requestFullScreen = function() {
			return this.each(function() {
				if (fullScreenApi.supportsFullScreen) {
					fullScreenApi.requestFullScreen(this);
				}
			});
		};
	}
	// export api
	window.fullScreenApi = fullScreenApi;
})
} ) }
