// Initialize the socket.io library
// Start the socket.io server on port 3000
// Remember.. this also serves the socket.io.js file!
var io = require('socket.io').listen(3000);

var p1 = false; 
var p2 = false; 
var start = false;

// Listen for client connection event
// io.sockets.* is the global, *all clients* socket
// For every client that is connected, a separate callback is called
io.sockets.on('connection', function(socket){	
	

	// Listen for this client's "send" event
	// remember, socket.* is for this particular client
	socket.on('send', function(data) {
		console.log(p1);
		console.log(p2);
		console.log(p1&&p2);
		console.log(start);
		if (data.player == '1') p1 = true; 
		if (data.player == '2') p2 = true;
		// Since io.sockets.* is the *all clients* socket,
		// this is a broadcast message.
		
		// Broadcast a "receive" event with the data received from "send"
		io.sockets.emit('receive', data);
		if (!start){
			if (p1 && p2) {
				io.sockets.emit('receive', {start:true});
				start = true;
			}
		}
	});
});