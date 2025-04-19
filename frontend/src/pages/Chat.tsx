import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Send } from "lucide-react";
import { chatApi } from "@/services/api";

interface Message {
  _id: string;
  sender: string;
  senderName: string;
  content: string;
  timestamp: string;
}

interface ChatData {
  _id: string;
  studentId: string;
  studentName: string;
  mentorId: string;
  mentorName: string;
  messages: Message[];
}

export default function Chat() {
  const { chatId } = useParams();
  const { user } = useUser();
  const [chat, setChat] = useState<ChatData | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) {
      fetchChat();
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const fetchChat = async () => {
    try {
      setLoading(true);
      const response = await chatApi.getChat(chatId || '');
      setChat(response);
    } catch (error) {
      console.error("Error fetching chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chatId || !user) return;

    try {
      await chatApi.sendMessage(chatId, user.id, newMessage);
      setNewMessage("");
      fetchChat(); // Refresh chat to get the new message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          Loading chat...
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          Chat not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Chat Header */}
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Chat with {user?.id === chat.studentId ? chat.mentorName : chat.studentName}
            </h2>
          </div>

          {/* Messages */}
          <div className="p-4 h-[600px] overflow-y-auto">
            <div className="space-y-4">
              {chat.messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.sender === user?.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === user?.id
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === user?.id
                          ? "text-indigo-100"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTimestamp(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 min-w-0 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <ButtonCustom
                variant="default"
                size="default"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className="h-5 w-5" />
              </ButtonCustom>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 