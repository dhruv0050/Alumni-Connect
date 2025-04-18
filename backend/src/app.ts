import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import mentorRoutes from './routes/mentors';
import chatRoutes from './routes/chat';
import { initializeSocket } from './socket';

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
initializeSocket(httpServer);

app.use(cors());
app.use(express.json());

app.use('/api/mentors', mentorRoutes);
app.use('/api/chats', chatRoutes);

export { httpServer as default }; 