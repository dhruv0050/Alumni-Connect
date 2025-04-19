import { format, formatDistance } from "date-fns"
import { SignedIn, useUser } from "@clerk/clerk-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { sessionApi, queriesApi, userApi, jobApi } from "@/services/api"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, BriefcaseIcon, ThumbsUp, User, Pencil, Save, Plus, Trash2, School, BookOpen, Calendar, Award } from "lucide-react"
import { ButtonCustom } from "@/components/ui/button-custom"

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

interface JobApplication {
  id: string;
  jobId: number;
  jobTitle: string;
  company: string;
  status: "pending" | "reviewed" | "rejected" | "accepted";
  appliedDate: string;
}

// Mock job applications (would normally come from an API)
const mockJobApplications: JobApplication[] = [
  {
    id: "app1",
    jobId: 1,
    jobTitle: "Software Engineer",
    company: "Google",
    status: "pending",
    appliedDate: "2023-06-15"
  },
  {
    id: "app2",
    jobId: 2,
    jobTitle: "Product Manager",
    company: "Microsoft",
    status: "reviewed",
    appliedDate: "2023-06-10"
  }
];

// Updated interface for user profile to match backend
interface UserProfile {
  _id?: string;
  clerkId: string;
  name: string;
  email: string;
  headline?: string;
  about?: string;
  skills: string[];
  experience: {
    _id?: string;
    title: string;
    company: string;
    location: string;
    startDate: Date;
    endDate?: Date;
    description: string;
  }[];
  education: {
    _id?: string;
    school: string;
    degree: string;
    field: string;
    startYear: number;
    endYear?: number;
  }[];
  role: 'user' | 'mentor' | 'admin';
  imageUrl?: string;
}

