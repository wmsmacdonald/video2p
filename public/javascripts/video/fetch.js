serverConnection = new WebSocket(WS_HOST);
serverConnection.onmessage = gotMessageFromServer;

serverConnection.onopen = function askForSource() {
    serverConnection.send(JSON.stringify({ askForSource: true }));
}

function gotMessageFromServer(message) {

    var data = JSON.parse(message.data);

    if (data.server) {
        $('video').attr('src', 'videos/elephant_dream.webm').load().get(0).play();
        console.log("Video fetched from server.");
    }

    else if (data.beginPeerConnection) {
        setupPeerConnection();
        console.log("Fetching video from peer.")
    }

    else if (data.signaling) {
        handleSignaling(data.signaling);
    }
}