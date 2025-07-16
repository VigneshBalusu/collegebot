import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatContainer from './chat/ChatContainer';
import { ChatProvider } from '../context/ChatContext';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
      setIsOpen(true);
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className={`
            flex items-center justify-center rounded-full 
            shadow-lg transition-all duration-300 ease-in-out
            ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-800 hover:bg-blue-700'}
            ${isOpen ? 'h-12 w-12' : 'h-16 w-16'}
          `}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <div className="flex flex-col items-center justify-center text-white">
              <MessageCircle size={24} />
              <span className="text-xs mt-1 font-medium">Chat</span>
            </div>
          )}
        </button>
      </div>

      {/* Chat Container */}
      {isOpen && (
        <ChatProvider>
          <ChatContainer />
        </ChatProvider>
      )}
    </>
  );
};

export default ChatWidget;
