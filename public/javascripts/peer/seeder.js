function startSeeding() {
    serverConnection.send({ seeder: true });
}

serverConnection.onmessage = gotMessageFromServer;

function gotMessageFromServer(message) {
    var data = JSON.parse(message.data);

    if (data.beginPeerConnection) {
        beginPeerConnection();
    }
    else if (data.signaling) {
        handleSignaling(data);
    }
    else {
        SocketsError.unexpected(['beginSeeding','signaling'], data);
    }
}

function beginPeerConnection() {
    peerConnection = new RTCPeerConnection(peerConnectionConfig);
    channel = peerConnection.createDataChannel('sendDataChannel', dataConstraint);
    peerConnection.onicecandidate = gotIceCandidate;
    channel.onopen = onSendChannelStateChange;
    peerConnection.ondatachannel = receiveChannelCallback;

    peerConnection.createOffer(gotDescription, errorHandler);
}

function handleSignaling(signal) {
    if(signal.sdp) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp), function() {
            peerConnection.createAnswer(gotDescription, errorHandler);
        }, errorHandler);
    }
    else if(signal.ice) {
        peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice));
    }
}

function gotIceCandidate(event) {
    if(event.candidate != null) {
        serverConnection.send(JSON.stringify({'ice': event.candidate}));
    }
}

function gotDescription(description) {
    console.log('got description');
    peerConnection.setLocalDescription(description, function () {
            serverConnection.send(JSON.stringify({ signaling: true, sdp: description}));
        },
        function() {
            console.log('set description error')
        }
    );
}

function receiveChannelCallback(event) {
    console.log('Receive Channel Callback');
    receiveChannel = event.channel;
    receiveChannel.onmessage = onReceiveMessageCallback;
}

function onReceiveMessageCallback(event) {
    console.log('Received Message');
}

function onSendChannelStateChange() {
    var readyState = channel.readyState;
    console.log('Send channel state is: ' + readyState);
}

function errorHandler(error) {
    console.log(error);
}