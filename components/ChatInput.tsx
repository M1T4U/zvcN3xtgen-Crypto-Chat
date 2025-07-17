
import React, { useState } from 'react';
import { SendIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="p-4 bg-black/30 backdrop-blur-sm border-t border-cyan-500/20">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command or query..."
          disabled={isLoading}
          className="flex-grow w-full px-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-gray-500 transition-all duration-300 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="p-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 rounded-full text-white transition-all duration-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-cyan-400"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            <SendIcon />
          )}
        </button>
      </form>
    </div>
  );
};
