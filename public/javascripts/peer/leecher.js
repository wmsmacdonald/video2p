var leecherChannel;

function setUpLeecher() {
    pageLog('setting up peer connection');
    console.log("Fetching video from peer.");
    peerConnection = new RTCPeerConnection(peerConnectionConfig);
    peerConnection.onicecandidate = gotIceCandidate;
    peerConnection.ondatachannel = leechChannelCallback;
}

function leechChannelCallback(event) {
    console.log('Receive Channel Callback');
    leecherChannel = event.channel;
    leecherChannel.onmessage = leechMessageCallback;
}

function leechMessageCallback(message) {
    loadByChunk(message.data);
}

function errorHandler(error) {
    console.log(error);
}