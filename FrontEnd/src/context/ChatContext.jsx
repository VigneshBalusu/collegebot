import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { v4 as uuidv4 } from 'uuid';

const ChatContext = createContext(undefined);

const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const hasWelcomed = useRef(false);

  const addMessage = useCallback((content, sender) => {
    const newMessage = {
      id: uuidv4(),
      content,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  useEffect(() => {
    if (!hasWelcomed.current) {
      addMessage("👋 Hello! I'm the RCE virtual assistant. How can I help you today?", 'bot');
      hasWelcomed.current = true;
    }
  }, [addMessage]);

  const sendMessage = useCallback(
    async (content) => {
      if (!content || !content.trim()) return;

      addMessage(content, 'user');
      setIsTyping(true);

      try {
       const API_BASE_URL = import.meta.env.VITE_API_URL;

        const responsePromise = fetch(`${API_BASE_URL}/chat/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: content }),
        });

        const [res] = await Promise.all([
          responsePromise,
          new Promise((resolve) => setTimeout(resolve, 800)), // Simulate typing delay
        ]);

        const data = await res.json();
        const reply = data.answer || data.error || "⚠️ No response from the assistant.";
        addMessage(reply, 'bot');
      } catch (error) {
        console.error('❌ Error contacting backend:', error);
        addMessage("❌ Couldn't reach the assistant. Try again later.", 'bot');
      } finally {
        setIsTyping(false);
      }
    },
    [addMessage]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    hasWelcomed.current = false;
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isTyping,
        addMessage,
        sendMessage,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider, useChatContext };
