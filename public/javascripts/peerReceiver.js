var peerConnection;
var peerConnectionConfig = {'iceServers': [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]};
var channel;
var dataConstraint;
var recieveChannel;

navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

function pageReady() {

    serverConnection = new WebSocket('ws://127.0.0.1:3434');
    serverConnection.onmessage = gotMessageFromServer;

    var constraints = {
        video: true,
        audio: false
    };

}

function start(isCaller) {
    peerConnection = new RTCPeerConnection(peerConnectionConfig);
    channel = peerConnection.createDataChannel('sendDataChannel', dataConstraint);
    peerConnection.onicecandidate = gotIceCandidate;
    channel.onopen = onSendChannelStateChange;
    peerConnection.ondatachannel = receiveChannelCallback;


    if(isCaller) {
        peerConnection.createOffer(gotDescription, errorHandler);
    }
}

function gotMessageFromServer(message) {
    if(!peerConnection) start(false);

    var signal = JSON.parse(message.data);
    if(signal.sdp) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp), function() {
            peerConnection.createAnswer(gotDescription, errorHandler);
        }, errorHandler);
    } else if(signal.ice) {
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
    recieveChannel = event.channel;
    recieveChannel.onmessage = onReceiveMessageCallback;
}

function onSendChannelStateChange() {
    var readyState = channel.readyState;
    console.log('Send channel state is: ' + readyState);
}

function errorHandler(error) {
    console.log(error);
}