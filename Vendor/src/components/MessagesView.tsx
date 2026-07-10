/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  MessageSquare, 
  Search, 
  Send, 
  ChevronRight, 
  ShieldCheck, 
  CornerDownRight,
  Activity
} from "lucide-react";
import { Message } from "../types";

interface MessagesProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function MessagesView({
  messages,
  setMessages
}: MessagesProps) {
  const [selectedThreadId, setSelectedThreadId] = useState<string>("TND-2026-6124");
  const [activeSourceFilter, setActiveSourceFilter] = useState<"All" | "Tender Support" | "GMAA Messages" | "System Notifications">("All");
  const [chatSearchText, setChatSearchText] = useState("");
  const [composeText, setComposeText] = useState("");

  const filteredMessages = messages.filter(item => {
    const matchesSearch = item.sender.toLowerCase().includes(chatSearchText.toLowerCase()) || 
                          item.text.toLowerCase().includes(chatSearchText.toLowerCase());
    const matchesSource = activeSourceFilter === "All" || item.source === activeSourceFilter;
    return matchesSearch && matchesSource;
  });

  // Extract selected discussion conversation
  const selectedChat = messages.find(m => m.threadId === selectedThreadId) || filteredMessages[0];

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);

    // Auto mark as read (Preserves identical code functionality)
    setMessages(prev => prev.map(m => {
      if (m.threadId === threadId) {
        return { ...m, isRead: true };
      }
      return m;
    }));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeText.trim() || !selectedChat) return;

    // Append standard user response (Preserves identical state orchestration)
    const responseMessage: Message = {
      id: `msg_app_${Date.now()}`,
      sender: "Apex Management (You)",
      senderRole: "Lead Coordinator",
      text: composeText,
      timestamp: "Just Now",
      isRead: true,
      source: selectedChat.source,
      threadId: selectedChat.threadId
    };

    setMessages(prev => [responseMessage, ...prev]);
    setComposeText("");

    // Simulate instant automated platform reply feedback
    setTimeout(() => {
      const automaticAck: Message = {
        id: `msg_ack_${Date.now()}`,
        sender: selectedChat.sender,
        senderRole: selectedChat.senderRole,
        text: `Your response has been secured and cataloged under compliance node ID #${selectedChat.threadId.substring(0,6) || "9402"}. We will respond to your queries as soon as possible.`,
        timestamp: "Just Now",
        isRead: false,
        source: selectedChat.source,
        threadId: selectedChat.threadId
      };
      setMessages(prev => [automaticAck, ...prev]);
    }, 1500);
  };

  // Group text logs under same threadId for chronological display
  const chatLogs = messages
    .filter(m => m.threadId === (selectedChat?.threadId || ""))
    .slice()
    .reverse();

  return (
    <div className="space-y-6 text-slate-800 animate-fade-in">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-sans uppercase tracking-widest">
            <span>Marketplace Referrals</span>
            <ChevronRight className="h-3 w-3 text-[#2E5B9A]" />
            <span className="text-[#2E5B9A] font-semibold">Alliance Secure Inbox</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mt-1">Direct Secure Mailbox</h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Unified support threads, authorized medical clearances, and critical system notifications.
          </p>
        </div>
        <div className="text-[10px] font-bold font-mono px-3 py-1.5 bg-blue-50 text-[#2E5B9A] border border-blue-100 rounded-lg uppercase tracking-wider self-start sm:self-auto">
          TLS ENCRYPTED CHAT
        </div>
      </div>

      {/* Main Inbox split grid console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-sm min-h-[620px]">
        
        {/* LEFT COLUMN PANEL: SENDER THREADS */}
        <div className="lg:col-span-1 border-r border-slate-100 flex flex-col justify-between select-none">
          
          <div className="p-4 space-y-4">
            
            {/* HUD Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={chatSearchText}
                onChange={(e) => setChatSearchText(e.target.value)}
                placeholder="Search secure threads, messages..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] transition-all font-sans"
              />
            </div>

            {/* Futuristic Source Filter Category Tabs */}
            <div className="flex flex-wrap gap-1">
              {["All", "Tender Support", "GMAA Messages", "System Notifications"].map(source => (
                <button
                  key={source}
                  onClick={() => setActiveSourceFilter(source as any)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider font-mono border transition-all ${
                    activeSourceFilter === source
                      ? "bg-[#2E5B9A] border-[#2E5B9A] text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-450 hover:border-blue-200 hover:text-slate-800"
                  }`}
                >
                  {source === "All" ? "All Sources" : source.replace(" Messages", "")}
                </button>
              ))}
            </div>

          </div>

          {/* List of discussions */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50 max-h-[480px] custom-scrollbar">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-20 text-slate-400 px-4">
                <p className="text-xs font-semibold">No discussions matches filters.</p>
                <p className="text-3xs mt-1">Try broadening your search term criteria.</p>
              </div>
            ) : (
              // Unique Thread mapping (Preserves identical array reduction)
              Array.from(new Set(filteredMessages.map(m => m.threadId))).map(threadId => {
                const threadMsgs = filteredMessages.filter(m => m.threadId === threadId);
                const lastMsg = threadMsgs[0];
                const hasUnread = threadMsgs.some(m => !m.isRead);
                const isSelected = selectedChat?.threadId === threadId;

                return (
                  <div
                    key={threadId}
                    onClick={() => handleSelectThread(threadId)}
                    className={`p-4 cursor-pointer hover:bg-slate-50/50 transition-all border-l-2 text-xs relative ${
                      isSelected
                        ? "bg-[#EBF3FC]/30 border-[#2E5B9A] text-slate-800"
                        : "border-transparent text-slate-500"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 font-display text-2xs truncate">{lastMsg.sender}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border ${
                            lastMsg.source === "Tender Support" ? "bg-amber-50 text-amber-600 border-amber-100" :
                            lastMsg.source === "GMAA Messages" ? "bg-[#EBF3FC] text-[#2E5B9A] border-blue-100" :
                            "bg-purple-50 text-purple-600 border-purple-100"
                          }`}>
                            {lastMsg.source.replace(" Messages", "")}
                          </span>
                        </div>
                        <p className="text-3xs text-slate-400 font-sans mt-0.5">{lastMsg.senderRole}</p>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">{lastMsg.timestamp}</span>
                    </div>

                    <p className="text-3xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                      {lastMsg.text}
                    </p>

                    {hasUnread && (
                      <span className="absolute bottom-4 right-4 h-2 w-2 rounded-full bg-[#D91B24] animate-pulse" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Secure indicator footer */}
          <div className="bg-slate-50/80 p-3 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono tracking-widest text-slate-400">
            <span>TLSv1.3 AES-GCM SECURE</span>
            <span className="text-emerald-500 font-bold uppercase">Portal Compliant</span>
          </div>

        </div>

        {/* RIGHT COLUMN PANEL: CHAT WINDOW */}
        <div className="lg:col-span-2 flex flex-col justify-between bg-slate-50/30">
          
          {selectedChat ? (
            <>
              {/* Window Header */}
              <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 text-xs font-bold font-sans bg-slate-50 text-[#2E5B9A] border border-blue-100 rounded-xl flex items-center justify-center shadow-inner shrink-0">
                    {selectedChat.sender.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 font-display flex items-center gap-1.5 leading-normal">
                      {selectedChat.sender}
                      <ShieldCheck className="h-4.5 w-4.5 text-[#2E5B9A]" />
                    </h3>
                    <p className="text-3xs text-slate-400 font-mono mt-0.5 uppercase tracking-wider">Role: {selectedChat.senderRole} • Ref Thread: {selectedChat.threadId}</p>
                  </div>
                </div>
                
                <span className="text-3xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-50 border border-slate-150 rounded text-slate-500">
                  {selectedChat.source}
                </span>
              </div>

              {/* Chat Log Message Bubbles */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[380px] custom-scrollbar bg-slate-50/10">
                {chatLogs.map((chat) => {
                  const isSelf = chat.sender.includes("(You)");
                  return (
                    <div 
                      key={chat.id} 
                      className={`flex gap-3 max-w-lg ${isSelf ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                    >
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold border ${
                        isSelf 
                          ? "bg-[#EBF3FC] border-blue-100 text-[#2E5B9A]" 
                          : "bg-white border-slate-200 text-slate-700"
                      }`}>
                        {isSelf ? "ME" : chat.sender.charAt(0)}
                      </div>
                      
                      <div className="space-y-1">
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed font-sans shadow-2xs ${
                          isSelf 
                            ? "bg-gradient-to-br from-[#2E5B9A] to-[#3B62AD] text-white rounded-tr-none" 
                            : "bg-white border border-slate-200/80 text-slate-700 rounded-tl-none"
                        }`}>
                          {chat.text}
                        </div>
                        <p className={`text-[9px] font-mono text-slate-400 ${isSelf ? "text-right" : "text-left"}`}>
                          {chat.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Evacuation Evac reply form */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 space-y-3">
                
                <div className="flex items-center gap-1.5 text-3xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
                  <CornerDownRight className="h-3.5 w-3.5 text-[#2E5B9A]" />
                  <span>Transmit Response to {selectedChat.sender}</span>
                </div>

                <div className="flex gap-2">
                  <textarea
                    required
                    rows={2}
                    placeholder="Type surgical package details, referral queries, or bidding specifications here..."
                    value={composeText}
                    onChange={(e) => setComposeText(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] font-sans transition leading-relaxed resize-none"
                  />
                  <button
                    id="transmit-message-action"
                    type="submit"
                    className="rounded-xl px-5 bg-[#2E5B9A] hover:bg-[#3b6eae] text-white flex items-center justify-center shrink-0 active:scale-95 transition-all shadow-md shadow-blue-500/10"
                  >
                    <Send className="h-4.5 w-4.5" />
                  </button>
                </div>

                <p className="text-[9px] text-slate-400 font-sans italic text-right">
                  *All interactions logged under HIPAA compliance criteria.
                </p>

              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-xs text-slate-400 bg-slate-50/50">
              <MessageSquare className="h-10 w-10 text-slate-350 mb-2 animate-pulse" />
              <p className="font-semibold text-slate-850">No Secure Chat Thread Selected</p>
              <p className="text-3xs text-slate-400 mt-1">Select an active communication thread on the left pane.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}