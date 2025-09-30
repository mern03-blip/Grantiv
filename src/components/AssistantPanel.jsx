import React, { useState, useRef, useEffect } from 'react';
import { getAssistantResponse } from '../services/geminiService';
import { SparklesIcon, PaperAirplaneIcon } from './icons/Icons';

const AssistantPanel = ({ grant }) => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: `Hi! I'm your AI assistant. How can I help you with the "${grant.title}" application today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Pass null for businessProfile as it's not available in this context.
      const aiResponseText = await getAssistantResponse(grant, messages, input, [], null);
      const aiMessage = { sender: 'ai', text: aiResponseText };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-night border border-mercury/20 rounded-lg shadow-sm flex flex-col h-[600px]">
      <div className="p-4 border-b border-mercury/20 flex items-center gap-2">
        <SparklesIcon className="w-6 h-6" />
        <h3 className="text-lg font-bold text-alabaster font-heading">AI Grant Writing Assistant</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-md p-3 rounded-xl ${msg.sender === 'user'
                ? 'bg-primary text-night'
                : 'bg-mercury/20 text-alabaster'
                }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-md p-3 rounded-xl bg-mercury/20 text-alabaster">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-mercury/50 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-mercury/50 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-mercury/50 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-mercury/20">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask for help with a section..."
            className="flex-1 w-full px-4 py-2 bg-mercury/10 border border-mercury/20 text-alabaster placeholder-mercury/60 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="w-10 h-10 flex items-center justify-center shrink-0 bg-primary text-night rounded-full font-semibold hover:bg-secondary disabled:bg-mercury/20 disabled:text-mercury/50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_10px_theme(colors.primary/0.5)] hover:shadow-[0_0_15px_theme(colors.primary/0.7)] disabled:shadow-none"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantPanel;