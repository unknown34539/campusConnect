export interface User {
  id: string;
  email: string;
  name: string;
  major: string;
  year: number;
  avatar: string;
  skills: string[];
  interests: string[];
  bio: string;
  online?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  tags: string[];
  members: number;
  maxMembers: number;
  status: 'Active' | 'Completed' | 'Recruiting';
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  type: 'Event' | 'Academic' | 'Career';
  date: string;
  content: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
}

export type ConnectionStatus = 'NONE' | 'PENDING' | 'CONNECTED';

export interface ConnectionRequest {
  id: string;
  requesterId: string;
  recipientId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  NETWORK = 'NETWORK',
  PROJECTS = 'PROJECTS',
  MESSAGES = 'MESSAGES',
  AI_ASSISTANT = 'AI_ASSISTANT'
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export interface SocketContextType {
  isConnected: boolean;
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (content: string) => void;
  sendConnectionRequest: (recipientId: string) => void;
  connectionStatus: Record<string, ConnectionStatus>; // Map userId -> status
}