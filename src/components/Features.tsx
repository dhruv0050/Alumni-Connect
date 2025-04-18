
import { MessageCircle, FileCheck, BriefcaseIcon, Star, Shield, Users } from "lucide-react"

const features = [
  {
    name: "One-on-One Mentorship",
    description: "Book live sessions with experienced alumni for personalized career guidance.",
    icon: Users,
  },
  {
    name: "Secure Chat System",
    description: "Built-in chat feature for safe communication between mentors and students.",
    icon: MessageCircle,
  },
  {
    name: "AI Resume Analysis",
    description: "Get instant feedback on your resume with our AI-powered resume parser.",
    icon: FileCheck,
  },
  {
    name: "Job Alerts",
    description: "Receive job and internship opportunities directly from alumni.",
    icon: BriefcaseIcon,
  },
  {
    name: "Rating System",
    description: "Make informed decisions with our transparent mentor rating system.",
    icon: Star,
  },
  {
    name: "Safe Environment",
    description: "Robust reporting system to maintain a professional atmosphere.",
    icon: Shield,
  },
]

export default function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Why Choose Us</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to accelerate your career
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform offers comprehensive tools and features to help you connect with the right mentors and opportunities.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
