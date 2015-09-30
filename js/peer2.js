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


var numChunks = 5;

var i = 0;

function sourceOpen(e) {
    var sourceBuffer = mediaSource.addSourceBuffer( 'video/webm; codecs="vorbis,vp8"' );

    peer.on( 'connection', function( conn ) {
        conn.on( 'data', function(uInt8Array) {
            console.log("receiving chunk " + i);

            console.log( i < numChunks );
            if( i < numChunks ) {

                var reader = new FileReader();

                reader.onload = function( idx ) {

                    var blob = new Blob( [uInt8Array], {type: 'video/webm'} );
                
                    sourceBuffer.appendBuffer( new Uint8Array( e.target.result ) );
             
                    if( video.paused ) {
                        video.play();
                    }

                    if( i === numChunks - 1 ) {
                        mediaSource.endOfStream();
                    }

                } 

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


