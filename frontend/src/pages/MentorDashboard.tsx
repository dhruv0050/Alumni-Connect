import React, { useState, useEffect } from 'react';
import NavBar from "@/components/NavBar";
import { useUser } from "@clerk/clerk-react";
import { chatApi } from "@/services/api";
import { format } from "date-fns";
import ChatModal from "@/components/ChatModal";
import { ButtonCustom } from "@/components/ui/button-custom";
import { MessageCircle, Mail } from "lucide-react";

interface Message {
  _id: string;
  studentId: string;
  studentName: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export default function MentorDashboard() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<Message | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await chatApi.getUserChats(user?.id || '');
      setMessages(response);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="mt-2 text-gray-600">
            You have {messages.filter(m => m.unread).length} unread messages from students
          </p>
        </div>

        {/* Messages Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Message Inbox</h2>
            <ButtonCustom variant="outline" size="sm" onClick={fetchMessages}>
              Refresh
            </ButtonCustom>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No messages yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    message.unread ? 'bg-indigo-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-lg font-medium text-indigo-600">
                        {message.studentName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {message.studentName}
                      </h3>
                      <p className="text-sm text-gray-500">{message.lastMessage}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                    <ButtonCustom
                      variant="default"
                      size="sm"
                      className="flex items-center"
                      onClick={() => {
                        // Navigate to chat
                        window.location.href = `/chat/${message._id}`;
                      }}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Reply
                    </ButtonCustom>
                  </div>
                </div>
              ))}
            </div>
          )}
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