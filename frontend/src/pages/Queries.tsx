import { useState, useEffect } from "react"
import { useUser } from "@clerk/clerk-react"
import NavBar from "@/components/NavBar"
import { ButtonCustom } from "@/components/ui/button-custom"
import { MessageCircle, ThumbsUp, MessageSquare, Send, X } from "lucide-react"
import { queriesApi } from "@/services/api"
import { toast, Toaster } from "react-hot-toast"

interface Reply {
  id: string;
  author: string;
  authorName: string;
  content: string;
  timestamp: string;
}

interface Query {
  id: string;
  author: string;
  authorName: string;
  title: string;
  content: string;
  likes: number;
  likedBy: string[];
  replies: Reply[];
  tags: string[];
  timestamp: string;
}

// Dummy data to display initially
const dummyQueries: Query[] = [
  {
    id: "1",
    author: "user1",
    authorName: "Alex Thompson",
    title: "Tips for System Design Interview at FAANG",
    content: "I have an upcoming system design interview at a FAANG company. Looking for advice on preparation strategies and key topics to focus on.",
    likes: 24,
    likedBy: [],
    replies: [],
    tags: ["System Design", "Interview Prep", "FAANG"],
    timestamp: "2 hours ago"
  },
  {
    id: "2",
    author: "user2",
    authorName: "Emily Watson",
    title: "Career Switch from Backend to ML Engineering",
    content: "Currently working as a backend developer but interested in transitioning to ML Engineering. What skills should I prioritize?",
    likes: 15,
    likedBy: [],
    replies: [],
    tags: ["Career Switch", "Machine Learning", "Skills Development"],
    timestamp: "5 hours ago"
  }
];

