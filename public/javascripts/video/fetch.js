serverConnection = new WebSocket(WS_HOST);
serverConnection.onmessage = gotMessageFromServer;

serverConnection.onopen = function askForSource() {
    serverConnection.send(JSON.stringify({ askForSource: true }));
};

function gotMessageFromServer(message) {
    var data = JSON.parse(message.data);

    if (data.server) {
        GET('videos/elephant_dream.webm', loadFullVideo);
    }

    else if (data.beginLeecher) {
        setUpLeecher();
    }

    else if (data.beginSeeder) {
        setUpSeeder();
    }

    else if (data.signaling) {
        handleSignaling(data);
    }

    else {
        SocketsError.unexpected(['server','beginLeecher','beginSeeder','signaling'], data);
    }
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