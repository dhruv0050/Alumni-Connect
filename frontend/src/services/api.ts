import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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