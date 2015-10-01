'use strict';

/* globals FileError */

// get video file via XHR
// store with File API
// read Blob from File API and set as video src using createObjectUrl()
// play video
//

var peer = new Peer('2', {host: 'quotacle.com', port: 9000, path: '/'});
function getVideo(fileEntry) {
  peer.on('connection', function(conn){
    conn.on('data', function(uInt8Array){
      var blob = new Blob([uInt8Array], {
        type: 'video/webm'
      }); 
      writeToFile(fileEntry, blob);
    });
  }); 
}

window.MediaSource = window.MediaSource || window.WebKitMediaSource;
if (!!!window.MediaSource) {
      alert('MediaSource API is not available');
}

var mediaSource = new MediaSource();

var video = document.querySelector('video');
video.src = window.URL.createObjectURL( mediaSource );

mediaSource.addEventListener('sourceopen', sourceOpen, false);
mediaSource.addEventListener('webkitsourceopen', sourceOpen, false);



var numChunks = 2;

var i = 0;

var chunkQueue = [];

function sourceOpen(e) {
    var sourceBuffer = mediaSource.addSourceBuffer( 'video/webm; codecs="vorbis,vp8"' );
    console.log(sourceBuffer);

    peer.on( 'connection', function( conn ) {
        conn.on( 'data', function(uInt8Array) {
            console.log("receiving chunk " + i);

            if( i < numChunks ) {
                
                console.log(mediaSource.readyState);

                //var reader = new FileReader();

                //mediaSource.on( 'update', function() {


                    var blob = new Blob( [uInt8Array], {type: 'video/webm'} );
                
                    sourceBuffer.appendBuffer( uInt8Array );
             
                    if( video.paused ) {
                        video.play();
                    }

                    if( i === numChunks - 1 ) {
                        mediaSource.addEventListener('updateend', function() {
                            mediaSource.endOfStream();
                        });
                    }

                //}); 

                i++;
            }
        
        });
    });
}

function GET(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.send();

  xhr.onload = function() {
    if (xhr.status !== 200) {

      alert('Unexpected status code ' + xhr.status + ' for ' + url);
      return false;
    }
    callback(new Uint8Array(xhr.response));
  };
}


