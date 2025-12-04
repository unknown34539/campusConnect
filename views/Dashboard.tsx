import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar, TrendingUp, Users, Award } from 'lucide-react';
import { MOCK_ANNOUNCEMENTS, MOCK_PROJECTS } from '../constants';

const Dashboard: React.FC = () => {
  const data = [
    { name: 'Study', value: 400 },
    { name: 'Projects', value: 300 },
    { name: 'Social', value: 200 },
    { name: 'Events', value: 100 },
  ];
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Profile Views', value: '124', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Project Invites', value: '3', icon: Award, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Upcoming Events', value: '2', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-100' },
          { label: 'Network Growth', value: '+12%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between transition hover:shadow-md">
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4">University Announcements</h2>
            <div className="space-y-4">
              {MOCK_ANNOUNCEMENTS.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-col leading-none">
                    <span>{item.date.split(' ')[0]}</span>
                    <span className="text-sm">{item.date.split(' ')[1].replace(',', '')}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{item.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{item.content}</p>
                    <span className="inline-block mt-2 text-xs font-medium px-2 py-1 bg-white border border-slate-200 rounded text-slate-600">
                      {item.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Recommended Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {MOCK_PROJECTS.slice(0, 2).map(project => (
                 <div key={project.id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition cursor-pointer">
                    <h3 className="font-semibold text-slate-800 truncate">{project.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{project.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex -space-x-2">
                         {[...Array(project.members)].map((_, i) => (
                           <div key={i} className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>
                         ))}
                      </div>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {project.status}
                      </span>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-md font-bold text-slate-800 mb-4">Weekly Activity</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {data.map((entry, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-xs text-slate-500">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

           <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-xl shadow-md text-white">
              <h3 className="font-bold text-lg mb-2">Need Inspiration?</h3>
              <p className="text-blue-100 text-sm mb-4">Use our Gemini-powered AI assistant to brainstorm your next big project.</p>
              <button className="w-full bg-white text-blue-700 font-semibold py-2 rounded-lg text-sm hover:bg-blue-50 transition">
                Try AI Assistant
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;