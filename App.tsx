import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { ChatMessage } from './types';
import { ChatMessageComponent } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';

// ✅ Correct way to access API key in Vite:
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const SYSTEM_INSTRUCTION = `You are zvcNxtgen, a fast, knowledgeable, and always up-to-date AI chatbot. Your mission is to help users instantly understand anything related to:
- Crypto trading (technical analysis, patterns, strategies)
- Web3 technologies (blockchain, NFTs, DAOs, DeFi)
- Market trends (Bitcoin, altcoins, ETFs)
- Exchanges, wallets, and security best practices
- Smart contracts and tokenomics

Your tone is futuristic, sharp, confident, and helpful. Be direct and beginner-friendly when needed, but also dive deep for advanced users. Respond immediately, as if you're in a live trading terminal or blockchain dev hub.

When giving examples, use real market scenarios and up-to-date insights. Keep responses practical, with code, visuals, or formulas when necessary.

IMPORTANT: Always end your responses with a quick, engaging follow-up question like "Want me to break that down further?", "Need a chart or example with that?", or "What's our next move?".`;

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      content: `Welcome to zvcNxtgen, your AI copilot for the crypto world.

I'm here to help you navigate everything from complex trading charts to the latest in Web3 technology. Whether you're a beginner trying to understand what an NFT is, or a pro deep-diving into DAO governance, I've got your back.

Think of me as your personal guide through the new digital economy. I deliver fast, clear answers without the fluff.

Ask me anything. Let's get started.`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatRef = useRef<Chat | null>(null);
  const chatHistoryEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!API_KEY) {
      setError('API_KEY environment variable not found. Please check your .env file and make sure VITE_GOOGLE_API_KEY is set.');
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      chatRef.current = ai.chats.create({
        model: 'gemini-1.5-flash', // or gemini-1.5-pro if you want
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to initialize AI model.');
    }
  }, []);

  useEffect(() => {
    chatHistoryEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async (userInput: string) => {
    if (!chatRef.current) {
      setError('Chat is not initialized.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userInput,
    };

    const modelMessage: ChatMessage = {
      id: `model-${Date.now()}`,
      role: 'model',
      content: '',
    };

    setMessages((prev) => [...prev, userMessage, modelMessage]);

    try {
      const result = await chatRef.current.sendMessageStream({ message: userInput });

      let fullResponse = '';
      for await (const chunk of result) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === modelMessage.id
              ? { ...msg, content: fullResponse }
              : msg
          )
        );
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Error: ${errorMessage}`);
      setMessages((prev) => prev.slice(0, -1)); // Remove placeholder
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="h-screen w-screen bg-black text-gray-200 font-mono flex flex-col">
      <header className="text-center p-4 border-b border-cyan-500/30 shadow-[0_5px_15px_-5px] shadow-cyan-500/20">
        <h1 className="text-7xl font-bold text-cyan-400">zvcNxtgen</h1>
        <p className="text-xs text-gray-500 pt-2">Crypto Intelligence Protocol</p>
      </header>

      <main className="flex-grow p-4 md:p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg) => (
            <ChatMessageComponent key={msg.id} message={msg} />
          ))}
          <div ref={chatHistoryEndRef} />
          {error && (
            <div className="my-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 text-center">
              <p><strong>System Alert:</strong> {error}</p>
            </div>
          )}
        </div>
      </main>

      <footer className="flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  );
};

export default App;
