import React, { useState } from 'react';

const Home = () => {
	const [username, setUsername] = useState('');
	const [roomName, setRoomName] = useState('');

	const handleUsernameChange = e => {
		setUsername(e.target.value);
	};

	const handleRoomNameChange = e => {
		setRoomName(e.target.value);
	};

	return (
		<div className='join-container'>
			<header className='join-header'>
				<h1>
					<i className='fas fa-smile'></i> ChitChat
				</h1>
			</header>
			<main className='join-main'>
				<form action={`/${roomName}`}>
					<div className='form-control'>
						<label htmlFor='username'>Username</label>
						<input
							type='text'
							name='username'
							id='username'
							placeholder='Enter username...'
							value={username}
							onChange={handleUsernameChange}
							required
						/>
					</div>
					<div className='form-control'>
						<label htmlFor='room'>Room</label>
						{/* <input
							type='text'
							name='room'
							class='room'
							placeholder='Create or join room'
							value={roomName}
							onChange={handleRoomNameChange}
							required
						/> */}
						<select
							name='room'
							class='room'
							required
							onChange={handleRoomNameChange}
							defaultValue={'default'}
						>
							<option value='default' disabled>
								Choose room...
							</option>
							<option value='JavaScript'>JavaScript</option>
							<option value='Python'>Python</option>
							<option value='PHP'>PHP</option>
							<option value='C#'>C#</option>
							<option value='Ruby'>Ruby</option>
							<option value='Java'>Java</option>
						</select>
					</div>
					<button type='submit' className='btn'>
						Join Chat
					</button>
				</form>
			</main>
		</div>
	);
};

export default Home;
