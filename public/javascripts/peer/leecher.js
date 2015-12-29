var leecherChannel;

function setUpLeecher() {
    peerConnection = new RTCPeerConnection(peerConnectionConfig);
    peerConnection.onicecandidate = gotIceCandidate;
    peerConnection.ondatachannel = leechChannelCallback;
}

function leechChannelCallback(event) {
    console.log('Receive Channel Callback');
    leecherChannel = event.channel;
    receiveChannel.onmessage = loadByChunk(event.data);
}

function errorHandler(error) {
    console.log(error);
}