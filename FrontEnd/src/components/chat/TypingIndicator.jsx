import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 p-3 max-w-[100px] bg-gray-100 rounded-2xl rounded-tl-none mb-4">
      <span
        className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
        style={{ animationDelay: '0s' }}
      ></span>
      <span
        className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
        style={{ animationDelay: '0.2s' }}
      ></span>
      <span
        className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
        style={{ animationDelay: '0.4s' }}
      ></span>
    </div>
  );
};

export default TypingIndicator;
