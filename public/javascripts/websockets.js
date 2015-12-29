var WS_HOST = 'ws://127.0.0.1:3434';
serverConnection = new WebSocket(WS_HOST);

var SocketsError = {};

SocketsError.unexpected = function unexpected(expectedMessages, receivedMessage) {
    console.log('Sockets Error: expected properties ' + expectedMessages +
        ' but received ' + JSON.stringify(receivedMessage));
};