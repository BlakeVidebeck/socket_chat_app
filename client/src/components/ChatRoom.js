import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import socketIOClient from 'socket.io-client';
import Qs from 'qs';
const socket = socketIOClient();

const ChatRoom = props => {
	const { username, room } = Qs.parse(props.location.search, {
		ignoreQueryPrefix: true
	});
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState('');

	const [users, setUsers] = useState([]);

	const chatboxRef = useRef();

	useEffect(() => {
		// Join chatroom
		socket.emit('joinRoom', { username, room });

		// Message from server
		socket.on('message', message => {
			const incomingMessage = {
				...message,
				ownedByCurrentUser: message.username === username
			};

			// //outputMessage function
			setMessages(messages => [...messages, incomingMessage]);

			// Scroll down
			chatboxRef.current.scrollIntoView({ behavior: 'smooth' });

			// Get room and users
			socket.on('roomUsers', ({ users }) => {
				setUsers(users);
			});
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [room]);

	const handleNewMessageChange = e => {
		setNewMessage(e.target.value);
	};

	const onSubmit = e => {
		e.preventDefault();
		socket.emit('chatMessage', newMessage);
		setNewMessage('');
		e.target.value = '';
		e.target.focus();
	};

	return (
		<div className='chat-container'>
			<header className='chat-header'>
				<h1>
					<i className='fas fa-smile'></i> ChitChat
				</h1>
				<a href='/' className='btn'>
					Leave Room
				</a>
			</header>
			<main className='chat-main'>
				<div className='chat-sidebar'>
					<h3>
						<i className='fas fa-comments'></i> Room Name:
					</h3>
					<h2 id='room-name'>{room}</h2>
					<h3>
						<i className='fas fa-users'></i> Users
					</h3>
					<ul id='users'>
						{users.map((user, i) => (
							<li key={i}>{user.username}</li>
						))}
					</ul>
				</div>
				<div className='chat-messages'>
					{messages.map((message, i) => (
						<Message key={i} message={message} />
					))}
					<div ref={chatboxRef} />
				</div>
			</main>
			<div className='chat-form-container'>
				<form id='chat-form' onSubmit={onSubmit}>
					<input
						id='msg'
						type='text'
						value={newMessage}
						onChange={handleNewMessageChange}
						placeholder='Enter Message...'
						required
					/>
					<button className='btn'>
						<i className='fas fa-paper-plane'></i> Send
					</button>
				</form>
			</div>
		</div>
	);
};

export default ChatRoom;
