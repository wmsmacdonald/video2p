'use strict';

/* globals FileError */

// get video file via XHR
// store with File API
// read Blob from File API and set as video src using createObjectUrl()
// play video
//

var peer = new Peer('1', {host: 'quotacle.com', port: 9000, path: '/', debug: true});

var conn = peer.connect('2');


var video = document.querySelector('video');

var numChunks = 5;

var i = 0;
function getVideo() {
  GET('/chrome.webm', function(uInt8Array) {
    /*var blob = new Blob([uInt8Array], {
      type: 'video/webm'
    });*/

    conn.on('open', function() {
        
        while( i < numChunks ) {

            var chunkSize = Math.ceil( uInt8Array.length / numChunks );
            var startByte = chunkSize * i;
            var chunk = uInt8Array.slice( startByte, startByte + chunkSize );

            console.log( "sending chunk " + i );
            conn.send (uInt8Array );
            console.log( "sent chunk " + i );
            
            i++;
        }
    });
    //writeToFile(fileEntry, blob);
  });
}

getVideo();

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

