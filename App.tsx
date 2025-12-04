import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Sparkles, 
  LogOut,
  Menu,
  Bell,
  Loader2
} from 'lucide-react';
import { ViewState } from './types';
import Dashboard from './views/Dashboard';
import Network from './views/Network';
import Projects from './views/Projects';
import AIAssistant from './views/AIAssistant';
import AuthScreen from './views/AuthScreen';
import Onboarding from './views/Onboarding';
import Messages from './views/Messages';
import { useAuth } from './contexts/AuthContext';
import { SocketProvider, useSocket } from './contexts/SocketContext';

// Helper component to show unread count in sidebar
const NavButton = ({ item, isActive, onClick, isHighlighted }: any) => {
  const { conversations } = useSocket();
  
  // Calculate total unread messages
  const totalUnread = item.id === ViewState.MESSAGES 
    ? conversations.reduce((acc, curr) => acc + curr.unreadCount, 0)
    : 0;

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors
        ${isActive 
          ? 'bg-blue-50 text-blue-700' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
        ${isHighlighted ? 'text-purple-600 hover:bg-purple-50 hover:text-purple-700' : ''}
      `}
    >
      <div className="flex items-center">
        <item.icon className={`w-5 h-5 mr-3 ${
          isActive ? 'text-blue-600' : 'text-slate-400'
        } ${isHighlighted ? 'text-purple-600' : ''}`} />
        {item.label}
      </div>
      {totalUnread > 0 && (
        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {totalUnread}
        </span>
      )}
    </button>
  );
};

const AppContent: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Loading State
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Not Logged In
  if (!user) {
    return <AuthScreen />;
  }

  // Onboarding (if name is missing, assume profile incomplete)
  if (!user.name) {
    return <Onboarding />;
  }

  // Main App
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.NETWORK, label: 'Network', icon: Users },
    { id: ViewState.PROJECTS, label: 'Projects', icon: Briefcase },
    { id: ViewState.MESSAGES, label: 'Messages', icon: MessageSquare },
    { id: ViewState.AI_ASSISTANT, label: 'AI Assistant', icon: Sparkles, highlight: true },
  ];

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD: return <Dashboard />;
      case ViewState.NETWORK: return <Network />;
      case ViewState.PROJECTS: return <Projects />;
      case ViewState.AI_ASSISTANT: return <AIAssistant />;
      case ViewState.MESSAGES: return <Messages />;
      default: return <Dashboard />;
    }
  };

  return (
    <SocketProvider>
      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold text-slate-800">Campus Connect</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  isActive={currentView === item.id}
                  isHighlighted={item.highlight}
                  onClick={() => {
                    setCurrentView(item.id);
                    setIsSidebarOpen(false);
                  }}
                />
              ))}
            </nav>

            {/* User Profile Footer */}
            <div className="p-4 border-t border-slate-100">
              <div className="flex items-center gap-3 mb-4 px-2">
                <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.major}</p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-red-600 text-sm font-medium py-2 rounded-lg hover:bg-red-50 transition"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full min-w-0">
          {/* Header */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
               <button className="p-2 relative rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
               </button>
            </div>
          </header>

          {/* View Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
             <div className="max-w-6xl mx-auto">
               {renderContent()}
             </div>
          </main>
        </div>
      </div>
    </SocketProvider>
  );
};

export default AppContent;