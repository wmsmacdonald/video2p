var numChunks = 5;
var i = 0;
function sendVideo() {
    GET('videos/test.webm', function (uInt8Array) {
        var chunkSize = Math.ceil(uInt8Array.length / numChunks);

        while (i < numChunks) {

            //console.log( "chunk size: " + chunkSize );
            var startByte = chunkSize * i;
            //console.log( "start byte: " + startByte );
            var chunk = uInt8Array.slice(startByte, startByte + chunkSize);
            console.log("sending chunk " + i);
            channel.send(chunk);
            console.log("sent chunk " + i);

            i++;
        }
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