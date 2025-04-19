import { useState, useEffect } from "react"
import { useUser } from "@clerk/clerk-react"
import NavBar from "@/components/NavBar"
import { ButtonCustom } from "@/components/ui/button-custom"
import { MessageCircle, ThumbsUp, MessageSquare, Send, X, Trash2 } from "lucide-react"
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
  _id: string;
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

export default function Queries() {
  const { user } = useUser();
  const [queries, setQueries] = useState<Query[]>([]); // Initialize with empty array instead of dummy data
  const [newQuery, setNewQuery] = useState("");
  const [newQueryTitle, setNewQueryTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [replyContents, setReplyContents] = useState<Record<string, string>>({});
  const [showQueryForm, setShowQueryForm] = useState(false);
  const [animatingLikes, setAnimatingLikes] = useState<Record<string, boolean>>({});
  
  // Determine user role
  const isMentor = user?.publicMetadata?.role === 'mentor';
  
  useEffect(() => {
    fetchQueries();
  }, []);
  
  const fetchQueries = async () => {
    try {
      setLoading(true);
      // Get data from API
      const response = await queriesApi.getAllQueries();
      
      // If we got valid data, use it
      if (response && Array.isArray(response)) {
        setQueries(response as Query[]);
      } else {
        setQueries([]); // Set empty array if no valid data
      }
    } catch (error) {
      console.error("Error loading queries:", error);
      setQueries([]); // Set empty array on error
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

    if (!user?.id) {
      toast.error("You must be signed in to post a query");
      return;
    }
    
    try {
      const queryData = {
        content: newQuery,
        title: newQueryTitle,
        tags: [], // Could add tag input in the future
        author: user.id
      };
      
      // Make the API call first
      const savedQuery = await queriesApi.postQuery(queryData);
      
      // Only update UI after successful API call
      if (savedQuery) {
        setQueries(prevQueries => [savedQuery, ...prevQueries]);
        setNewQuery("");
        setNewQueryTitle("");
        setShowQueryForm(false);
        toast.success("Query posted successfully");
      }
    } catch (error) {
      console.error("Error posting query:", error);
      toast.error("Failed to post query. Please try again.");
    }
  };
  
  const handleLikeQuery = async (queryId: string) => {
    if (!user) {
      toast.error("You must be signed in to like a query");
      return;
    }
    
    // Find the query
    const query = queries.find(q => q._id === queryId);
    if (!query) return;
    
    // Check if user already liked this query
    const alreadyLiked = query.likedBy.includes(user.id || "");
    
    // Update UI immediately
    setQueries(prev => prev.map(q => {
      if (q._id === queryId) {
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
    if (!user) {
      toast.error("You must be signed in to reply");
      return;
    }

    const replyContent = replyContents[queryId];
    if (!replyContent?.trim()) {
      toast.error("Reply content cannot be empty");
      return;
    }
    
    try {
      console.log('Attempting to reply to query:', queryId);
      console.log('Reply data:', {
        content: replyContent,
        author: user.id
      });

      const replyData = {
        content: replyContent,
        author: user.id
      };
      
      const updatedQuery = await queriesApi.replyToQuery(queryId, replyData);
      console.log('Response from server:', updatedQuery);
      
      if (updatedQuery) {
        setQueries(prev => prev.map(query => 
          query._id === queryId ? updatedQuery : query
        ));
        
        setReplyContents(prev => ({
          ...prev,
          [queryId]: ""
        }));
        
        toast.success("Reply posted successfully");
      }
    } catch (error) {
      console.error("Error posting reply:", error);
      console.error("Full error details:", {
        queryId,
        error: error.response?.data || error.message
      });
      toast.error(error.response?.data?.message || "Failed to post reply");
    }
  };
  
  const handleReplyInputChange = (queryId: string, content: string) => {
    setReplyContents(prev => ({
      ...prev,
      [queryId]: content
    }));
  };
  
  const handleDeleteQuery = async (queryId: string) => {
    if (!user) {
      toast.error("You must be signed in to delete a query");
      return;
    }

    try {
      await queriesApi.deleteQuery(queryId, user.id);
      setQueries(prev => prev.filter(q => q._id !== queryId));
      toast.success("Query deleted successfully");
    } catch (error) {
      console.error("Error deleting query:", error);
      toast.error("Failed to delete query");
    }
  };
  
  const handleDeleteReply = async (queryId: string, replyId: string) => {
    if (!user) {
      toast.error("You must be signed in to delete a reply");
      return;
    }

    try {
      await queriesApi.deleteReply(queryId, replyId, user.id);
      setQueries(prev => prev.map(query => {
        if (query._id === queryId) {
          return {
            ...query,
            replies: query.replies.filter(reply => reply.id !== replyId)
          };
        }
        return query;
      }));
      toast.success("Reply deleted successfully");
    } catch (error) {
      console.error("Error deleting reply:", error);
      toast.error("Failed to delete reply");
    }
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
              <div key={query._id} className="bg-white rounded-lg shadow-md p-6 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{query.title}</h3>
                    <p className="text-gray-600 mb-4">{query.content}</p>
                  </div>
                  {user?.id === query.author && (
                    <button
                      onClick={() => handleDeleteQuery(query._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete query"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
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
                      onClick={() => handleLikeQuery(query._id)}
                    >
                      <ThumbsUp className="h-5 w-5" />
                      <span className={`transition-all ${animatingLikes[query._id] ? 'scale-125 font-bold' : ''}`}>
                        {query.likes}
                      </span>
                    </button>
                  )}
                  
                  {/* For users who aren't logged in or are mentors, just show the count */}
                  {(!user || isMentor) && (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <ThumbsUp className="h-5 w-5" />
                      <span className={`transition-all ${animatingLikes[query._id] ? 'scale-125 font-bold' : ''}`}>
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
                
                {/* Discussion Section */}
                <div className="mt-4">
                  {query.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 rounded p-4 mb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{reply.authorName}</p>
                          <p className="text-gray-700">{reply.content}</p>
                          <p className="text-gray-500 text-sm">
                            {new Date(reply.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {user?.id === reply.author && (
                          <button
                            onClick={() => handleDeleteReply(query._id, reply.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete reply"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Reply Input - Show for all logged-in users */}
                {user && (
                  <div className="mt-4 flex items-start space-x-2">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-indigo-600">
                        {user.fullName?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={replyContents[query._id] || ''}
                        onChange={(e) => handleReplyInputChange(query._id, e.target.value)}
                        placeholder="Write a reply..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                      />
                    </div>
                    <button
                      onClick={() => handleReplyToQuery(query._id)}
                      disabled={!replyContents[query._id]?.trim()}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Reply
                    </button>
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
