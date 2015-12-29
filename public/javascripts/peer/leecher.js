function setupPeerConnection() {
    peerConnection = new RTCPeerConnection(peerConnectionConfig);
    peerConnection.onicecandidate = gotIceCandidate;
    peerConnection.ondatachannel = receiveChannelCallback;
    peerConnection.ondatachannel = receiveChannelCallback;
}

function handleSignaling(signal) {
    if (!peerConnection) {
        console.log("PeerConnection not initialized yet.");
    }
    else if(signal.sdp) {
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
            serverConnection.send(JSON.stringify({'sdp': description}));
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

function onSendChannelStateChange() {
    var readyState = channel.readyState;
    console.log('Send channel state is: ' + readyState);
}

function errorHandler(error) {
    console.log(error);
}