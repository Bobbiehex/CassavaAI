
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Trash2 } from 'lucide-react';
import { createChatSession, sendChatMessage } from '../services/geminiService';
import { ChatMessage } from '../types';
import { ApiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface AIAssistantProps {
  farmId: string | null;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ farmId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const { language } = useLanguage();

  // Initialize session on language change
  useEffect(() => {
    chatSessionRef.current = createChatSession(language);
  }, [language]);

  // Load history from DB
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await ApiService.getChatHistory(farmId || undefined);
        if (history.length > 0) {
          setMessages(history.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            text: msg.text,
            timestamp: new Date(msg.createdAt)
          })));
        } else {
          // Default welcome message if empty
          const welcomeMsg = {
            role: 'model',
            text: 'Hello! I am CassavaBot, your AI Cassava Advisor. How can I assist you with your cassava fields today? I can help with leaf disease detection, stem cuttings, fertilizer, or soil wellness.',
          };
          const savedMsg = await ApiService.saveChatMessage({
            farmId: farmId || undefined,
            role: welcomeMsg.role,
            text: welcomeMsg.text
          });
          setMessages([{
            id: savedMsg.id,
            role: savedMsg.role as 'user' | 'model',
            text: savedMsg.text,
            timestamp: new Date(savedMsg.createdAt)
          }]);
        }
      } catch (e) {
        console.error("Failed to load chat history", e);
      } finally {
        setIsInitializing(false);
      }
    };
    loadHistory();
  }, [farmId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isInitializing]);

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      try {
        await ApiService.clearChatHistory(farmId || undefined);
        setMessages([]);
      } catch (e) {
        console.error("Failed to clear chat history", e);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setIsLoading(true);
    
    try {
      // Save user message to DB
      const savedUserMsg = await ApiService.saveChatMessage({
        farmId: farmId || undefined,
        role: 'user',
        text: userText
      });
      setMessages(prev => [...prev, {
        id: savedUserMsg.id,
        role: savedUserMsg.role as 'user' | 'model',
        text: savedUserMsg.text,
        timestamp: new Date(savedUserMsg.createdAt)
      }]);

      if (!chatSessionRef.current) {
          chatSessionRef.current = createChatSession(language);
      }
      
      const historyPayload = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await sendChatMessage(chatSessionRef.current, userText, historyPayload);
      
      // Save bot message to DB
      const savedBotMsg = await ApiService.saveChatMessage({
        farmId: farmId || undefined,
        role: 'model',
        text: responseText
      });
      setMessages(prev => [...prev, {
        id: savedBotMsg.id,
        role: savedBotMsg.role as 'user' | 'model',
        text: savedBotMsg.text,
        timestamp: new Date(savedBotMsg.createdAt)
      }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
        <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Bot className="text-emerald-600" />
                AI Cassava Advisor
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Powered by Gemini 3.1 Pro • History Saved</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-slate-800">
        {isInitializing ? (
           <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin text-slate-400" />
           </div>
        ) : (
            <>
                {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`
                    max-w-[80%] rounded-2xl p-4 shadow-sm
                    ${msg.role === 'user' 
                        ? 'bg-emerald-600 text-white rounded-tr-none' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none'}
                    `}>
                    <div className="flex items-center gap-2 mb-1 opacity-75 text-xs">
                        {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                         <span>{msg.role === 'user' ? 'You' : 'CassavaBot'}</span>
                    </div>
                    <div className="whitespace-pre-wrap leading-relaxed text-sm">
                        {msg.text}
                    </div>
                    </div>
                </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-none p-4 flex items-center gap-2 text-slate-500 dark:text-slate-300 text-sm">
                            <Loader2 size={16} className="animate-spin" />
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about cassava mosaic disease, stem cutting prep, irrigation..."
            className="flex-1 border border-slate-200 dark:border-slate-600 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-full disabled:opacity-50 transition-colors shadow-lg shadow-emerald-600/20"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
