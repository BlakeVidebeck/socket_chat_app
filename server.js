const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

// Run when a client connects
io.on('connection', socket => {
	// join a room
	socket.on('joinRoom', ({ username, room }) => {
		const user = userJoin(socket.id, username, room);
		socket.join(user.room);

		// Emit to only the client
		socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

		// Broadcast when a client connects - emit to everyone but the client
		socket.broadcast
			.to(user.room)
			.emit(
				'message',
				formatMessage(botName, `${user.username} has joined the chat`)
			);

		// send users and room info
		io.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomUsers(user.room)
		});
	});

	// Listen for chatMessage
	socket.on('chatMessage', msg => {
		const user = getCurrentUser(socket.id);

		io.to(user.room).emit('message', formatMessage(user.username, msg));
	});

	// Run when a client disconnects
	socket.on('disconnect', () => {
		const user = userLeave(socket.id);

		if (user) {
			// Emit to all the clients
			io.to(user.room).emit(
				'message',
				formatMessage(botName, `${user.username} has left the chat`)
			);

			// send users and room info
			io.to(user.room).emit('roomUsers', {
				room: user.room,
				users: getRoomUsers(user.room)
			});
		}
	});
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server listening on PORT: ${PORT}`));
