import React from 'react';

const ChatBubble = ({ message }) => {
  const isBot = message.sender === 'bot';

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(message.timestamp));

  // Handle both string and object messages safely
  const renderContent =
    typeof message.content === 'object'
      ? JSON.stringify(message.content, null, 2)
      : message.content;

  return (
    <div
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4 animate-fadeIn`}
      style={{
        animationDuration: '0.3s',
        animationFillMode: 'both',
      }}
    >
      <div
        className={`max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl ${
          isBot
            ? 'bg-white text-gray-800 shadow-sm rounded-tl-none'
            : 'bg-blue-800 text-white rounded-tr-none'
        }`}
      >
        <pre className="whitespace-pre-wrap font-sans text-sm">
          {renderContent}
        </pre>
        <div className={`text-xs mt-1 ${isBot ? 'text-gray-500' : 'text-blue-200'}`}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
