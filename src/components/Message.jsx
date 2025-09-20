
import React from 'react';

const Message = ({ message, isUser }) => {
  return (
    <div className={`message ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className="message-avatar">
        {isUser ? '👤' : '🤖'}
      </div>
      <div className="message-content">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Message;