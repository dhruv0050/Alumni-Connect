import NavBar from "@/components/NavBar"
import { format } from "date-fns"
import { SignedIn, useUser } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { sessionApi } from "@/services/api"
import { useToast } from "@/components/ui/use-toast"

interface BookedSession {
  _id: string;
  mentor: {
    _id: string;
    name: string;
    role: string;
    company: string;
    imageUrl: string;
  };
  date: Date;
  status: "upcoming" | "completed" | "cancelled";
}

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<BookedSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;

      try {
        const data = await sessionApi.getUserSessions(user.id) as BookedSession[];
        // Filter out any sessions with invalid mentor data
        const validSessions = data.filter(session => session.mentor && session.mentor.imageUrl);
        setSessions(validSessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
        toast({
          title: "Error",
          description: "Failed to load sessions. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [user, toast]);

  const handleCancelSession = async (sessionId: string) => {
    try {
      await sessionApi.cancelSession(sessionId);
      setSessions(sessions.map(session => 
        session._id === sessionId 
          ? { ...session, status: 'cancelled' }
          : session
      ));
      toast({
        title: "Success!",
        description: "Session cancelled successfully.",
      });
    } catch (error) {
      console.error('Error cancelling session:', error);
      toast({
        title: "Error",
        description: "Failed to cancel session. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading sessions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.firstName || user?.username || 'User'}!
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Booked Sessions</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading your sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">You haven't booked any sessions yet.</p>
              <button
                onClick={() => navigate('/mentors')}
                className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Find a Mentor
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                session.mentor && (
                  <div
                    key={session._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={session.mentor.imageUrl}
                        alt={session.mentor.name}
                        className="h-12 w-12 rounded-full"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{session.mentor.name}</h3>
                        <p className="text-sm text-gray-500">
                          {session.mentor.role} at {session.mentor.company}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(session.date), "MMMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === "upcoming" ? "bg-green-100 text-green-800" :
                        session.status === "completed" ? "bg-gray-100 text-gray-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                      {session.status === "upcoming" && (
                        <button 
                          onClick={() => handleCancelSession(session._id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 