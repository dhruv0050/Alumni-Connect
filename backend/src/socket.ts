import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import Chat from './models/Chat';
import { redactPrivateInfo } from './utils/privacy';

export function initializeSocket(httpServer: HttpServer) {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"]
    }
  });

  const connectedUsers = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_chat', (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined chat ${chatId}`);
    });

    socket.on('send_message', async ({ chatId, message }) => {
      try {
        // Redact private information
        const redactedContent = redactPrivateInfo(message.content);
        const isPrivateInfoRedacted = message.content !== redactedContent;
        
        // Update message with redacted content
        const updatedMessage = {
          ...message,
          content: redactedContent,
          isPrivateInfoRedacted
        };

        // Save to database
        const chat = await Chat.findById(chatId);
        if (chat) {
          chat.messages.push(updatedMessage);
          chat.lastMessageAt = new Date();
          await chat.save();
        }

        // Broadcast to all users in the chat room
        io.to(chatId).emit('receive_message', updatedMessage);
      } catch (error) {
        console.error('Error handling message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
} 