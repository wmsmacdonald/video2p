var WS_HOST = 'ws://127.0.0.1:3434';
var peerConnection;
var peerConnectionConfig = {'iceServers': [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]};
var channel;
var receiveChannel;

navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

function pageReady() {
    serverConnection = new WebSocket(WS_HOST);
    serverConnection.onmessage = gotMessageFromServer;
}

function setupPeerConnection() {
    peerConnection = new RTCPeerConnection(peerConnectionConfig);
    //channel = peerConnection.createDataChannel('sendDataChannel');
    peerConnection.onicecandidate = gotIceCandidate;
    //channel.onopen = onSendChannelStateChange;
    peerConnection.ondatachannel = receiveChannelCallback;
}

function gotMessageFromServer(message) {
    if(!peerConnection) setupPeerConnection();

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
    console.log('got ice candidate');
    if(event.candidate != null) {
        serverConnection.send(JSON.stringify({signaling: true, 'ice': event.candidate}));
    }
}

function gotDescription(description) {
    console.log('got description');
    peerConnection.setLocalDescription(description, function () {
            serverConnection.send(JSON.stringify({signaling: true, 'sdp': description}));
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