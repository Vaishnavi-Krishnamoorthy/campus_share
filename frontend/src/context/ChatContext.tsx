import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.js';
import { getDefaultAvatar } from '../utils/avatars.js';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: number;
  senderName: string;
  senderAvatar: string;
  recipientId: number;
  text: string;
  timestamp: string;
  resourceName?: string;
  isRead: boolean;
}

export interface ConversationMeta {
  conversationId: string;
  peerId: number;
  peerName: string;
  peerAvatar: string;
  resourceName?: string;
  lastMessage: string;
  lastUpdated: string;
  unreadCount: number;
}

interface ChatContextType {
  isOpen: boolean;
  activePeer: {
    id: number;
    name: string;
    avatar: string;
    resourceName?: string;
  } | null;
  messages: ChatMessage[];
  conversations: ConversationMeta[];
  unreadTotal: number;
  openChat: (peerId: number, peerName: string, peerAvatar?: string, resourceName?: string) => void;
  closeChat: () => void;
  sendMessage: (text: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const INITIAL_CONVERSATIONS: ChatMessage[] = [
  {
    id: 'msg-init-1',
    conversationId: 'conv-101-peer',
    senderId: 101,
    senderName: 'Ananya S.',
    senderAvatar: getDefaultAvatar('Ananya S.'),
    recipientId: 1,
    text: 'Hey! The Casio Calculator is available. I am in the Engineering Library on 2nd floor.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    resourceName: 'Casio FX-991EX ClassWiz Calculator',
    isRead: true
  }
];

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activePeer, setActivePeer] = useState<{
    id: number;
    name: string;
    avatar: string;
    resourceName?: string;
  } | null>(null);

  const [allMessages, setAllMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('cs_cloud_chats');
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cs_cloud_chats', JSON.stringify(allMessages));
    } catch {}
  }, [allMessages]);

  const currentUserId = user?.student_id || 1;
  const currentUserName = user?.name || 'You';
  const currentUserAvatar = user?.profile_image || getDefaultAvatar(currentUserName);

  // Active messages in the open chat
  const activeMessages = activePeer
    ? allMessages.filter(
        (m) =>
          (m.senderId === currentUserId && m.recipientId === activePeer.id) ||
          (m.senderId === activePeer.id && m.recipientId === currentUserId)
      )
    : [];

  const unreadTotal = allMessages.filter(
    (m) => m.recipientId === currentUserId && !m.isRead
  ).length;

  const openChat = (
    peerId: number,
    peerName: string,
    peerAvatar?: string,
    resourceName?: string
  ) => {
    const avatar = peerAvatar || getDefaultAvatar(peerName);
    setActivePeer({
      id: peerId,
      name: peerName,
      avatar,
      resourceName
    });
    setIsOpen(true);

    // Mark messages from this peer as read
    setAllMessages((prev) =>
      prev.map((m) =>
        m.senderId === peerId && m.recipientId === currentUserId
          ? { ...m, isRead: true }
          : m
      )
    );
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const sendMessage = (text: string) => {
    if (!activePeer || !text.trim()) return;

    const convId = `conv-${Math.min(currentUserId, activePeer.id)}-${Math.max(
      currentUserId,
      activePeer.id
    )}`;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      conversationId: convId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderAvatar: currentUserAvatar,
      recipientId: activePeer.id,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      resourceName: activePeer.resourceName,
      isRead: false
    };

    setAllMessages((prev) => [...prev, newMsg]);

    // Simulate realistic peer reply if communicating with demo resource owner
    setTimeout(() => {
      const replyOptions = [
        `Hey ${currentUserName}! Got your message about ${activePeer.resourceName || 'the item'}. I'm right here on campus, let's meet up!`,
        `Sure thing! I have it ready with me. You can pick it up anytime today.`,
        `Perfect! I'm near the library study desks. Message me when you arrive so I can hand it to you!`,
        `Sounds good to me! Please take good care of it and return it once your lab/exam is complete.`
      ];
      const randomReply = replyOptions[Math.floor(Math.random() * replyOptions.length)];

      const peerReply: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        conversationId: convId,
        senderId: activePeer.id,
        senderName: activePeer.name,
        senderAvatar: activePeer.avatar,
        recipientId: currentUserId,
        text: randomReply,
        timestamp: new Date().toISOString(),
        resourceName: activePeer.resourceName,
        isRead: false
      };

      setAllMessages((prev) => [...prev, peerReply]);
    }, 1200);
  };

  // Build meta list of conversations
  const conversations: ConversationMeta[] = [];
  const peersSeen = new Set<number>();

  allMessages.forEach((m) => {
    const peerId = m.senderId === currentUserId ? m.recipientId : m.senderId;
    if (!peersSeen.has(peerId)) {
      peersSeen.add(peerId);
      const peerName = m.senderId === currentUserId ? 'Peer Student' : m.senderName;
      const peerAvatar = m.senderId === currentUserId ? getDefaultAvatar('Peer') : m.senderAvatar;

      const thread = allMessages.filter(
        (t) =>
          (t.senderId === currentUserId && t.recipientId === peerId) ||
          (t.senderId === peerId && t.recipientId === currentUserId)
      );
      const last = thread[thread.length - 1];
      const unreads = thread.filter((t) => t.recipientId === currentUserId && !t.isRead).length;

      conversations.push({
        conversationId: last.conversationId,
        peerId,
        peerName,
        peerAvatar,
        resourceName: last.resourceName,
        lastMessage: last.text,
        lastUpdated: last.timestamp,
        unreadCount: unreads
      });
    }
  });

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        activePeer,
        messages: activeMessages,
        conversations,
        unreadTotal,
        openChat,
        closeChat,
        sendMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return ctx;
};
