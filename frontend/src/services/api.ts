import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userApi = {
  getUserProfile: async (clerkId: string) => {
    const response = await api.get(`/users/${clerkId}`);
    return response.data;
  },
  
  createOrUpdateUser: async (userData: {
    clerkId: string;
    name: string;
    email: string;
    headline?: string;
    about?: string;
    skills?: string[];
    experience?: any[];
    education?: any[];
    imageUrl?: string;
    role?: string;
  }) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  
  addSkill: async (clerkId: string, skill: string) => {
    const response = await api.post(`/users/${clerkId}/skills`, { skill });
    return response.data;
  },
  
  removeSkill: async (clerkId: string, skill: string) => {
    const response = await api.delete(`/users/${clerkId}/skills/${skill}`);
    return response.data;
  },
  
  addExperience: async (clerkId: string, experience: {
    title: string;
    company: string;
    location: string;
    startDate: Date;
    endDate?: Date;
    description: string;
  }) => {
    const response = await api.post(`/users/${clerkId}/experience`, experience);
    return response.data;
  },
  
  updateExperience: async (clerkId: string, expId: string, expData: any) => {
    const response = await api.put(`/users/${clerkId}/experience/${expId}`, expData);
    return response.data;
  },
  
  addEducation: async (clerkId: string, education: {
    school: string;
    degree: string;
    field: string;
    startYear: number;
    endYear?: number;
  }) => {
    const response = await api.post(`/users/${clerkId}/education`, education);
    return response.data;
  },
  
  updateEducation: async (clerkId: string, eduId: string, eduData: any) => {
    const response = await api.put(`/users/${clerkId}/education/${eduId}`, eduData);
    return response.data;
  }
};

export const mentorApi = {
  getAllMentors: async () => {
    const response = await api.get('/mentors');
    return response.data;
  },
  
  getMentorById: async (id: string) => {
    const response = await api.get(`/mentors/${id}`);
    return response.data;
  },
};

export const sessionApi = {
  getUserSessions: async (userId: string) => {
    const response = await api.get(`/sessions/user/${userId}`);
    return response.data;
  },
  
  bookSession: async (sessionData: {
    mentor: string;
    user: string;
    date: Date;
  }) => {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  },
  
  updateSessionStatus: async (sessionId: string, status: string) => {
    const response = await api.put(`/sessions/${sessionId}`, { status });
    return response.data;
  },
  
  cancelSession: async (sessionId: string) => {
    const response = await api.delete(`/sessions/${sessionId}`);
    return response.data;
  },
};

export const chatApi = {
  startChat: async (mentorId: string, studentId: string) => {
    const response = await fetch(`${API_URL}/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mentorId, studentId }),
    });
    return response.json();
  },

  getUserChats: async (userId: string) => {
    const response = await fetch(`${API_URL}/chats/user/${userId}`);
    return response.json();
  },

  getChat: async (chatId: string) => {
    const response = await fetch(`${API_URL}/chats/${chatId}`);
    return response.json();
  },

  sendMessage: async (chatId: string, sender: string, content: string) => {
    const response = await fetch(`${API_URL}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sender, content }),
    });
    return response.json();
  },
};

export const queriesApi = {
  getAllQueries: async () => {
    const response = await api.get('/queries');
    return response.data;
  },
  
  postQuery: async (queryData: {
    content: string;
    tags: string[];
    author: string;
  }) => {
    const response = await api.post('/queries', queryData);
    return response.data;
  },
  
  likeQuery: async (queryId: string, userId: string) => {
    const response = await api.post(`/queries/${queryId}/like`, { userId });
    return response.data;
  },
  
  replyToQuery: async (queryId: string, replyData: {
    content: string;
    author: string;
  }) => {
    const response = await api.post(`/queries/${queryId}/reply`, replyData);
    return response.data;
  },
};

export const jobApi = {
  getAllJobs: async () => {
    const response = await api.get('/jobs');
    return response.data;
  },
  
  getJobById: async (id: string) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },
  
  applyToJob: async (jobId: string, applicationData: {
    userId: string;
    email: string;
    phone: string;
    experience: string;
    coverLetter: string;
    resumeUrl?: string;
  }) => {
    const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
    return response.data;
  },
  
  getUserApplications: async (userId: string) => {
    const response = await api.get(`/jobs/applications/user/${userId}`);
    return response.data;
  }
}; 