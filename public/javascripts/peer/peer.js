var peerConnection;
var peerConnectionConfig = {'iceServers': [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]};

navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;


function handleSignaling(signal) {
    if (!peerConnection) {
        console.log("PeerConnection not initialized yet.");
    }
    else if(signal.sdp) {
        console.log('Received remote SDP');
        peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp), function() {
            peerConnection.createAnswer(gotDescription, errorHandler);
        }, errorHandler);
    }
    else if(signal.ice) {
        console.log('Received remote ICE candidate');
        peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice));
    }
    else {
        console.log('signal not recognized');
    }
}

function gotIceCandidate(event) {
    console.log('Got ice candidate');
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

function errorHandler(error) {
    console.log(error);
}