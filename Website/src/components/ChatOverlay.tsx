import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Shield, Headset } from 'lucide-react';
import { useAuth } from './AuthContext';
import { backendApi } from '../services/backendApi';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  createdAt: any;
  isAdmin: boolean;
}

interface ChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string; // e.g., "Inquiry about [Vendor Name]"
}

export default function ChatOverlay({ isOpen, onClose, context }: ChatOverlayProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initiate Chat session
  useEffect(() => {
    if (!isOpen || !user) return;

    const setupChat = async () => {
      try {
        const thread = await backendApi.initiateChat({
          userId: user.uid,
          userName: user.displayName || user.email || 'User',
          vendorId: 'admin',
          vendorName: 'Alliance Concierge',
          lastMessage: 'Customer initialized session'
        });
        setChatId(thread.id || null);
      } catch (err) {
        console.warn("Failed to initialize chat thread:", err);
      }
    };

    setupChat();
  }, [isOpen, user]);

  // Poll Chat Messages
  useEffect(() => {
    if (!isOpen || !chatId) return;

    const loadMessages = async () => {
      try {
        const list = await backendApi.fetchChatMessages(chatId);
        setMessages(list.map((m: any) => ({
          id: m.id,
          text: m.text,
          senderId: m.senderId,
          senderName: m.senderName,
          createdAt: m.createdAt,
          isAdmin: m.senderId === 'admin'
        })));
        setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 100);
      } catch (err) {
        console.warn("Error polling messages", err);
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [isOpen, chatId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !chatId) return;

    setLoading(true);
    try {
      const textToSend = context ? `[${context}] ${newMessage}` : newMessage;
      await backendApi.submitChatMessage(chatId, {
        senderId: user.uid,
        senderName: user.displayName || user.email || 'User',
        text: textToSend
      });

      setNewMessage('');
      // Force immediate reload of messages
      const list = await backendApi.fetchChatMessages(chatId);
      setMessages(list.map((m: any) => ({
        id: m.id,
        text: m.text,
        senderId: m.senderId,
        senderName: m.senderName,
        createdAt: m.createdAt,
        isAdmin: m.senderId === 'admin'
      })));
      setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 100);
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-8 right-8 w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-2xl shadow-navy/20 flex flex-col overflow-hidden z-[100] border border-navy/5"
        >
          {/* Header */}
          <div className="bg-navy p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center">
                <Headset className="text-white w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Alliance Concierge</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-white/50 text-[10px] uppercase tracking-widest">Admin Online</p>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="text-white w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-bg/30"
          >
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Shield className="w-12 h-12 text-navy/10 mx-auto mb-4" />
                <p className="text-navy/40 text-sm font-medium">Your conversation is secure and encrypted.</p>
                <p className="text-[10px] text-navy/20 uppercase tracking-widest mt-2">How can we assist you today?</p>
              </div>
            )}
            
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                  msg.isAdmin 
                    ? 'bg-white text-navy shadow-sm' 
                    : 'bg-brand-red text-white'
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-[8px] mt-1 uppercase tracking-tighter ${
                    msg.isAdmin ? 'text-navy/40' : 'text-white/40'
                  }`}>
                    {msg.senderName}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-navy/5">
            <div className="relative">
              <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full bg-slate-bg rounded-2xl py-4 pl-6 pr-14 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition-all"
              />
              <button 
                type="submit"
                disabled={loading || !newMessage.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-red text-white rounded-xl flex items-center justify-center hover:bg-navy transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-[8px] text-navy/20 uppercase tracking-widest mt-3 font-bold">
              Typically responds within 2 hours
            </p>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
