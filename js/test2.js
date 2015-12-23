//'var peer = new Peer('2', {host: 'quotacle.com', port: 9000, path: '/', debug: true});
var peer = new Peer({key: 'b6xifzskur3sor'});

peer.on( 'connection', function( conn ) {
    conn.on( 'data', function(data) {
      console.log(data);
    });
});
