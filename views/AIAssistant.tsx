import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI, generateProjectIdeas } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, Send, Loader2, Bot, User } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<'chat' | 'ideas'>('chat');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: `Hi ${user?.name || 'there'}! I'm CampusBot. I can help you brainstorm project ideas, summarize notes, or answer academic questions. How can I help today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await chatWithAI(userMsg, messages);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  const handleGenerateIdeas = async () => {
     if (!user) return;
     setMode('ideas');
     setIsLoading(true);
     const response = await generateProjectIdeas(user.interests, user.major);
     setMessages([{ role: 'model', text: response }]); // Reset chat to show ideas
     setMode('chat'); // Switch back to chat view to display the markdown result
     setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            AI Study Assistant
          </h2>
          <p className="text-slate-500">Powered by Gemini 2.5</p>
        </div>
        <button 
          onClick={handleGenerateIdeas}
          disabled={isLoading}
          className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
        >
          {isLoading && mode === 'ideas' ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>}
          Generate Project Ideas
        </button>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
           {messages.map((msg, idx) => (
             <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5 text-blue-600" /> : <Bot className="w-5 h-5 text-purple-600" />}
               </div>
               <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                 msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
               }`}>
                  <div className="whitespace-pre-wrap">
                    {msg.text}
                  </div>
               </div>
             </div>
           ))}
           {isLoading && mode === 'chat' && (
             <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-purple-600" />
               </div>
               <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
               </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
           <div className="flex gap-2">
             <input
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
               placeholder="Ask for study help, code snippets, or project advice..."
               className="flex-1 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
               disabled={isLoading}
             />
             <button 
               onClick={handleSend}
               disabled={isLoading || !input.trim()}
               className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <Send className="w-5 h-5" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;