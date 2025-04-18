
import { ButtonCustom } from "./ui/button-custom"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Connect with Industry</span>
            <span className="block text-indigo-600">Leading Alumni Mentors</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Get personalized career guidance, interview preparation, and professional insights from experienced alumni working at top companies.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <ButtonCustom variant="default" size="lg" className="w-full flex items-center justify-center">
                Find a Mentor <ArrowRight className="ml-2 h-5 w-5" />
              </ButtonCustom>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <ButtonCustom variant="secondary" size="lg" className="w-full flex items-center justify-center">
                Browse Open Queries
              </ButtonCustom>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
