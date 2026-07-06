/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  MessageSquare, 
  Search, 
  Send, 
  Check, 
  CheckCircle,
  Bell, 
  FileText, 
  Star, 
  ShieldCheck, 
  Filter, 
  Maximize2,
  Trash2,
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

    // Auto mark as read
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

    // Append standard user response as another message under same threadId
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

  // Group text logs under same threadId for display in the right conversation pane
  const chatLogs = messages
    .filter(m => m.threadId === (selectedChat?.threadId || ""))
    .slice()
    .reverse();

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Alliance Secure Inbox</h2>
        <p className="text-xs text-slate-400 font-sans mt-0.5">
          Unified point-to-point support threads, GMAA medical clearances, and critical system notifications.
        </p>
      </div>

      {/* Inbox view split grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch border border-slate-200/60 rounded-3xl overflow-hidden bg-white shadow-sm min-h-[600px]">
        
        {/* LEFT COLUMN PANEL: SENDER THREADS */}
        <div className="lg:col-span-1 border-r border-slate-100 flex flex-col justify-between">
          
          <div className="p-4 space-y-4">
            
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={chatSearchText}
                onChange={(e) => setChatSearchText(e.target.value)}
                placeholder="Search secure threads, messages..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none transition-all font-sans"
              />
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-1">
              {["All", "Tender Support", "GMAA Messages", "System Notifications"].map(source => (
                <button
                  key={source}
                  onClick={() => setActiveSourceFilter(source as any)}
                  className={`px-2.5 py-1 rounded-lg text-3xs font-semibold uppercase tracking-wider font-display border transition-all ${
                    activeSourceFilter === source
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
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
              // Filter out unique threads for list representations
              Array.from(new Set(filteredMessages.map(m => m.threadId))).map(threadId => {
                const threadMsgs = filteredMessages.filter(m => m.threadId === threadId);
                const lastMsg = threadMsgs[0]; // first item represents latest because we prepend
                const hasUnread = threadMsgs.some(m => !m.isRead);
                const isSelected = selectedChat?.threadId === threadId;

                return (
                  <div
                    key={threadId}
                    onClick={() => handleSelectThread(threadId)}
                    className={`p-4 cursor-pointer hover:bg-slate-50 transition-all border-l-2 text-xs relative ${
                      isSelected
                        ? "bg-slate-50/85 border-cyan-400 text-slate-800"
                        : "border-transparent text-slate-500"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900 font-display text-2xs truncate">{lastMsg.sender}</span>
                          <span className={`text-4xs px-1.5 py-0.2 rounded font-mono font-bold ${
                            lastMsg.source === "Tender Support" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                            lastMsg.source === "GMAA Messages" ? "bg-cyan-50 text-cyan-600 border border-cyan-100" :
                            "bg-purple-50 text-purple-600 border border-purple-100"
                          }`}>
                            {lastMsg.source}
                          </span>
                        </div>
                        <p className="text-3xs text-slate-400 font-sans mt-0.5">{lastMsg.senderRole}</p>
                      </div>
                      <span className="text-4xs font-mono text-slate-400">{lastMsg.timestamp}</span>
                    </div>

                    <p className="text-3xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                      {lastMsg.text}
                    </p>

                    {hasUnread && (
                      <span className="absolute bottom-4 right-4 h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Secure indicator footer */}
          <div className="bg-slate-50 p-3 border-t border-slate-100 flex items-center justify-between text-4xs font-mono tracking-widest text-slate-400">
            <span>TLSv1.3 AES-GCM SECURE</span>
            <span className="text-emerald-500">PORTAL COMPLIANT</span>
          </div>

        </div>

        {/* RIGHT COLUMN PANEL: CHAT WINDOW LOG ACTIONS */}
        <div className="lg:col-span-2 flex flex-col justify-between bg-slate-50/50">
          
          {selectedChat ? (
            <>
              {/* Window Header */}
              <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between shadow-3xs">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 text-xs font-bold font-sans bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center border border-slate-200">
                    {selectedChat.sender.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-950 font-display flex items-center gap-1.5">
                      {selectedChat.sender}
                      <ShieldCheck className="h-4 w-4 text-cyan-500" />
                    </h3>
                    <p className="text-3xs text-slate-400 font-sans">{selectedChat.senderRole} • Ref: {selectedChat.threadId}</p>
                  </div>
                </div>
                
                {/* Meta Source */}
                <span className="text-3xs font-semibold px-2 py-1 bg-slate-100 border border-slate-200 rounded text-slate-600">
                  {selectedChat.source}
                </span>
              </div>

              {/* Chat log messages list */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[380px] custom-scrollbar">
                {chatLogs.map((chat) => {
                  const isSelf = chat.sender.includes("(You)");
                  return (
                    <div 
                      key={chat.id} 
                      className={`flex gap-3 max-w-lg ${isSelf ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                    >
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-3xs font-semibold border ${
                        isSelf ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-700"
                      }`}>
                        {isSelf ? "ME" : chat.sender.charAt(0)}
                      </div>
                      
                      <div className="space-y-1">
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed font-sans ${
                          isSelf 
                            ? "bg-slate-900 text-white rounded-tr-none" 
                            : "bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-3xs"
                        }`}>
                          {chat.text}
                        </div>
                        <p className={`text-4xs font-mono text-slate-400 ${isSelf ? "text-right" : "text-left"}`}>
                          {chat.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick reply action form */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200/80 space-y-3 shadow-3xs">
                
                <div className="flex items-center gap-1.5 text-3xs font-semibold text-slate-400">
                  <CornerDownRight className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Transmit quick response to {selectedChat.sender}</span>
                </div>

                <div className="flex gap-2">
                  <textarea
                    required
                    rows={2}
                    placeholder="Type hospital proposal amendment details, coordinator follow-ups here..."
                    value={composeText}
                    onChange={(e) => setComposeText(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-sans"
                  />
                  <button
                    id="transmit-message-action"
                    type="submit"
                    className="rounded-xl px-4 bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
                  >
                    <Send className="h-4.5 w-4.5" />
                  </button>
                </div>

                <p className="text-4xs text-slate-300 font-sans italic text-right">
                  *All interactions routed via GMAA secure network. HIPAA compliance policies apply.
                </p>

              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-xs text-slate-400">
              <MessageSquare className="h-10 w-10 text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700">No Chat Thread Selected</p>
              <p className="text-3xs">Click any active communication from the left panel listing.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
