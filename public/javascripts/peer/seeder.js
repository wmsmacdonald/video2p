var seederChannel;

function startSeeding() {
    console.log("Starting seeding.");
    serverConnection.send(JSON.stringify({ seeder: true }));
}

serverConnection.onmessage = gotMessageFromServer;

function setUpSeeder() {
    peerConnection = new RTCPeerConnection(peerConnectionConfig);
    seederChannel = peerConnection.createDataChannel('sendDataChannel', {});
    peerConnection.onicecandidate = gotIceCandidate;
    seederChannel.onopen = sendVideoData;

    peerConnection.createOffer(gotDescription, errorHandler);
}


function sendVideoData() {
    var chunkSize = Math.ceil(videoData.length / numChunks);

    for (var i = 0; i < numChunks; i++) {
        var startByte = chunkSize * i;
        var chunk = videoData.slice(startByte, startByte + chunkSize);
        seederChannel.send(chunk)
    }
    startSeeding();
}