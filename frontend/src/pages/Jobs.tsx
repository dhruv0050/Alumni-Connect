import { useState, useRef } from "react"
import { useUser } from "@clerk/clerk-react"
import NavBar from "@/components/NavBar"
import { ButtonCustom } from "@/components/ui/button-custom"
import { BriefcaseIcon, MapPin, Clock, Building2, X, Send, Trash2 } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"

interface JobApplication {
  jobId: number;
  name: string;
  email: string;
  phone: string;
  experience: string;
  coverletter: string;
  resume?: File | null;
}

const jobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Google",
    location: "Mountain View, CA",
    type: "Full-time",
    postedBy: "Sarah Johnson",
    postedDate: "2 days ago",
    requirements: [
      "5+ years of experience in full-stack development",
      "Strong knowledge of React and Node.js",
      "Experience with cloud platforms (AWS/GCP)"
    ],
    logo: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY4MTY4NjQyNA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=300"
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Microsoft",
    location: "Redmond, WA",
    type: "Full-time",
    postedBy: "Michael Chen",
    postedDate: "3 days ago",
    requirements: [
      "3+ years of product management experience",
      "Strong analytical and communication skills",
      "Experience with Agile methodologies"
    ],
    logo: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY4MTY4NjQyNA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=300"
  },
  // Add more jobs as needed
]

export default function Jobs() {
  const { user } = useUser();
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<typeof jobs[0] | null>(null);
  const [application, setApplication] = useState<JobApplication>({
    jobId: 0,
    name: "",
    email: "",
    phone: "",
    experience: "",
    coverletter: ""
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumeFileName, setResumeFileName] = useState<string>("");

  // Handle opening the application form
  const handleApplyClick = (job: typeof jobs[0]) => {
    setSelectedJob(job);
    // Pre-fill form with user data if available
    if (user) {
      setApplication({
        jobId: job.id,
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: "",
        experience: "",
        coverletter: ""
      });
    } else {
      setApplication({
        jobId: job.id,
        name: "",
        email: "",
        phone: "",
        experience: "",
        coverletter: ""
      });
    }
    setShowApplyForm(true);
  };

  // Handle application form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplication(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle application form submission
  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!application.name || !application.email || !application.experience || !application.coverletter) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Submit application (mock)
    toast.success("Application submitted successfully!");
    console.log("Application submitted:", application);
    
    // Close form
    setShowApplyForm(false);
    setSelectedJob(null);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setApplication(prev => ({
        ...prev,
        resume: file
      }));
      setResumeFileName(file.name);
      toast.success(`File ${file.name} selected`);
    }
  };
  
  // Trigger file input click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Clear selected file
  const handleClearFile = () => {
    setApplication(prev => ({
      ...prev,
      resume: null
    }));
    setResumeFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
            <p className="mt-2 text-gray-600">Exclusive opportunities shared by alumni</p>
          </div>
          {/* Only show Post Job button to logged in users */}
          {user && (
            <ButtonCustom variant="default" size="lg" className="flex items-center">
              <BriefcaseIcon className="mr-2 h-5 w-5" /> Post a Job
            </ButtonCustom>
          )}
        </div>

        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <img src={job.logo} alt={job.company} className="h-12 w-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">Posted by {job.postedBy} • {job.postedDate}</p>
                    </div>
                    <ButtonCustom 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleApplyClick(job)}
                    >
                      Apply Now
                    </ButtonCustom>
                  </div>
                  <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1" />
                      {job.company}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {job.type}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Requirements:</h4>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-600 space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplyForm && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Apply for {selectedJob.title} at {selectedJob.company}
              </h2>
              <button 
                onClick={() => setShowApplyForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitApplication} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={application.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={application.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={application.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Relevant Experience <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  value={application.experience}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Briefly describe your relevant experience for this position"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="coverletter" className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="coverletter"
                  name="coverletter"
                  value={application.coverletter}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Why are you interested in this position? How do you meet the requirements?"
                  required
                />
              </div>
              
              {/* CV Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resume/CV
                </label>
                <div className="flex items-center">
                  <div className="flex-1 border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-center">
                      {resumeFileName ? (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm text-gray-600">{resumeFileName}</span>
                          <button
                            type="button"
                            onClick={handleClearFile}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-sm text-gray-500">
                            Drag and drop your resume here, or
                          </p>
                          <button
                            type="button"
                            onClick={handleUploadClick}
                            className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            Browse files
                          </button>
                          <p className="text-xs text-gray-400 mt-1">
                            Supported formats: PDF, DOCX, DOC (Max 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <ButtonCustom 
                  type="button"
                  variant="outline"
                  onClick={() => setShowApplyForm(false)}
                >
                  Cancel
                </ButtonCustom>
                <ButtonCustom 
                  type="submit"
                  variant="default"
                  className="flex items-center"
                >
                  <Send className="mr-2 h-5 w-5" /> Submit Application
                </ButtonCustom>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
