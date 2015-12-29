window.MediaSource = window.MediaSource || window.WebKitMediaSource;
if (!!!window.MediaSource) {
    alert('MediaSource API is not available');
}

var mediaSource = new MediaSource();
var video;

$(document).ready(function() {
    video = document.querySelector('video');
    video.src = window.URL.createObjectURL(mediaSource);
});

mediaSource.addEventListener('sourceopen', sourceOpen, false);
mediaSource.addEventListener('webkitsourceopen', sourceOpen, false);

var chunkQueue = [];
var sourceBuffer;

function sourceOpen(e) {
    sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
    console.log(sourceBuffer);
    sourceBuffer.addEventListener('updateend', appendBuffer);
}

var chunksReceived = 0;
function onReceiveMessageCallback(event) {
    console.log("recieving chunk " + chunksReceived);
    chunksReceived++;
    chunkQueue.push(event.data);
    appendBuffer();
}

var chunksAdded = 0;
function appendBuffer() {
    if (chunkQueue.length > 0 && !sourceBuffer.updating) {
        console.log("appending buffer " + chunksAdded);
        sourceBuffer.appendBuffer(chunkQueue.shift());
        chunksAdded++;
        if (chunksAdded > 50) {
            video.play();
        }
    }

}

function GET(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.send();

    xhr.onload = function () {
        if (xhr.status !== 200) {

            alert('Unexpected status code ' + xhr.status + ' for ' + url);
            return false;
        }
        callback(new Uint8Array(xhr.response));
    };
}
