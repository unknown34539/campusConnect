import { User, Project, Announcement, Message } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u2',
    email: 'sarah.chen@uni.edu',
    name: 'Sarah Chen',
    major: 'Data Science',
    year: 4,
    avatar: 'https://picsum.photos/200/200?random=2',
    skills: ['Python', 'PyTorch', 'SQL'],
    interests: ['Machine Learning', 'Big Data'],
    bio: 'Looking for a frontend dev to partner on a capstone project.',
    online: true
  },
  {
    id: 'u3',
    email: 'james.wilson@uni.edu',
    name: 'James Wilson',
    major: 'Business Admin',
    year: 2,
    avatar: 'https://picsum.photos/200/200?random=3',
    skills: ['Marketing', 'Public Speaking', 'Excel'],
    interests: ['FinTech', 'Entrepreneurship'],
    bio: 'Want to launch a startup before graduation.',
    online: false
  },
  {
    id: 'u4',
    email: 'emily.davis@uni.edu',
    name: 'Emily Davis',
    major: 'Design',
    year: 3,
    avatar: 'https://picsum.photos/200/200?random=4',
    skills: ['Figma', 'UI/UX', 'Adobe Suite'],
    interests: ['Accessible Design', 'Mobile Apps'],
    bio: 'I make things look good and work well.',
    online: true
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'EcoTrack - Sustainable Living App',
    description: 'Building a mobile app to help students track their carbon footprint on campus.',
    creatorId: 'u2',
    tags: ['Mobile', 'Sustainability', 'React Native'],
    members: 2,
    maxMembers: 4,
    status: 'Recruiting',
    createdAt: '2023-11-10'
  },
  {
    id: 'p2',
    title: 'FinTech Algorithmic Trading Bot',
    description: 'Developing a high-frequency trading bot using Python and historical market data.',
    creatorId: 'u3',
    tags: ['Finance', 'Python', 'Algorithms'],
    members: 3,
    maxMembers: 3,
    status: 'Active',
    createdAt: '2023-10-25'
  },
  {
    id: 'p3',
    title: 'Campus Event Aggregator',
    description: 'A centralized platform to scrape and display all university events in one calendar.',
    creatorId: 'u4',
    tags: ['Web', 'Scraping', 'Design'],
    members: 1,
    maxMembers: 3,
    status: 'Recruiting',
    createdAt: '2023-11-12'
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Fall Career Fair 2024',
    type: 'Career',
    date: 'Nov 20, 2024',
    content: 'Over 50 tech companies visiting campus.'
  },
  {
    id: 'a2',
    title: 'Guest Lecture: AI Ethics',
    type: 'Academic',
    date: 'Nov 18, 2024',
    content: 'Dr. Smith from MIT will discuss the future of ethical AI.'
  }
];

export const MOCK_MESSAGES: Message[] = [
  { id: 'm1', conversationId: 'conv_1', senderId: 'u2', content: 'Hey Alex, saw your profile!', timestamp: '2023-11-20T10:30:00Z', isRead: true },
  { id: 'm2', conversationId: 'conv_1', senderId: 'u1', content: 'Hi Sarah! Thanks for reaching out.', timestamp: '2023-11-20T10:32:00Z', isRead: true },
  { id: 'm3', conversationId: 'conv_1', senderId: 'u2', content: 'Are you interested in the EcoTrack project?', timestamp: '2023-11-20T10:33:00Z', isRead: false },
];