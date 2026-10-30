import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext.js';
import {
  MessageSquare,
  Send,
  X,
  Minimize2,
  Maximize2,
  Package,
  Clock,
  CheckCheck,
  User,
  Sparkles
} from 'lucide-react';

export const ChatModal: React.FC = () => {
  const { isOpen, activePeer, messages, closeChat, sendMessage, conversations, openChat } = useChat();
  const [inputText, setInputText] = useState('');
  const [showConversationsList, setShowConversationsList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[92vw] sm:w-[400px] h-[520px] max-h-[85vh] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden animate-slide-up">
      
      {/* Header */}
      <div className="px-4 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          {activePeer && (
            <div className="relative">
              <img
                src={activePeer.avatar}
                alt={activePeer.name}
                className="size-9 rounded-full bg-white/20 p-0.5 border border-white/40 object-cover"
              />
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-400 ring-2 ring-indigo-700"></span>
            </div>
          )}
          <div>
            <h4 className="text-xs font-bold leading-tight flex items-center gap-1.5">
              <span>{activePeer ? activePeer.name : 'Campus Messenger'}</span>
            </h4>
            <p className="text-[10px] text-indigo-100 flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live on Campus · Ready to meet
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowConversationsList(!showConversationsList)}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition text-[11px] font-bold"
            title="All Chats"
          >
            {showConversationsList ? 'Chat' : 'Chats'}
          </button>
          <button
            onClick={closeChat}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition"
            title="Close"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Resource Reference Banner */}
      {activePeer?.resourceName && !showConversationsList && (
        <div className="px-3.5 py-2 bg-indigo-50/80 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/50 flex items-center gap-2 text-[11px] text-indigo-900 dark:text-indigo-200">
          <Package className="size-3.5 text-indigo-600 shrink-0" />
          <span className="truncate">
            Discussing: <strong>{activePeer.resourceName}</strong>
          </span>
        </div>
      )}

      {/* Main Body */}
      {showConversationsList ? (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-2 pt-1">
            Active Student Conversations
          </h5>
          {conversations.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-10">No messages yet.</p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.conversationId}
                onClick={() => {
                  openChat(conv.peerId, conv.peerName, conv.peerAvatar, conv.resourceName);
                  setShowConversationsList(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition text-left border border-slate-100 dark:border-slate-800"
              >
                <img
                  src={conv.peerAvatar}
                  alt={conv.peerName}
                  className="size-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{conv.peerName}</p>
                    {conv.unreadCount > 0 && (
                      <span className="grid size-4 place-items-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{conv.lastMessage}</p>
                </div>
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <MessageSquare className="size-10 text-indigo-300 dark:text-indigo-800 mb-2" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Start the conversation</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Coordinate pickup time, ask questions, or arrange return!
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.senderId !== activePeer?.id;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fade-in`}
                >
                  <div className="flex items-end gap-2 max-w-[82%]">
                    {!isMe && (
                      <img
                        src={m.senderAvatar}
                        alt={m.senderName}
                        className="size-6 rounded-full border border-slate-200 shrink-0 mb-1"
                      />
                    )}
                    <div
                      className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-br-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-bl-xs'
                      }`}
                    >
                      <p>{m.text}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 px-2 text-[9px] text-slate-400">
                    <span>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <CheckCheck className="size-3 text-indigo-400" />}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Form */}
      {!showConversationsList && (
        <form
          onSubmit={handleSend}
          className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message to arrange pickup..."
            className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="grid size-9 place-items-center rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition shadow-sm"
          >
            <Send className="size-4" />
          </button>
        </form>
      )}

    </div>
  );
};
