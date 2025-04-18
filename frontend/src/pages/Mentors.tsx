import React, { useState, useEffect, useMemo } from "react"
import NavBar from "@/components/NavBar"
import { Button } from "@/components/ui/button"
import { Search, Filter, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react"
import { mentorApi } from "@/services/api"
import { toast, Toaster } from "react-hot-toast"
import ChatModal from "@/components/ChatModal"
import FilterModal, { FilterOptions } from "@/components/FilterModal"

interface Mentor {
  _id: string;
  name: string;
  role: string;
  company: string;
  batch: string;
  branch: string;
  location: string;
  expertise: string[];
  imageUrl: string;
  rating?: number;
}

interface MentorFilters {
  batch: string;
  role: string;
  branch: string;
  location: string;
}

const applyFilters = (mentors: Mentor[], filters: MentorFilters) => {
  return mentors.filter((mentor) => {
    // Only apply batch filter if it's not set to "all"
    if (filters.batch !== "all" && mentor.batch.toString() !== filters.batch) {
      return false;
    }
    // Only apply role filter if it's not set to "All Roles"
    if (filters.role !== "All Roles" && mentor.role !== filters.role) {
      return false;
    }
    // Only apply branch filter if it's not set to "All Branches"
    if (filters.branch !== "All Branches" && mentor.branch !== filters.branch) {
      return false;
    }
    // Only apply location filter if it's not set to "All Locations"
    if (filters.location !== "All Locations" && mentor.location !== filters.location) {
      return false;
    }
    return true;
  });
};

export default function Mentors() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    batch: "all",
    role: "All Roles",
    branch: "All Branches",
    location: "All Locations"
  });
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const data = await mentorApi.getAllMentors() as Mentor[];
        setMentors(data);
      } catch (error) {
        toast.error('Failed to fetch mentors');
        console.error('Error fetching mentors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const filteredMentors = useMemo(() => {
    let result = mentors;

    // Apply search filter
    if (searchQuery) {
      result = result.filter((mentor) =>
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply other filters
    result = applyFilters(result, filters);

    return result;
  }, [mentors, searchQuery, filters]);

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
        <Toaster position="top-right" />
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Mentor</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search mentors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <Filter className="h-5 w-5 mr-2" /> Filter
            </Button>
          </div>
        </div>

        {filteredMentors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No mentors found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div key={mentor._id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <img src={mentor.imageUrl} alt={mentor.name} className="h-12 w-12 rounded-full" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                    <p className="text-sm text-gray-600">{mentor.role} at {mentor.company}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">{mentor.branch} (Batch: {mentor.batch})</span>
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
                        setIsChatModalOpen(true);
                      }}
                    >
                      Start Chat
                    </Button>
                  </SignedIn>
                  <SignedOut>
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={() => navigate('/sign-in')}
                    >
                      Sign in to Chat
                    </Button>
                  </SignedOut>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedMentor && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          mentor={selectedMentor}
        />
      )}

      {isFilterModalOpen && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={(newFilters) => setFilters(newFilters)}
          currentFilters={filters}
        />
      )}
    </div>
  );
}
