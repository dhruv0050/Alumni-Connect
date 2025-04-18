import React, { useState, useEffect } from 'react';
import NavBar from "@/components/NavBar";
import { useUser } from "@clerk/clerk-react";
import { chatApi } from "@/services/api";
import { format } from "date-fns";
import ChatModal from "@/components/ChatModal";

interface Chat {
  _id: string;
  studentId: string;
  messages: Array<{
    sender: string;
    content: string;
    timestamp: Date;
  }>;
  lastMessageAt: Date;
}

export default function MentorDashboard() {
  const { user } = useUser();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;

      try {
        const data = await chatApi.getUserChats(user.id);
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [user]);

  const getLastMessage = (chat: Chat) => {
    if (chat.messages.length === 0) return "No messages yet";
    return chat.messages[chat.messages.length - 1].content;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.firstName || user?.username}!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Chats Section */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Chats</h2>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading chats...</p>
                </div>
              ) : chats.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No active chats</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chats.map((chat) => (
                    <div
                      key={chat._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedChat(chat);
                        setIsChatModalOpen(true);
                      }}
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">Student ID: {chat.studentId}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {getLastMessage(chat)}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(chat.lastMessageAt), "MMM d, h:mm a")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Active Chats</p>
                  <p className="text-2xl font-semibold text-gray-900">{chats.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Messages</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {chats.reduce((total, chat) => total + chat.messages.length, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedChat && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false);
            setSelectedChat(null);
          }}
          mentor={{
            _id: user?.id || "",
            name: user?.firstName || user?.username || "",
            role: "Mentor",
            company: "",
            imageUrl: user?.imageUrl || ""
          }}
        />
      )}
    </div>
  );
} 