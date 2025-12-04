import React from 'react';
import { MOCK_USERS } from '../constants';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, MessageSquare, MapPin, Check, Clock } from 'lucide-react';

const Network: React.FC = () => {
  const { user } = useAuth();
  const { sendConnectionRequest, connectionStatus, setActiveConversationId, conversations } = useSocket();

  // Filter out current user from network list
  const users = MOCK_USERS.filter(u => u.id !== user?.id);

  const getButtonState = (targetUserId: string) => {
    const status = connectionStatus[targetUserId];
    
    if (status === 'CONNECTED') {
      return (
        <button className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 py-2 rounded-lg text-sm font-medium cursor-default">
           <Check className="w-4 h-4" /> Connected
        </button>
      );
    }

    if (status === 'PENDING') {
      return (
        <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-500 py-2 rounded-lg text-sm font-medium cursor-default">
           <Clock className="w-4 h-4" /> Pending
        </button>
      );
    }

    return (
      <button 
        onClick={() => sendConnectionRequest(targetUserId)}
        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
      >
         <UserPlus className="w-4 h-4" /> Connect
      </button>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">My Network</h2>
           <p className="text-slate-500">Discover peers with similar interests.</p>
        </div>
        <div className="flex gap-2">
           <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
             <option>All Majors</option>
             <option>Computer Science</option>
             <option>Business</option>
             <option>Design</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((targetUser) => (
          <div key={targetUser.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition">
             <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
             <div className="px-6 pb-6 relative">
                <div className="relative -mt-12 mb-4">
                  <img src={targetUser.avatar} alt={targetUser.name} className="w-24 h-24 rounded-full border-4 border-white object-cover" />
                  {targetUser.online && (
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div className="mb-4">
                   <h3 className="text-lg font-bold text-slate-800">{targetUser.name}</h3>
                   <div className="flex items-center text-sm text-slate-500 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {targetUser.major} • Year {targetUser.year}
                   </div>
                   <p className="text-sm text-slate-600 mt-3 line-clamp-2">{targetUser.bio}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {targetUser.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                      {skill}
                    </span>
                  ))}
                  {targetUser.skills.length > 3 && (
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">+{targetUser.skills.length - 3}</span>
                  )}
                </div>

                <div className="flex gap-3">
                   {getButtonState(targetUser.id)}
                   
                   <button 
                     disabled={connectionStatus[targetUser.id] !== 'CONNECTED'}
                     className={`flex items-center justify-center p-2 border border-slate-200 rounded-lg transition
                       ${connectionStatus[targetUser.id] === 'CONNECTED' 
                         ? 'text-blue-600 hover:bg-blue-50 cursor-pointer' 
                         : 'text-slate-300 cursor-not-allowed'}`}
                   >
                      <MessageSquare className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Network;