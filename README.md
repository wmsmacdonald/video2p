# Peer to peer video delivery demo

In this demo, the browser forms a connection with a peer browser, if available, and downloads 
the video data directly from that peer. A signaling server negotiates the connections.

The signaling and content server is written in Node.js and uses WebSockets. The front end JavaScript 
takes advantage of the WebRTC APIs, particularly PeerConnection. It also uses the MediaSource API to 
append video chunks onto an URL object.

### Working demo: http://quotacle.com:3000

To run the server on your own:

`npm start`
