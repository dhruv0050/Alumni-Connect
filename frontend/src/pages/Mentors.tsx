import NavBar from "@/components/NavBar"
import { Button } from "@/components/ui/button"
import { Search, Filter, Star } from "lucide-react"
import { useState, useEffect } from "react"
import BookingModal from "@/components/BookingModal"
import { useNavigate } from "react-router-dom"
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react"
import { mentorApi, sessionApi } from "@/services/api"
import { useToast } from "@/components/ui/use-toast"

interface Mentor {
  _id: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  batch: number;
  expertise: string[];
  imageUrl: string;
}

export default function Mentors() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const data = await mentorApi.getAllMentors() as Mentor[];
        setMentors(data);
      } catch (error) {
        console.error('Error fetching mentors:', error);
        toast({
          title: "Error",
          description: "Failed to load mentors. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, [toast]);

  const handleBookSession = async (date: Date) => {
    if (!selectedMentor || !user) return;

    try {
      await sessionApi.bookSession({
        mentor: selectedMentor._id,
        user: user.id,
        date: date,
      });

      toast({
        title: "Success!",
        description: "Session booked successfully!",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error booking session:', error);
      toast({
        title: "Error",
        description: "Failed to book session. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading mentors...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Mentor</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search mentors..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <Button variant="outline" className="flex items-center">
              <Filter className="h-5 w-5 mr-2" /> Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div key={mentor._id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <img src={mentor.imageUrl} alt={mentor.name} className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                  <p className="text-sm text-gray-600">{mentor.role} at {mentor.company}</p>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">{mentor.rating} (Batch: {mentor.batch})</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise.map((skill) => (
                    <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <SignedIn>
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => {
                      setSelectedMentor(mentor);
                      setIsBookingModalOpen(true);
                    }}
                  >
                    Book Session
                  </Button>
                </SignedIn>
                <SignedOut>
                  <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => navigate('/sign-in')}
                  >
                    Sign in to Book
                  </Button>
                </SignedOut>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMentor && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          mentor={selectedMentor}
          onBook={handleBookSession}
        />
      )}
    </div>
  );
}
