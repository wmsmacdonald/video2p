'use strict';

var peer = new Peer('2', {host: 'quotacle.com', port: 9000, path: '/'});

window.MediaSource = window.MediaSource || window.WebKitMediaSource;
if (!!!window.MediaSource) {
      alert('MediaSource API is not available');
}

var mediaSource = new MediaSource();

var video = document.querySelector('video');
video.src = window.URL.createObjectURL( mediaSource );

mediaSource.addEventListener('sourceopen', sourceOpen, false);
mediaSource.addEventListener('webkitsourceopen', sourceOpen, false);

var i = 0;
var chunks = [];
var numChunks = 1;

function sourceOpen(e) {
    var sourceBuffer = mediaSource.addSourceBuffer( 'video/webm; codecs="vorbis,vp8"' );
    console.log(sourceBuffer);

    peer.on( 'connection', function( conn ) {
        conn.on( 'data', function(uInt8Array) {
            console.log("receiving chunk " + i);

            if( i  < numChunks ) {

                chunks.push( uInt8Array );
                
                console.log(mediaSource.readyState);

                sourceBuffer.appendBuffer( uInt8Array );
             
                if( video.paused ) {
                    video.play();
                }

                if( i === numChunks - 1 ) {
                    mediaSource.addEventListener('updateend', function() {
                        mediaSource.endOfStream();
                    });
                    //var combinedBlob = new Blob( chunks );
                    /*GET("/video.webm", function( uInt8Array ) {
                        var blob = new Blob( uInt8Array );
                        if ( blob == combinedBlob ) {
                            console.log( "No data loss." );
                        }
                        else {
                            console.log( "Data loss." );
                        }
                    });*/

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


