'use strict';

GET('chrome.webm', loadVideo);

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

var blob;
var objectUrl;

function loadVideo(uInt8Array) {
    blob = new Blob([uInt8Array]);
    objectUrl = URL.createObjectURL(blob);
    var video = document.querySelector('video');
    video.src = objectUrl;
}

function switchObjectUrl() {
    var video = document.querySelector('video');
    window.URL.revokeObjectURL(objectUrl);   
    video.src = URL.createObjectURL(blob);   
}
