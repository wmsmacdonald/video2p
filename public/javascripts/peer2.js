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

var i = 0;
var numChunks = 5;
var chunkQueue = [];
var sourceBuffer;
var error = false;

function sourceOpen(e) {
    sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
    console.log(sourceBuffer);
    sourceBuffer.addEventListener('updateend', function appendBuffer() {
        console.log("finished appending");
        if (chunkQueue.length > 0 && !sourceBuffer.updating) {
            console.log("queue append " + i);
            sourceBuffer.appendBuffer(chunkQueue.shift());
        }
    });
}

function onReceiveMessageCallback(event) {
    if (!error) {
        console.log(event.data);
        if (sourceBuffer.updating || chunkQueue > 0) {
            chunkQueue.push(event.data);
        }
        else {
            console.log("empty");
            try {
                sourceBuffer.appendBuffer(event.data);
            }
            catch (e) {
                error = true;
                console.log("failed at " + i);
                throw e;
            }
        }
    }
    i++;
}

function appendBuffer() {
    if (chunkQueue.length > 0 && !sourceBuffer.updating) {
        sourceBuffer.appendBuffer(chunkQueue.shift());
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
