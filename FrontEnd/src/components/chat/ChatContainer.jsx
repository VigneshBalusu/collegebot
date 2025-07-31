import React, { useRef, useEffect, useState } from 'react';
import { useChatContext } from '../../context/ChatContext';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import QuickReplies from './QuickReplies';
import TypingIndicator from './TypingIndicator';
import { BookOpen, Minus, Maximize2, Minimize2 } from 'lucide-react';

// Inline quick replies
const quickReplies = [
  "Admission process",
  "Fee structure",
  "Hostel facilities",
  "Placement statistics",
  "Scholarships",
  "Library facilities",
  "Campus life",
  "Contact number",
  "Who is the principal?",
];

const ChatContainer = () => {
  const { messages, isTyping, sendMessage } = useChatContext();
  const containerRef = useRef(null);

  const [showFAQ, setShowFAQ] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const lastUserIndex = [...messages]
      .map((msg, i) => (msg.sender === 'user' ? i : null))
      .filter((i) => i !== null)
      .pop();

    if (
      typeof lastUserIndex === 'number' &&
      containerRef.current?.children[lastUserIndex]
    ) {
      const el = containerRef.current.children[lastUserIndex];
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].sender === 'bot') {
      setShowFAQ(false);
    }
  }, [messages]);

  const handleMouseDown = (e) => {
    if (isFullscreen) return;
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging || isFullscreen) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, isFullscreen]);

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-50 bg-blue-700 text-white p-3 rounded-full shadow-lg"
        title="Open Chat"
      >
        <BookOpen size={24} />
      </button>
    );
  }

  return (
    <div
      className={`
        fixed z-50 bg-white rounded-xl shadow-xl border border-gray-300
        overflow-hidden flex flex-col transition-all
        ${isFullscreen ? 'inset-0 w-full h-full m-0' : 'w-[380px] h-[550px]'}
      `}
      style={!isFullscreen ? { top: position.y, left: position.x } : {}}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-blue-800 text-white cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center">
          <BookOpen className="mr-2" size={24} />
          <div>
            <h2 className="font-semibold text-lg">RCE</h2>
            <p className="text-xs text-blue-200">Virtual Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="hover:text-blue-300"
            title="Minimize"
          >
            <Minus size={18} />
          </button>
          <button
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="hover:text-blue-300"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* Chat body */}
      <div
        className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-100 to-gray-50 relative"
        ref={containerRef}
      >
        {messages.map((message) => (
          <div key={message.id}>
            <ChatBubble message={message} />
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 my-2 ml-1 animate-fadeIn">
            <TypingIndicator />
            <span className="loader h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
          </div>
        )}

        {showFAQ && (
          <div
            className={`z-20 ${
              isFullscreen
                ? 'absolute bottom-28 right-4 max-w-sm'
                : 'mt-4'
            }`}
          >
            <div className="bg-white rounded-xl shadow-md border border-gray-300 p-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-gray-700">FAQ</p>
                <button
                  onClick={() => setShowFAQ(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Minus size={20} />
                </button>
              </div>
              <QuickReplies
                replies={quickReplies}
                onSelectReply={(reply) => {
                  setShowFAQ(false);
                  sendMessage(reply);
                }}
              />
            </div>
          </div>
        )}
      </div>

      <ChatInput onSendMessage={sendMessage} disabled={isTyping} />

      {!showFAQ && (
        <button
          onClick={() => setShowFAQ(true)}
          className="absolute bottom-24 right-4 z-50 p-2 rounded-full shadow-md bg-white border border-gray-300"
          title="Open FAQ"
        >
          <BookOpen className="text-blue-700" size={20} />
        </button>
      )}
    </div>
  );
};

export default ChatContainer;
