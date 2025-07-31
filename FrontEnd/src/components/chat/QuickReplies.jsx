// QuickReplies.jsx
import React from 'react';
import Button from '../ui/Button';

const quickReplies = [
  { id: 1, text: 'What courses are offered?', query: 'What courses are offered?' },
  { id: 2, text: 'How to apply?', query: 'How can I apply for admission?' },
  { id: 3, text: 'Fees structure?', query: 'What is the fees structure?' },
  { id: 4, text: 'Hostel facility?', query: 'Do you have hostel facilities?' }
];

const QuickReplies = ({ onSelectReply }) => {
  return (
    <div className="py-3 px-2">
      <p className="text-sm text-gray-600 mb-2 px-2">Frequently asked questions:</p>
      <div className="flex flex-wrap gap-2">
        {quickReplies.map((reply) => (
          <Button
            key={reply.id}
            variant="outline"
            size="sm"
            onClick={() => onSelectReply(reply.query)}
            className="text-xs whitespace-nowrap"
          >
            {reply.text}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickReplies;
