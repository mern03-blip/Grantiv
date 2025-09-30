import React from 'react';

// Function to get a future date for the deadline
const getFutureDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const ALL_GRANTS = [
  {
    id: 'g1',
    title: 'Small Business Innovation Grant',
    funder: 'Tech Foundation',
    amount: 50000,
    deadline: getFutureDate(12), // "Closing in 12 days"
    category: 'National',
    description: 'The Digital Innovation Fund supports nonprofit organizations in developing and implementing technology solutions that enhance their mission impact. This grant focuses on projects that demonstrate measurable outcomes and sustainable digital transformation.',
    eligibility: 'Must be an Australian registered non-profit organization with DGR status. Annual revenue must not exceed $5M.',
    status: 'DRAFTING', // Changed from GrantStatus.DRAFTING
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'g2',
    title: 'Community Arts Project Fund',
    funder: 'Arts Council of Australia',
    amount: 15000,
    deadline: '2024-11-30',
    category: 'Arts & Culture',
    description: 'Funding for local community art projects that promote cultural diversity and inclusion.',
    eligibility: 'Open to not-for-profit organizations and individual artists based in Australia.',
    status: 'DRAFTING',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'g3',
    title: 'Regional Business Growth Initiative',
    funder: 'Department of Infrastructure & Regional Development',
    amount: 250000,
    deadline: '2025-01-15',
    category: 'Business',
    description: 'Aims to stimulate economic growth in regional and rural areas of Australia.',
    eligibility: 'Businesses must be located in a designated regional area and demonstrate significant growth potential.',
    status: 'DRAFTING',
    imageUrl: 'https://images.unsplash.com/photo-1521790797524-3f20818f8b07?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'g4',
    title: 'Environmental Sustainability Grant',
    funder: 'Green Future Foundation',
    amount: 75000,
    deadline: '2024-10-20',
    category: 'Environment',
    description: 'Supports projects that promote sustainable practices, conservation, and environmental education.',
    eligibility: 'Available for not-for-profits and social enterprises focused on environmental outcomes.',
    status: 'DRAFTING',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'g5',
    title: 'Indigenous Entrepreneurship Program',
    funder: 'Indigenous Business Australia',
    amount: 100000,
    deadline: '2025-03-01',
    category: 'Social Enterprise',
    description: 'Provides seed funding and mentorship for startups founded by Aboriginal and Torres Strait Islander entrepreneurs.',
    eligibility: 'Applicants must be of Aboriginal or Torres Strait Islander descent and have a viable business plan.',
    status: 'DRAFTING',
    imageUrl: 'https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'g6',
    title: 'Youth Sports Development Fund',
    funder: 'Australian Sports Commission',
    amount: 20000,
    deadline: '2024-11-01',
    category: 'Community',
    description: 'Funding for local sports clubs to improve facilities and increase participation among young people.',
    eligibility: 'Must be an incorporated, not-for-profit sports club.',
    status: 'DRAFTING',
    imageUrl: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=400&auto=format&fit=crop'
  }
];


export const MOCK_TEAM = [
  { id: 't1', name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', role: 'Admin' },
  { id: 't2', name: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', role: 'Financials' },
  { id: 't3', name: 'Sam Wilson', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', role: 'Reviewer' },
  { id: 't4', name: 'Emily White', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d', role: 'Lead Writer' }
];

export const MOCK_TASKS = [
  { id: 'tk1', text: 'Draft Section A: Project Outline', completed: true, assigneeId: 't4', deadline: getFutureDate(2), grantId: 'g1' },
  { id: 'tk2', text: 'Prepare budget spreadsheet', completed: false, assigneeId: 't2', deadline: getFutureDate(5), grantId: 'g1' },
  { id: 'tk3', text: 'Gather letters of support', completed: false, deadline: getFutureDate(7), grantId: 'g1' },
  { id: 'tk4', text: 'Final review of application', completed: false, assigneeId: 't3', deadline: getFutureDate(10), grantId: 'g1' },
  { id: 'tk5', text: 'Upload proof of non-profit status', completed: false, deadline: getFutureDate(1), grantId: 'g1' },
  { id: 'tk6', text: 'Submit final application package', completed: false, deadline: getFutureDate(12), grantId: 'g1' },
];

export const MOCK_UPLOADED_FILES = [
    { id: 'f1', name: 'Project_Budget_Final.xlsx', type: 'Spreadsheet', size: '128 KB', uploadDate: '2024-07-15', comments: [
        { id: 'c1', memberId: 't2', text: 'Here is the first draft of the budget. @Sam Wilson can you double check my calculations for equipment rental?', timestamp: '2024-07-16T14:00:00Z'},
        { id: 'c2', memberId: 't3', text: 'Looks good John. Just one question about the contingency amount. Seems a bit low.', timestamp: '2024-07-16T16:30:00Z'},
    ]},
    { id: 'f2', name: 'Letter_of_Support_CEO.pdf', type: 'PDF', size: '450 KB', uploadDate: '2024-07-14', comments: [] },
    { id: 'f3', name: 'Draft_Application_v2.docx', type: 'Word', size: '2.1 MB', uploadDate: '2024-07-12', comments: [] },
];

export const MOCK_MY_GRANTS = [
    { ...ALL_GRANTS[0], status: 'DRAFTING', assignedTeamMemberIds: ['t1', 't4'] }, // Changed from GrantStatus.DRAFTING
    { ...ALL_GRANTS[3], status: 'SUBMITTED', assignedTeamMemberIds: ['t1', 't2', 't3'] }, // Changed from GrantStatus.SUBMITTED
];

export const MOCK_TEAM_CHAT_MESSAGES = [
  { id: 'msg1', memberId: 't1', text: "Hey team, I've just finished the draft for Section A. Can someone take a look?", timestamp: '2024-07-18T10:00:00Z' },
  { id: 'msg2', memberId: 't3', text: "On it, Jane. Will get you feedback by EOD.", timestamp: '2024-07-18T10:02:00Z' },
  { id: 'msg3', memberId: 't2', text: "The budget spreadsheet is almost ready. I'm just waiting on the final quotes for the equipment.", timestamp: '2024-07-18T10:05:00Z' },
  { id: 'msg4', memberId: 't4', text: "Thanks, Sam! John, let me know if you need help chasing those quotes.", timestamp: '2024-07-18T10:06:00Z' },
];