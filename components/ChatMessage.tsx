
import React, { useState, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { BotIcon, UserIcon } from './Icons';

// A simple hook for the typewriter effect
const useTypewriter = (text: string, speed: number = 20) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!text) return;
    
    let i = 0;
    // Reset text before typing
    setDisplayedText(''); 
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return displayedText;
};

const parseBoldAndRender = (text: string) => {
    // Replace markdown **bold** with <strong> tags
    const processedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return { __html: processedText || '&nbsp;' }; // Use &nbsp; to maintain space for empty lines
};


interface ChatMessageProps {
  message: ChatMessage;
}

export const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';
  const isInitialMessage = message.id === 'init';
  
  // Apply typewriter effect only to the initial welcome message
  const content = (isModel && isInitialMessage) ? useTypewriter(message.content) : message.content;

  const modelClasses = 'bg-gray-800/50 border border-cyan-500/20 text-gray-200 font-serif';
  const userClasses = 'bg-cyan-600/70 text-white';

  return (
    <div className={`flex items-start gap-4 my-6 ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && <BotIcon />}
      <div
        className={`max-w-xl px-5 py-3 rounded-lg shadow-lg ${
          isModel
            ? modelClasses
            : userClasses
        }`}
      >
        <div className="prose prose-invert prose-sm max-w-none">
          {content ? content.split('\n').map((line, index) => (
            <p 
              key={index} 
              className="mb-2 last:mb-0"
              dangerouslySetInnerHTML={parseBoldAndRender(line)}
            />
          )) : <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse-fast"></div>}
        </div>
      </div>
      {!isModel && <UserIcon />}
    </div>
  );
};
