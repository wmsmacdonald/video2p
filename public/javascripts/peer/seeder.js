var seederChannel;

function startSeeding() {
    console.log("Starting seeding.");
    serverConnection.send(JSON.stringify({ seeder: true }));
}

serverConnection.onmessage = gotMessageFromServer;

function setUpSeeder() {
    console.log("Starting to seed peer.")
    peerConnection = new RTCPeerConnection(peerConnectionConfig);
    seederChannel = peerConnection.createDataChannel('sendDataChannel', {});
    peerConnection.onicecandidate = gotIceCandidate;
    seederChannel.onopen = sendVideoData;

    peerConnection.createOffer(gotDescription, errorHandler);
}


function sendVideoData() {
    for (var i = 0; i < chunks.length; i++) {
        seederChannel.send(chunks[i]);
    }
    startSeeding();
}