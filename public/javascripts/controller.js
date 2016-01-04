var WS_HOST = 'ws://127.0.0.1:3434';

serverConnection = new WebSocket(WS_HOST);
serverConnection.onmessage = gotMessageFromServer;

serverConnection.onopen = function askForSource() {
    pageLog('asking server if peer available');
    serverConnection.send(JSON.stringify({ askForSource: true }));
};

function gotMessageFromServer(message) {
    var data = JSON.parse(message.data);

    if (data.server) {
        pageLog('peer not available')
        GET('videos/test.webm', loadFullVideo);
    }

    else if (data.beginLeecher) {
        pageLog('peer is available');
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

var SocketsError = {};
SocketsError.unexpected = function unexpected(expectedMessages, receivedMessage) {
    console.log('Sockets Error: expected properties ' + expectedMessages +
        ' but received ' + JSON.stringify(receivedMessage));
};

function pageLog(str) {
    $('#log-box').append('<p>' + str + '</p>');
    updateScroll();
}

function updateScroll(){
    var element = document.getElementById("log-box");
    element.scrollTop = element.scrollHeight;
}