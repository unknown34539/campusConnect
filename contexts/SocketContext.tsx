import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SocketContextType, Conversation, Message, User, ConnectionStatus } from '../types';
import { socket } from '../services/socketService';
import { useAuth } from './AuthContext';
import { MOCK_USERS } from '../constants';

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<Record<string, ConnectionStatus>>({});

  // Initialize Socket on Login
  useEffect(() => {
    if (user) {
      socket.connect(user.id);

      // Setup Listeners
      socket.on('connect', () => setIsConnected(true));
      socket.on('disconnect', () => setIsConnected(false));
      
      socket.on('new_message', (message: Message) => {
        setConversations(prev => {
          // Find if conversation exists
          const exists = prev.find(c => c.id === message.conversationId);
          if (exists) {
            return prev.map(c => {
              if (c.id === message.conversationId) {
                return {
                  ...c,
                  lastMessage: message,
                  unreadCount: message.senderId !== user.id ? c.unreadCount + 1 : c.unreadCount
                };
              }
              return c;
            }).sort((a, b) => new Date(b.lastMessage?.timestamp || 0).getTime() - new Date(a.lastMessage?.timestamp || 0).getTime());
          } else {
             // If new conversation (simulated), normally we fetch the full object. 
             // For MVP, if we don't have it, we might need to create it locally or fetch it.
             return prev;
          }
        });
      });

      socket.on('connection_request_sent', (data: { recipientId: string, status: string }) => {
        setConnectionStatus(prev => ({
          ...prev,
          [data.recipientId]: 'PENDING'
        }));
      });

      socket.on('connection_accepted', (data: { recipientId: string, status: string }) => {
        setConnectionStatus(prev => ({
          ...prev,
          [data.recipientId]: 'CONNECTED'
        }));
        
        // When connection is accepted, create a new conversation entry if it doesn't exist
        const recipient = MOCK_USERS.find(u => u.id === data.recipientId);
        if (recipient) {
           const newConvId = `conv_${[user.id, recipient.id].sort().join('_')}`;
           setConversations(prev => {
             if (prev.find(c => c.id === newConvId)) return prev;
             return [{
               id: newConvId,
               participants: [recipient], // In real app, includes self too usually, but for UI we need "other"
               unreadCount: 0,
               lastMessage: {
                 id: 'sys_' + Date.now(),
                 conversationId: newConvId,
                 senderId: 'system',
                 content: 'You are now connected. Say hi!',
                 timestamp: new Date().toISOString(),
                 isRead: true
               }
             }, ...prev];
           });
        }
      });

      // Load initial mock conversations
      const initialConvs: Conversation[] = [
        {
          id: 'conv_1',
          participants: [MOCK_USERS[0]],
          unreadCount: 1,
          lastMessage: {
            id: 'm1',
            conversationId: 'conv_1',
            senderId: MOCK_USERS[0].id,
            content: 'Hey, are you interested in the EcoTrack project?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            isRead: false
          }
        }
      ];
      setConversations(initialConvs);

    } else {
      socket.disconnect();
      setConversations([]);
      setConnectionStatus({});
    }

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const sendMessage = (content: string) => {
    if (!user || !activeConversationId) return;
    
    // Find recipient from active conversation
    const conversation = conversations.find(c => c.id === activeConversationId);
    if (!conversation) return;

    // Typically send to server
    socket.emitServer('send_message', {
      conversationId: activeConversationId,
      content,
      recipientId: conversation.participants[0].id 
    });
  };

  const sendConnectionRequest = (recipientId: string) => {
    if (!user) return;
    socket.emitServer('send_connection_request', {
      requesterId: user.id,
      recipientId
    });
    // Optimistic update
    setConnectionStatus(prev => ({ ...prev, [recipientId]: 'PENDING' }));
  };

  return (
    <SocketContext.Provider value={{
      isConnected,
      conversations,
      activeConversationId,
      setActiveConversationId,
      sendMessage,
      sendConnectionRequest,
      connectionStatus
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};