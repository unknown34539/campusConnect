import { User } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = 'campus_connect_user';

export const getStoredUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const login = async (email: string, password: string): Promise<User> => {
  await delay(800); // Simulate network request

  if (email === 'demo@uni.edu' && password === 'demo') {
    // Return a pre-filled user for demo purposes
    const demoUser: User = {
      id: 'u1',
      email: 'demo@uni.edu',
      name: 'Alex Rivera',
      major: 'Computer Science',
      year: 3,
      avatar: 'https://picsum.photos/200/200?random=1',
      skills: ['React', 'TypeScript', 'Node.js'],
      interests: ['AI', 'Hackathons', 'Startups'],
      bio: 'Passionate about building scalable web apps and exploring AI.'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
    return demoUser;
  }

  // Allow any login for MVP, but if it's new, return basic info to trigger onboarding
  const user: User = {
    id: 'u_' + Math.random().toString(36).substr(2, 9),
    email,
    name: '', // Empty name triggers onboarding
    major: '',
    year: 1,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    skills: [],
    interests: [],
    bio: ''
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
};

export const register = async (email: string, password: string): Promise<User> => {
  await delay(1000);
  
  const user: User = {
    id: 'u_' + Math.random().toString(36).substr(2, 9),
    email,
    name: '', // Empty name triggers onboarding
    major: '',
    year: 1,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    skills: [],
    interests: [],
    bio: ''
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
};

export const logout = async (): Promise<void> => {
  await delay(200);
  localStorage.removeItem(STORAGE_KEY);
};

export const updateProfile = async (currentUser: User, updates: Partial<User>): Promise<User> => {
  await delay(600);
  const updatedUser = { ...currentUser, ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  return updatedUser;
};