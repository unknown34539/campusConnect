import { Message, User, ConnectionRequest } from '../types';
import { MOCK_USERS } from '../constants';

// Simple event emitter implementation for the mock socket
type Listener = (data: any) => void;

class MockSocket {
  private listeners: Record<string, Listener[]> = {};
  public connected: boolean = false;
  private userId: string | null = null;

  connect(userId: string) {
    this.userId = userId;
    this.connected = true;
    setTimeout(() => {
      this.emit('connect', {});
    }, 500);
  }

  disconnect() {
    this.connected = false;
    this.userId = null;
    this.emit('disconnect', {});
  }

  on(event: string, callback: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Listener) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  // Simulate sending data to server
  emitServer(event: string, data: any) {
    // Simulate latency
    setTimeout(() => {
      this.handleServerEvent(event, data);
    }, 300);
  }

  private trigger(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  // Logic to handle "server-side" processing and send back "client" events
  private handleServerEvent(event: string, data: any) {
    if (event === 'send_message') {
      // 1. Echo back the message to sender (optimistic UI usually handles this, but socket confirms it)
      const newMessage: Message = {
        id: 'msg_' + Date.now(),
        conversationId: data.conversationId,
        senderId: this.userId!,
        content: data.content,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      this.trigger('new_message', newMessage);

      // 2. Simulate reply from other user after a delay
      setTimeout(() => {
        const replyMessage: Message = {
          id: 'msg_' + (Date.now() + 1),
          conversationId: data.conversationId,
          senderId: data.recipientId, // The other person
          content: `Thanks for your message! This is an automated reply from the mock socket server.`,
          timestamp: new Date().toISOString(),
          isRead: false
        };
        this.trigger('new_message', replyMessage);
      }, 2000);
    }

    if (event === 'send_connection_request') {
      // Simulate success
      this.trigger('connection_request_sent', {
        recipientId: data.recipientId,
        status: 'PENDING'
      });

      // Simulate the other user accepting it after a random time
      setTimeout(() => {
        this.trigger('connection_accepted', {
          recipientId: data.recipientId,
          status: 'CONNECTED'
        });
        
        // Also start a conversation
        const recipient = MOCK_USERS.find(u => u.id === data.recipientId);
        if (recipient) {
           // Trigger a new conversation event
           // In a real app, this would send the full conversation object
        }
      }, 3000);
    }
  }

  // Alias for internal use to simulate incoming events from server
  emit(event: string, data: any) {
    this.trigger(event, data);
  }
}

export const socket = new MockSocket();