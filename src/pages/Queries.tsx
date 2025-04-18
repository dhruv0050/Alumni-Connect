
import NavBar from "@/components/NavBar"
import { ButtonCustom } from "@/components/ui/button-custom"
import { MessageCircle, ThumbsUp, MessageSquare } from "lucide-react"

const queries = [
  {
    id: 1,
    author: "Alex Thompson",
    title: "Tips for System Design Interview at FAANG",
    content: "I have an upcoming system design interview at a FAANG company. Looking for advice on preparation strategies and key topics to focus on.",
    likes: 24,
    replies: 8,
    tags: ["System Design", "Interview Prep", "FAANG"],
    timeAgo: "2 hours ago"
  },
  {
    id: 2,
    author: "Emily Watson",
    title: "Career Switch from Backend to ML Engineering",
    content: "Currently working as a backend developer but interested in transitioning to ML Engineering. What skills should I prioritize?",
    likes: 15,
    replies: 12,
    tags: ["Career Switch", "Machine Learning", "Skills Development"],
    timeAgo: "5 hours ago"
  },
  // Add more queries as needed
]

export default function Queries() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Open Queries</h1>
            <p className="mt-2 text-gray-600">Get help from the community of mentors</p>
          </div>
          <ButtonCustom variant="default" size="lg" className="flex items-center">
            <MessageCircle className="mr-2 h-5 w-5" /> Post a Query
          </ButtonCustom>
        </div>

        <div className="space-y-6">
          {queries.map((query) => (
            <div key={query.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{query.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">Posted by {query.author} • {query.timeAgo}</p>
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
                <button className="flex items-center space-x-2 hover:text-indigo-600">
                  <ThumbsUp className="h-5 w-5" />
                  <span>{query.likes}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-indigo-600">
                  <MessageSquare className="h-5 w-5" />
                  <span>{query.replies} replies</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
