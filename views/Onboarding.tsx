import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Check, ChevronRight } from 'lucide-react';

const MAJORS = [
  'Computer Science', 'Data Science', 'Business Administration', 
  'Psychology', 'Mechanical Engineering', 'Design', 
  'Economics', 'Biology', 'English Literature'
];

const YEARS = [1, 2, 3, 4, 5];

const Onboarding: React.FC = () => {
  const { user, updateProfile, isLoading } = useAuth();
  
  // Form State
  const [name, setName] = useState(user?.name || '');
  const [major, setMajor] = useState(user?.major || MAJORS[0]);
  const [year, setYear] = useState(user?.year || 1);
  const [skills, setSkills] = useState(user?.skills.join(', ') || '');
  const [interests, setInterests] = useState(user?.interests.join(', ') || '');
  const [bio, setBio] = useState(user?.bio || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      major,
      year: Number(year),
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      interests: interests.split(',').map(s => s.trim()).filter(Boolean),
      bio
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Complete Your Profile</h2>
          <p className="mt-2 text-sm text-slate-600">
            Tell us a bit about yourself so we can connect you with the right peers and projects.
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="major" className="block text-sm font-medium text-slate-700">Major</label>
                <div className="mt-1">
                  <select
                    id="major"
                    name="major"
                    value={major}
                    onChange={e => setMajor(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-slate-700">Year of Study</label>
                <div className="mt-1">
                  <select
                    id="year"
                    name="year"
                    value={year}
                    onChange={e => setYear(Number(e.target.value))}
                    className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-slate-700">Skills</label>
              <p className="text-xs text-slate-500 mb-1">Comma separated (e.g. React, Python, Design)</p>
              <div className="mt-1">
                <input
                  id="skills"
                  name="skills"
                  type="text"
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="React, TypeScript, Public Speaking"
                />
              </div>
            </div>

            <div>
              <label htmlFor="interests" className="block text-sm font-medium text-slate-700">Academic Interests</label>
              <p className="text-xs text-slate-500 mb-1">Comma separated</p>
              <div className="mt-1">
                <input
                  id="interests"
                  name="interests"
                  type="text"
                  value={interests}
                  onChange={e => setInterests(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="AI, Sustainability, FinTech"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-slate-700">Bio</label>
              <div className="mt-1">
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Briefly describe your goals and what you're looking for..."
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Complete Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;