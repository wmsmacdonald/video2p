var videoChunkQueue = [];
var numChunks = 1000;

window.MediaSource = window.MediaSource || window.WebKitMediaSource;
if (!window.MediaSource) {
    alert('MediaSource API is not available');
}

var video;
var videoData;

var mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', sourceOpen, false);
mediaSource.addEventListener('webkitsourceopen', sourceOpen, false);
var sourceBuffer;

function sourceOpen(e) {
    sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
    sourceBuffer.addEventListener('updateend', tryToAppendNextChunk);
}

function loadFullVideo(uInt8Array) {
    videoData = uInt8Array;
    var chunkSize = Math.ceil(videoData.length / numChunks);

    for (var i = 0; i < numChunks; i++) {
        var startByte = chunkSize * i;
        var chunk = videoData.slice(startByte, startByte + chunkSize);
        videoChunkQueue.push(chunk);
        tryToAppendNextChunk();
    }
    console.log("Video fetched from server.");
    startSeeding();
}

function loadByChunk(chunk) {
    videoChunkQueue.push(chunk);
    tryToAppendNextChunk();
}

$(document).ready(function() {
    video = document.querySelector('video');
    video.src = window.URL.createObjectURL(mediaSource);
});

function tryToAppendNextChunk() {
    if (videoChunkQueue.length > 0 && !sourceBuffer.updating) {
        sourceBuffer.appendBuffer(videoChunkQueue.shift());
    }
}