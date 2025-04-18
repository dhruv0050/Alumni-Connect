import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { chatApi } from '@/services/api';
import { useUser } from '@clerk/clerk-react';
import { format } from 'date-fns';
import { io, Socket } from 'socket.io-client';

interface Message {
  sender: string;
  content: string;
  timestamp: Date;
  isPrivateInfoRedacted: boolean;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: {
    _id: string;
    name: string;
    role: string;
    company: string;
    imageUrl: string;
  };
}

const SOCKET_URL = 'http://localhost:5000';

export default function ChatModal({ isOpen, onClose, mentor }: ChatModalProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !socketRef.current) {
      socketRef.current = io(SOCKET_URL);

      socketRef.current.on('receive_message', (message: Message) => {
        setMessages(prev => [...prev, message]);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const initializeChat = async () => {
      if (!user || !mentor._id) return;
      
      try {
        const chat = await chatApi.startChat(mentor._id, user.id);
        setChatId(chat._id);
        setMessages(chat.messages || []);

        if (socketRef.current) {
          socketRef.current.emit('join_chat', chat._id);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    if (isOpen) {
      initializeChat();
    }
  }, [isOpen, mentor._id, user]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId || !user || !socketRef.current) return;

    try {
      const message = {
        sender: user.id,
        content: newMessage,
        timestamp: new Date(),
        isPrivateInfoRedacted: false
      };

      // Send message through Socket.IO
      socketRef.current.emit('send_message', {
        chatId,
        message
      });

      // Also save to database
      await chatApi.sendMessage(chatId, user.id, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[500px] h-[600px] flex flex-col p-0"
        aria-describedby="chat-modal-description"
      >
        <div id="chat-modal-description" className="sr-only">
          Chat conversation window with messages between mentor and student
        </div>
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center space-x-4">
            <img src={mentor.imageUrl} alt={mentor.name} className="h-12 w-12 rounded-full" />
            <div>
              <DialogTitle>{mentor.name}</DialogTitle>
              <p className="text-sm text-gray-500">{mentor.role} at {mentor.company}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-0">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === user?.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.isPrivateInfoRedacted && (
                    <p className="text-xs mt-1 italic opacity-75">
                      Private information was automatically redacted
                    </p>
                  )}
                  <p className="text-xs mt-1 opacity-75">
                    {format(new Date(message.timestamp), 'HH:mm')}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 min-h-[40px] max-h-[120px] p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="px-4"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Private information like phone numbers and email addresses will be automatically redacted.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 