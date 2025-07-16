import React from 'react';
import Button from '../ui/Button';

const QuickReplies = ({ replies, onSelectReply }) => {
  return (
    <div className="py-3 px-2">
      <p className="text-sm text-gray-600 mb-2 px-2">Frequently asked questions:</p>
      <div className="flex flex-wrap gap-2">
        {replies.map((reply) => (
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