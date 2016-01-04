var chunks = [];
var chunkPos = 0;
var numChunks = 20;

window.MediaSource = window.MediaSource || window.WebKitMediaSource;
if (!window.MediaSource) {
    alert('MediaSource API is not available');
}

var video;

var mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', sourceOpen, false);
mediaSource.addEventListener('webkitsourceopen', sourceOpen, false);
var sourceBuffer;

function sourceOpen() {
    sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
    tryToAppendNextChunk();
    sourceBuffer.addEventListener('updateend', tryToAppendNextChunk);
}

function loadFullVideo(uInt8Array) {
    pageLog('video chunks received from server');
    chunks = splitIntoChunks(uInt8Array, numChunks);
    tryToAppendNextChunk();
    console.log("Video fetched from server.");
    pageLog('video fully loaded');
    video.play();
    startSeeding();
}

function loadByChunk(chunk) {
    chunks.push(chunk);
    tryToAppendNextChunk();
    if (chunks.length == numChunks) {
        pageLog('downloaded full video');
        startSeeding();
    }
}

$(document).ready(function() {
    video = document.querySelector('video');
    video.src = window.URL.createObjectURL(mediaSource);
});

function tryToAppendNextChunk() {
    if ((chunks.length - chunkPos) > 0
    && !sourceBuffer.updating) {
        sourceBuffer.appendBuffer(chunks[chunkPos]);
        chunkPos++;
        if (chunkPos == numChunks) {
            pageLog('video fully loaded');
            video.play();
        }
    }
}

function splitIntoChunks(uInt8Array, numChunks) {
    var queue = [];
    var chunkSize = Math.ceil(uInt8Array.length / numChunks);

    for (var i = 0; i < numChunks; i++) {
        var startByte = chunkSize * i;
        var chunk = uInt8Array.slice(startByte, startByte + chunkSize);
        queue.push(chunk);
    }
    return queue;
}