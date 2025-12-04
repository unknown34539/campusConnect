import React, { useState } from 'react';
import { MOCK_PROJECTS } from '../constants';
import { Search, Plus, Filter, Users, Calendar } from 'lucide-react';

const Projects: React.FC = () => {
  const [filter, setFilter] = useState('');

  const filteredProjects = MOCK_PROJECTS.filter(p => 
    p.title.toLowerCase().includes(filter.toLowerCase()) ||
    p.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Projects</h2>
           <p className="text-slate-500">Find a team or start your own initiative.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition shadow-sm">
           <Plus className="w-4 h-4" /> Create Project
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 items-center">
         <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search projects by keyword..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
         </div>
         <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
            <Filter className="w-5 h-5" />
         </button>
      </div>

      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 transition group">
             <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                <div className="flex-1">
                   <div className="flex items-center gap-3 mb-2">
                     <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition">{project.title}</h3>
                     <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        project.status === 'Recruiting' 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                     }`}>
                        {project.status}
                     </span>
                   </div>
                   <p className="text-slate-600 mb-4">{project.description}</p>
                   
                   <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">#{tag}</span>
                      ))}
                   </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2 min-w-[140px]">
                   <div className="text-sm text-slate-500 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{project.members} / {project.maxMembers} members</span>
                   </div>
                   <div className="text-sm text-slate-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{project.createdAt}</span>
                   </div>
                   <button className="mt-2 w-full md:w-auto bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-4 py-1.5 rounded-lg text-sm transition">
                      View Details
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;