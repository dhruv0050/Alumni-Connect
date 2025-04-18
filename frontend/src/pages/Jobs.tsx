
import NavBar from "@/components/NavBar"
import { ButtonCustom } from "@/components/ui/button-custom"
import { BriefcaseIcon, MapPin, Clock, Building2 } from "lucide-react"

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
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
            <p className="mt-2 text-gray-600">Exclusive opportunities shared by alumni</p>
          </div>
          <ButtonCustom variant="default" size="lg" className="flex items-center">
            <BriefcaseIcon className="mr-2 h-5 w-5" /> Post a Job
          </ButtonCustom>
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
                    <ButtonCustom variant="secondary" size="sm">
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
    </div>
  )
}
