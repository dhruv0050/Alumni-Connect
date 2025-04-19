import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import { chatApi, userApi, queriesApi } from "@/services/api";
import { format } from "date-fns";
import { MessageCircle, FileQuestion, Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface UserDetails {
  _id: string;
  clerkId: string;
  name: string;
  email: string;
  role: string;
}

interface Message {
  _id: string;
  sender: string;
  content: string;
  createdAt: string;
  read: boolean;
}

interface Chat {
  _id: string;
  studentId: string;
  studentName: string;
  lastMessage: Message;
  unreadCount: number;
}

interface Query {
  _id: string;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
  replies: Array<{
    content: string;
    author: string;
    createdAt: string;
  }>;
}

export default function MentorDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;

        // Get user details from MongoDB
        const userDetails = await userApi.getUserProfile(user.id) as UserDetails;
        
        // Fetch chats where the mentor is involved
        const userChats = await chatApi.getUserChats(userDetails._id) as Chat[];
        setChats(userChats);

        // Fetch all queries
        const allQueries = await queriesApi.getAllQueries() as Query[];
        setQueries(allQueries);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleChatClick = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  const handleQueryClick = (queryId: string) => {
    navigate(`/queries#${queryId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  const unreadMessages = chats.filter(chat => chat.unreadCount > 0).length;
  const unansweredQueries = queries.filter(q => !q.replies.length).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MessageCircle className="w-5 h-5 mr-2 text-indigo-600" />
                Unread Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">{unreadMessages}</div>
              <p className="text-sm text-gray-500">From students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileQuestion className="w-5 h-5 mr-2 text-indigo-600" />
                Open Queries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">{unansweredQueries}</div>
              <p className="text-sm text-gray-500">Awaiting response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Bell className="w-5 h-5 mr-2 text-indigo-600" />
                Total Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">
                {unreadMessages + unansweredQueries}
              </div>
              <p className="text-sm text-gray-500">Items needing attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Messages Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Recent Messages</h2>
            <Button 
              variant="outline"
              onClick={() => navigate('/messages')}
              className="flex items-center"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              View All Messages
            </Button>
          </div>
          <div className="grid gap-4">
            {chats.slice(0, 3).map((chat) => (
              <Card 
                key={chat._id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleChatClick(chat._id)}
              >
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{chat.studentName}</h3>
                      <p className="text-sm text-gray-600">
                        {chat.lastMessage?.content?.substring(0, 100)}...
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {format(new Date(chat.lastMessage?.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <Badge variant="destructive">{chat.unreadCount} new</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {chats.length === 0 && (
              <p className="text-gray-500">No messages yet</p>
            )}
          </div>
        </div>

        {/* Open Queries Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Open Queries</h2>
            <Button 
              variant="outline"
              onClick={() => navigate('/queries')}
              className="flex items-center"
            >
              <FileQuestion className="w-4 h-4 mr-2" />
              View All Queries
            </Button>
          </div>
          <div className="grid gap-4">
            {queries.filter(q => !q.replies.length).slice(0, 3).map((query) => (
              <Card 
                key={query._id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleQueryClick(query._id)}
              >
                <CardContent className="pt-6">
                  <h3 className="font-semibold">{query.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {query.content.substring(0, 150)}...
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-gray-500">
                      By {query.author.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(query.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {queries.filter(q => !q.replies.length).length === 0 && (
              <p className="text-gray-500">No open queries</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 