// Helper function to generate a simple ID
const generateId = () => `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<BookedSession[]>([]);
  const [userQueries, setUserQueries] = useState<Query[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const { toast } = useToast();
  
  // New state for profile editing
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Fetch user profile from backend
        try {
          const userProfile = await userApi.getUserProfile(user.id);
          setProfile(userProfile as UserProfile);
          setEditedProfile(userProfile as UserProfile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Create default profile if not found
          const defaultProfile: UserProfile = {
            clerkId: user.id,
            name: user.fullName || user.username || 'Anonymous User',
            email: user.primaryEmailAddress?.emailAddress || '',
            headline: '',
            about: '',
            skills: [],
            experience: [],
            education: [],
            role: 'user',
            imageUrl: user.imageUrl || ''
          };
          setProfile(defaultProfile);
          setEditedProfile(defaultProfile);
        }

        // Fetch user's booked sessions
        try {
          const sessionsData = await sessionApi.getUserSessions(user.id) as BookedSession[];
          const validSessions = sessionsData.filter(session => session.mentor && session.mentor.imageUrl);
          setSessions(validSessions);
        } catch (error) {
          console.error('Error fetching sessions:', error);
          setSessions([]);
        }

        // Fetch user's queries
        try {
          const queriesData = await queriesApi.getAllQueries() as Query[];
          // Filter to only get the user's queries
          const userQueriesData = queriesData.filter(query => query.author === user.id);
          setUserQueries(userQueriesData);
        } catch (error) {
          console.error('Error fetching user queries:', error);
          setUserQueries([]);
        }

        // Fetch user's job applications
        try {
          const applicationsData = await jobApi.getUserApplications(user.id);
          setJobApplications(applicationsData as JobApplication[]);
        } catch (error) {
          console.error('Error fetching job applications:', error);
          setJobApplications([]);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load your data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
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
  
  // Handle profile changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedProfile) return;
    
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };
  
  // Handle adding a skill
  const handleAddSkill = async () => {
    if (!newSkill.trim() || !editedProfile || !user) return;
    
    // Check if the skill already exists
    if (editedProfile.skills.includes(newSkill.trim())) {
      toast({
        title: "Duplicate Skill",
        description: "This skill is already in your profile.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Add to backend
      await userApi.addSkill(user.id, newSkill.trim());
      
      // Update local state
      const updatedSkills = [...editedProfile.skills, newSkill.trim()];
      setEditedProfile({
        ...editedProfile,
        skills: updatedSkills
      });
      setNewSkill('');
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle removing a skill
  const handleRemoveSkill = async (skillToRemove: string) => {
    if (!editedProfile || !user) return;
    
    try {
      // Remove from backend
      await userApi.removeSkill(user.id, skillToRemove);
      
      // Update local state
      const updatedSkills = editedProfile.skills.filter(skill => skill !== skillToRemove);
      setEditedProfile({
        ...editedProfile,
        skills: updatedSkills
      });
    } catch (error) {
      console.error('Error removing skill:', error);
      toast({
        title: "Error",
        description: "Failed to remove skill. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle adding experience
  const handleAddExperience = () => {
    if (!editedProfile) return;
    
    const newExperience = {
      _id: generateId(),
      title: '',
      company: '',
      location: '',
      startDate: new Date(),
      description: ''
    };
    
    setEditedProfile({
      ...editedProfile,
      experience: [...editedProfile.experience, newExperience]
    });
  };
  
  // Handle experience changes
  const handleExperienceChange = (id: string, field: string, value: string) => {
    if (!editedProfile) return;
    
    const updatedExperience = editedProfile.experience.map(exp => {
      if (exp._id === id) {
        return { ...exp, [field]: field.includes('Date') ? new Date(value) : value };
      }
      return exp;
    });
    
    setEditedProfile({
      ...editedProfile,
      experience: updatedExperience
    });
  };
  
  // Handle removing experience
  const handleRemoveExperience = async (id: string) => {
    if (!editedProfile || !user) return;
    
    // If it has a MongoDB ID (not a local UUID), we need to delete from the backend
    const expToRemove = editedProfile.experience.find(exp => exp._id === id);
    if (expToRemove && id.length === 24) { // Assuming MongoDB ObjectId is 24 chars
      try {
        await userApi.updateExperience(user.id, id, { _delete: true });
      } catch (error) {
        console.error('Error removing experience:', error);
        toast({
          title: "Error",
          description: "Failed to remove experience. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Update local state
    setEditedProfile({
      ...editedProfile,
      experience: editedProfile.experience.filter(exp => exp._id !== id)
    });
  };
  
  // Handle adding education
  const handleAddEducation = () => {
    if (!editedProfile) return;
    
    const newEducation = {
      _id: generateId(),
      school: '',
      degree: '',
      field: '',
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear() + 4
    };
    
    setEditedProfile({
      ...editedProfile,
      education: [...editedProfile.education, newEducation]
    });
  };
  
  // Handle education changes
  const handleEducationChange = (id: string, field: string, value: string) => {
    if (!editedProfile) return;
    
    const updatedEducation = editedProfile.education.map(edu => {
      if (edu._id === id) {
        return { ...edu, [field]: field.includes('Year') ? parseInt(value) : value };
      }
      return edu;
    });
    
    setEditedProfile({
      ...editedProfile,
      education: updatedEducation
    });
  };
  
  // Handle removing education
  const handleRemoveEducation = async (id: string) => {
    if (!editedProfile || !user) return;
    
    // If it has a MongoDB ID (not a local UUID), we need to delete from the backend
    const eduToRemove = editedProfile.education.find(edu => edu._id === id);
    if (eduToRemove && id.length === 24) { // Assuming MongoDB ObjectId is 24 chars
      try {
        await userApi.updateEducation(user.id, id, { _delete: true });
      } catch (error) {
        console.error('Error removing education:', error);
        toast({
          title: "Error",
          description: "Failed to remove education. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Update local state
    setEditedProfile({
      ...editedProfile,
      education: editedProfile.education.filter(edu => edu._id !== id)
    });
  };
  
  // Handle saving profile
  const handleSaveProfile = async () => {
    if (!editedProfile || !user) return;
    
    setIsLoading(true);
    try {
      // Save profile to backend
      const savedProfile = await userApi.createOrUpdateUser({
        clerkId: user.id,
        name: editedProfile.name,
        email: editedProfile.email,
        headline: editedProfile.headline,
        about: editedProfile.about,
        skills: editedProfile.skills,
        experience: editedProfile.experience,
        education: editedProfile.education,
        imageUrl: editedProfile.imageUrl,
        role: editedProfile.role
      });
      
      setProfile(savedProfile as UserProfile);
      setIsEditingProfile(false);
      
      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.firstName || user?.username || 'User'}!
          </p>
        </div>

        <Tabs defaultValue="profile" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="sessions">Mentoring Sessions</TabsTrigger>
            <TabsTrigger value="queries">Your Queries</TabsTrigger>
            <TabsTrigger value="applications">Job Applications</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Profile</h2>
              {isEditingProfile ? (
                <div className="flex space-x-2">
                  <ButtonCustom
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingProfile(false);
                      setEditedProfile(profile); // Reset edited profile
                    }}
                  >
                    Cancel
                  </ButtonCustom>
                  <ButtonCustom
                    variant="default"
                    size="sm"
                    className="flex items-center"
                    onClick={handleSaveProfile}
                  >
                    <Save className="h-4 w-4 mr-2" /> Save Changes
                  </ButtonCustom>
                </div>
              ) : (
                <ButtonCustom
                  variant="default"
                  size="sm"
                  className="flex items-center"
                  onClick={() => setIsEditingProfile(true)}
                >
                  <Pencil className="h-4 w-4 mr-2" /> Edit Profile
                </ButtonCustom>
              )}
            </div>
            
            <div className="space-y-8">
              {/* User Info */}
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <User className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{user?.fullName || user?.username}</h3>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      name="headline"
                      value={editedProfile?.headline}
                      onChange={handleProfileChange}
                      placeholder="Add a headline (e.g. Software Engineer at Google)"
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                  ) : (
                    <p className="text-gray-600">{profile?.headline || "Add a headline to your profile"}</p>
                  )}
                </div>
              </div>
              
              {/* About */}
              <div>
                <h3 className="text-lg font-medium mb-2">About</h3>
                {isEditingProfile ? (
                  <textarea
                    name="about"
                    value={editedProfile?.about}
                    onChange={handleProfileChange}
                    placeholder="Write a short bio about yourself"
                    className="w-full p-3 border rounded-md"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-600">
                    {profile?.about || "Add information about yourself"}
                  </p>
                )}
              </div>
              
              {/* Skills */}
              <div>
                <h3 className="text-lg font-medium mb-2">Skills</h3>
                {isEditingProfile ? (
                  <div>
                    <div className="flex mb-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill"
                        className="flex-1 p-2 border rounded-l-md"
                      />
                      <button
                        onClick={handleAddSkill}
                        className="bg-indigo-600 text-white px-4 rounded-r-md hover:bg-indigo-700"
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editedProfile.skills.map((skill, index) => (
                        <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                          <span>{skill}</span>
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile?.skills.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <span key={index} className="bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No skills added yet</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Experience */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Experience</h3>
                  {isEditingProfile && (
                    <button 
                      onClick={handleAddExperience}
                      className="text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Experience
                    </button>
                  )}
                </div>
                
                {isEditingProfile ? (
                  <div className="space-y-4">
                    {editedProfile.experience.map((exp) => (
                      <div key={exp._id} className="border rounded-lg p-4 relative">
                        <button
                          onClick={() => handleRemoveExperience(exp._id || '')}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={exp.title}
                              onChange={(e) => handleExperienceChange(exp._id || '', 'title', e.target.value)}
                              className="w-full p-2 border rounded-md"
                              placeholder="Job Title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Company
                            </label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => handleExperienceChange(exp._id || '', 'company', e.target.value)}
                              className="w-full p-2 border rounded-md"
                              placeholder="Company Name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              value={exp.location}
                              onChange={(e) => handleExperienceChange(exp._id || '', 'location', e.target.value)}
                              className="w-full p-2 border rounded-md"
                              placeholder="Location"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                              </label>
                              <input
                                type="month"
                                value={exp.startDate.toISOString().split('T')[0]}
                                onChange={(e) => handleExperienceChange(exp._id || '', 'startDate', e.target.value)}
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                              </label>
                              <input
                                type="month"
                                value={exp.endDate?.toISOString().split('T')[0]}
                                onChange={(e) => handleExperienceChange(exp._id || '', 'endDate', e.target.value)}
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => handleExperienceChange(exp._id || '', 'description', e.target.value)}
                            className="w-full p-2 border rounded-md"
                            rows={3}
                            placeholder="Describe your responsibilities and achievements"
                          />
                        </div>
                      </div>
                    ))}
                    
                    {editedProfile.experience.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No experience added yet</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profile?.experience.length > 0 ? (
                      profile.experience.map((exp) => (
                        <div key={exp._id} className="border-b pb-4 last:border-0">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{exp.title}</h4>
                            <div className="text-gray-500 text-sm">
                              {exp.startDate && exp.endDate ? 
                                `${format(exp.startDate, "MMM yyyy")} - ${format(exp.endDate, "MMM yyyy")}` : 
                                exp.startDate ? `Since ${format(exp.startDate, "MMM yyyy")}` : ""}
                            </div>
                          </div>
                          <p className="text-gray-600">{exp.company} • {exp.location}</p>
                          <p className="text-gray-600 mt-2">{exp.description}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No experience added yet</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Education */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Education</h3>
                  {isEditingProfile && (
                    <button 
                      onClick={handleAddEducation}
                      className="text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Education
                    </button>
                  )}
                </div>
                
                {isEditingProfile ? (
                  <div className="space-y-4">
                    {editedProfile.education.map((edu) => (
                      <div key={edu._id} className="border rounded-lg p-4 relative">
                        <button
                          onClick={() => handleRemoveEducation(edu._id || '')}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              School
                            </label>
                            <input
                              type="text"
                              value={edu.school}
                              onChange={(e) => handleEducationChange(edu._id || '', 'school', e.target.value)}
                              className="w-full p-2 border rounded-md"
                              placeholder="School/University Name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Degree
                            </label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => handleEducationChange(edu._id || '', 'degree', e.target.value)}
                              className="w-full p-2 border rounded-md"
                              placeholder="e.g., Bachelor's, Master's"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Field of Study
                            </label>
                            <input
                              type="text"
                              value={edu.field}
                              onChange={(e) => handleEducationChange(edu._id || '', 'field', e.target.value)}
                              className="w-full p-2 border rounded-md"
                              placeholder="e.g., Computer Science"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Year
                              </label>
                              <input
                                type="number"
                                value={edu.startYear}
                                onChange={(e) => handleEducationChange(edu._id || '', 'startYear', e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="YYYY"
                                min="1900"
                                max="2099"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Year
                              </label>
                              <input
                                type="number"
                                value={edu.endYear}
                                onChange={(e) => handleEducationChange(edu._id || '', 'endYear', e.target.value)}
                                className="w-full p-2 border rounded-md"
                                placeholder="YYYY or Present"
                                min="1900"
                                max="2099"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {editedProfile.education.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No education added yet</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profile?.education.length > 0 ? (
                      profile.education.map((edu) => (
                        <div key={edu._id} className="border-b pb-4 last:border-0">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{edu.school}</h4>
                            <div className="text-gray-500 text-sm">
                              {edu.startYear} - {edu.endYear || 'Present'}
                            </div>
                          </div>
                          <p className="text-gray-600">{edu.degree} in {edu.field}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No education added yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Sessions Tab */}
          <TabsContent value="sessions" className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Booked Sessions</h2>
            
            {sessions.length === 0 ? (
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
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Queries Tab */}
          <TabsContent value="queries" className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Queries</h2>
            
            {userQueries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">You haven't posted any queries yet.</p>
                <button
                  onClick={() => navigate('/queries')}
                  className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Post a Query
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {userQueries.map((query) => (
                  <div key={query.id} className="border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{query.title}</h3>
                      <div className="flex items-center text-gray-500">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>{query.likes} likes</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{query.content}</p>
                    <p className="text-xs text-gray-500 mb-4">Posted {query.timestamp}</p>
                    
                    {/* Query Tags */}
                    {query.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {query.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Replies Section */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Replies ({query.replies.length})
                      </h4>
                      
                      {query.replies.length === 0 ? (
                        <p className="text-xs text-gray-500 mt-2">No replies yet.</p>
                      ) : (
                        <div className="space-y-3 mt-2">
                          {query.replies.map(reply => (
                            <div key={reply.id} className="bg-gray-50 p-3 rounded">
                              <div className="flex justify-between">
                                <p className="text-sm font-medium">{reply.authorName}</p>
                                <p className="text-xs text-gray-500">{reply.timestamp}</p>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Job Applications Tab */}
          <TabsContent value="applications" className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Job Applications</h2>
            
            {jobApplications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">You haven't applied to any jobs yet.</p>
                <button
                  onClick={() => navigate('/jobs')}
                  className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Explore Jobs
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied On
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobApplications.map((application) => (
                      <tr key={application.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{application.jobTitle}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{application.company}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{application.appliedDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                              application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'}`}
                          >
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 