export default function Queries() {
  const { user } = useUser();
  const [queries, setQueries] = useState<Query[]>(dummyQueries); // Initialize with dummy data
  const [newQuery, setNewQuery] = useState("");
  const [newQueryTitle, setNewQueryTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [replyContents, setReplyContents] = useState<Record<string, string>>({});
  const [showQueryForm, setShowQueryForm] = useState(false);
  const [animatingLikes, setAnimatingLikes] = useState<Record<string, boolean>>({});
  
  // Determine user role - the requirements mentioned using user.role
  const isMentor = user?.publicMetadata?.role === 'mentor';
  
  useEffect(() => {
    fetchQueries();
  }, []);
  
  const fetchQueries = async () => {
    try {
      setLoading(true);
      // Try to get data from API
      const data = await queriesApi.getAllQueries().catch(error => {
        console.log("API error, using dummy data", error);
        return dummyQueries; // Fallback to dummy data on API failure
      });
      
      // If we got valid data, use it. Otherwise, use dummy data
      if (data && Array.isArray(data) && data.length > 0) {
        setQueries(data as Query[]);
      } else {
        setQueries(dummyQueries);
      }
    } catch (error) {
      console.error("Error loading queries:", error);
      // Use dummy data on error
      setQueries(dummyQueries);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePostQuery = async () => {
    if (!newQuery.trim()) {
      toast.error("Query content cannot be empty");
      return;
    }
    
    if (!newQueryTitle.trim()) {
      toast.error("Query title cannot be empty");
      return;
    }
    
    // Get current date/time for timestamp
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Create the new query for immediate UI update
    const newLocalQuery: Query = {
      id: Date.now().toString(), // Temporary ID
      author: user?.id || "",
      authorName: user?.fullName || "Anonymous",
      title: newQueryTitle,
      content: newQuery,
      likes: 0,
      likedBy: [],
      replies: [],
      tags: [],
      timestamp: `Today at ${formattedTime}`
    };
    
    // Update UI immediately
    setQueries(prevQueries => [newLocalQuery, ...prevQueries]);
    setNewQuery("");
    setNewQueryTitle("");
    setShowQueryForm(false);
    
    // Show success message
    toast.success("Query posted successfully");
    
    // Try to update backend (but don't disrupt user experience if it fails)
    try {
      const queryData = {
        content: newQuery,
        title: newQueryTitle,
        tags: [], // Could add tag input in the future
        author: user?.id || ""
      };
      
      await queriesApi.postQuery(queryData).catch(error => {
        console.error("Backend update failed:", error);
        // We already showed success, so no need to tell the user about backend failure
      });
    } catch (error) {
      console.error("Error posting query:", error);
      // We already showed success, so no need to tell the user about error
    }
  };
  
  const handleLikeQuery = async (queryId: string) => {
    if (!user) {
      toast.error("You must be signed in to like a query");
      return;
    }
    
    // Find the query
    const query = queries.find(q => q.id === queryId);
    if (!query) return;
    
    // Check if user already liked this query
    const alreadyLiked = query.likedBy.includes(user.id || "");
    
    // Update UI immediately
    setQueries(prev => prev.map(q => {
      if (q.id === queryId) {
        return {
          ...q,
          likes: alreadyLiked ? q.likes - 1 : q.likes + 1,
          likedBy: alreadyLiked 
            ? q.likedBy.filter(id => id !== user.id) 
            : [...q.likedBy, user.id || ""]
        };
      }
      return q;
    }));
    
    // Add animation to highlight the like count change
    setAnimatingLikes(prev => ({ ...prev, [queryId]: true }));
    setTimeout(() => {
      setAnimatingLikes(prev => ({ ...prev, [queryId]: false }));
    }, 1000);
    
    // Show success message
    toast.success(alreadyLiked ? "Unliked query" : "Liked query");
    
    // Try to update in backend (don't wait for response)
    try {
      queriesApi.likeQuery(queryId, user.id).catch(error => {
        console.error("Backend update failed:", error);
        // No need to tell user or revert UI, as we've already shown success
      });
    } catch (error) {
      console.error("Error liking query:", error);
      // No need to show error to user or revert UI
    }
  };
  
  const handleReplyToQuery = async (queryId: string) => {
    const replyContent = replyContents[queryId];
    if (!replyContent?.trim()) {
      toast.error("Reply content cannot be empty");
      return;
    }
    
    try {
      const replyData = {
        content: replyContent,
        author: user?.id || ""
      };
      
      await queriesApi.replyToQuery(queryId, replyData);
      
      // Get current date/time for timestamp
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Update UI optimistically
      const newReply: Reply = {
        id: Date.now().toString(),
        author: user?.id || "",
        authorName: user?.fullName || "Anonymous",
        content: replyContent,
        timestamp: `Today at ${formattedTime}`
      };
      
      setQueries(prev => prev.map(query => {
        if (query.id === queryId) {
          return {
            ...query,
            replies: [...query.replies, newReply]
          };
        }
        return query;
      }));
      
      toast.success("Reply posted successfully");
      
      // Clear the reply input
      setReplyContents(prev => ({
        ...prev,
        [queryId]: ""
      }));
    } catch (error) {
      toast.error("Failed to post reply");
      console.error("Error posting reply:", error);
    }
  };
  
  const handleReplyInputChange = (queryId: string, content: string) => {
    setReplyContents(prev => ({
      ...prev,
      [queryId]: content
    }));
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Open Queries</h1>
            <p className="mt-2 text-gray-600">Get help from the community of mentors</p>
          </div>
          {/* Post Query button only shown to logged-in regular users */}
          {user && !isMentor && (
            <ButtonCustom 
              variant="default" 
              size="lg" 
              className="flex items-center"
              onClick={() => setShowQueryForm(true)}
            >
              <MessageCircle className="mr-2 h-5 w-5" /> Post a Query
            </ButtonCustom>
          )}
        </div>

        {/* Query Form Modal - Only appears when button is clicked */}
        {showQueryForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-3xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">Post a New Query</h2>
                <button 
                  onClick={() => setShowQueryForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label htmlFor="query-title" className="block text-sm font-medium text-gray-700 mb-1">
                    Query Title
                  </label>
                  <input
                    id="query-title"
                    type="text"
                    value={newQueryTitle}
                    onChange={(e) => setNewQueryTitle(e.target.value)}
                    placeholder="Enter a clear, specific title for your query"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="query-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Query Description
                  </label>
                  <textarea
                    id="query-description"
                    value={newQuery}
                    onChange={(e) => setNewQuery(e.target.value)}
                    placeholder="Provide details about your query. What exactly do you need help with?"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    rows={6}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <ButtonCustom 
                    variant="outline" 
                    size="default" 
                    onClick={() => setShowQueryForm(false)}
                  >
                    Cancel
                  </ButtonCustom>
                  <ButtonCustom 
                    variant="default" 
                    size="default" 
                    className="flex items-center" 
                    onClick={handlePostQuery}
                  >
                    <MessageCircle className="mr-2 h-5 w-5" /> Submit Query
                  </ButtonCustom>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Query List */}
        {loading ? (
          <div className="text-center py-8">Loading queries...</div>
        ) : queries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No queries have been posted yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {queries.map((query) => (
              <div key={query.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{query.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">Posted by {query.authorName} • {query.timestamp}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600">{query.content}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {query.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center space-x-4 text-gray-500">
                  {/* Like Button (Only for regular users) */}
                  {user && !isMentor && (
                    <button 
                      className={`flex items-center space-x-2 hover:text-indigo-600 ${
                        query.likedBy.includes(user.id || "") ? 'text-indigo-600' : ''
                      }`}
                      onClick={() => handleLikeQuery(query.id)}
                    >
                      <ThumbsUp className="h-5 w-5" />
                      <span className={`transition-all ${animatingLikes[query.id] ? 'scale-125 font-bold' : ''}`}>
                        {query.likes}
                      </span>
                    </button>
                  )}
                  
                  {/* For users who aren't logged in or are mentors, just show the count */}
                  {(!user || isMentor) && (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <ThumbsUp className="h-5 w-5" />
                      <span className={`transition-all ${animatingLikes[query.id] ? 'scale-125 font-bold' : ''}`}>
                        {query.likes}
                      </span>
                    </div>
                  )}
                  
                  {/* Reply count display */}
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>{query.replies.length} replies</span>
                  </div>
                </div>
                
                {/* Replies Section */}
                {query.replies.length > 0 && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Replies</h4>
                    <div className="space-y-4">
                      {query.replies.map((reply) => (
                        <div key={reply.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-medium text-gray-900">{reply.authorName}</p>
                            <p className="text-xs text-gray-500">{reply.timestamp}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Reply Input Box (Only for mentors) */}
                {user && isMentor && (
                  <div className="mt-4 border-t pt-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={replyContents[query.id] || ''}
                        onChange={(e) => handleReplyInputChange(query.id, e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <button
                        className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        onClick={() => handleReplyToQuery(query.id)}
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
