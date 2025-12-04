import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { Message } from '../types';
import { Send, Search, MoreVertical, Phone, Video, CheckCheck, Circle } from 'lucide-react';

const Messages: React.FC = () => {
  const { user } = useAuth();
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversationId, 
    sendMessage 
  } = useSocket();
  
  const [inputText, setInputText] = useState('');
  const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync local messages with socket updates (in a real app, we'd fetch history)
  useEffect(() => {
    // When conversations update (e.g. new lastMessage), ensure we show it in the chat window if active
    conversations.forEach(conv => {
       if (conv.lastMessage) {
         setLocalMessages(prev => {
            const current = prev[conv.id] || [];
            // Check if message already exists
            if (current.find(m => m.id === conv.lastMessage!.id)) return prev;
            
            // Add new message
            return {
              ...prev,
              [conv.id]: [...current, conv.lastMessage!]
            };
         });
       }
    });
  }, [conversations]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, activeConversationId]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeMessages = activeConversationId ? (localMessages[activeConversationId] || []) : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;

    sendMessage(inputText);
    setInputText('');
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex animate-fade-in">
      
      {/* Sidebar List */}
      <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-200">
           <h2 className="text-xl font-bold text-slate-800 mb-4">Messages</h2>
           <div className="relative">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               placeholder="Search messages..." 
               className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto">
           {conversations.length === 0 ? (
             <div className="p-8 text-center text-slate-500 text-sm">
               No conversations yet. Connect with peers in the Network tab to start chatting!
             </div>
           ) : (
             conversations.map(conv => {
               const participant = conv.participants[0]; // Assuming 1-on-1 for MVP
               const isActive = conv.id === activeConversationId;
               
               return (
                 <div 
                   key={conv.id}
                   onClick={() => setActiveConversationId(conv.id)}
                   className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition ${isActive ? 'bg-blue-50 border-r-4 border-blue-600' : ''}`}
                 >
                    <div className="relative">
                      <img src={participant.avatar} alt={participant.name} className="w-12 h-12 rounded-full object-cover" />
                      {participant.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-baseline mb-1">
                          <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-blue-900' : 'text-slate-800'}`}>
                            {participant.name}
                          </h3>
                          {conv.lastMessage && (
                            <span className="text-xs text-slate-400">{formatTime(conv.lastMessage.timestamp)}</span>
                          )}
                       </div>
                       <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                         {conv.lastMessage?.senderId === user?.id ? 'You: ' : ''}{conv.lastMessage?.content}
                       </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                        {conv.unreadCount}
                      </div>
                    )}
                 </div>
               );
             })
           )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex flex-col ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        {activeConversationId && activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                 <button 
                   className="md:hidden text-slate-500 hover:text-slate-700 mr-1"
                   onClick={() => setActiveConversationId(null)}
                 >
                   Back
                 </button>
                 <img src={activeConversation.participants[0].avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                 <div>
                    <h3 className="font-bold text-slate-800">{activeConversation.participants[0].name}</h3>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                       <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                 <Phone className="w-5 h-5 cursor-pointer hover:text-blue-600" />
                 <Video className="w-5 h-5 cursor-pointer hover:text-blue-600" />
                 <MoreVertical className="w-5 h-5 cursor-pointer hover:text-slate-600" />
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
               {activeMessages.map((msg, idx) => {
                 const isMe = msg.senderId === user?.id;
                 return (
                   <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                        isMe 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                      }`}>
                         <p className="text-sm">{msg.content}</p>
                         <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                           {formatTime(msg.timestamp)}
                           {isMe && (
                             <span className="ml-1 inline-block">
                               <CheckCheck className="w-3 h-3 inline opacity-70" />
                             </span>
                           )}
                         </p>
                      </div>
                   </div>
                 );
               })}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200">
               <div className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <button 
                    type="submit" 
                    disabled={!inputText.trim()}
                    className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                     <Send className="w-5 h-5" />
                  </button>
               </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
             <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-300" />
             </div>
             <p className="text-lg font-medium">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;