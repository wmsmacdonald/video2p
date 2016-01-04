var seederChannel;

function startSeeding() {
    pageLog('ready to seed peer');
    console.log("Starting seeding.");
    serverConnection.send(JSON.stringify({ seeder: true }));
}

serverConnection.onmessage = gotMessageFromServer;

function setUpSeeder() {
    pageLog('seeding peer');
    console.log("Starting to seed peer.")
    peerConnection = new RTCPeerConnection(peerConnectionConfig);
    seederChannel = peerConnection.createDataChannel('sendDataChannel', {});
    peerConnection.onicecandidate = gotIceCandidate;
    seederChannel.onopen = sendVideoData;

    pageLog('creating offer');
    peerConnection.createOffer(gotDescription, errorHandler);
}


function sendVideoData() {
    for (var i = 0; i < chunks.length; i++) {
        seederChannel.send(chunks[i]);
    }
    startSeeding();
}