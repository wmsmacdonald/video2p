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
var numChunks = 500;
var chunkQueue = [];

function sourceOpen(e) {
    var sourceBuffer = mediaSource.addSourceBuffer( 'video/webm; codecs="vorbis,vp8"' );
    console.log(sourceBuffer);

    peer.on( 'connection', function( conn ) {
        conn.on( 'data', function(uInt8Array) {
            console.log("receiving chunk " + i);

            if( i  < numChunks ) {
                //chunkQueue.push( sourceBuffer.appendBuffer( uInt8Array ) );
                if ( sourceBuffer.updating ) {
                    sourceBuffer.addEventListener( 'updateend', function() { sourceBuffer.appendBuffer( uInt8Array ) } );
		}
		else {
                    sourceBuffer.appendBuffer( uInt8Array );
                }
                /*if( i === numChunks - 1 ) {
                    chunkQueue.push( "end" );
                }*/

                i++;
            }
        
        });
    });

    var loadChunk = function() {
        if( chunkQueue.length !== 0) {
            if ( !sourceBuffer.updating ) {
                sourceBuffer.appendBuffer( chunkQueue.shift() );
            }
        }
        
        /*else if ( chunkQueue[0] === "end" ) {
            mediaSource.endOfStream();
        }*/
    }

    //setTimeout( loadChunk, 1000 );

    /*sourceBuffer.addEventListener( 'updateend', function() {
	if( chunkQueue.length !== 0) {
            console.log( "appending buffer" );
            sourceBuffer.appendBuffer( chunkQueue.shift() );
        }
    } );*/
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
