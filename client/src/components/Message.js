import React from 'react';

const Message = ({ message }) => {
	return (
		<div
			className={message.ownedByCurrentUser ? 'user-message' : 'other-message'}
		>
			<p className='meta'>
				{message.username} <span>{message.time}</span>
			</p>
			<p className='text'>{message.text}</p>
		</div>
	);
};

export default Message;
