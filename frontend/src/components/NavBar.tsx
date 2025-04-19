import { ButtonCustom } from "./ui/button-custom"
import { useNavigate } from "react-router-dom"
import { useUser, useClerk } from "@clerk/clerk-react"
import { User } from "lucide-react"
import { Link } from "react-router-dom"
import { UserButton } from "@clerk/clerk-react"

export default function NavBar() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { signOut } = useClerk()
  
  // Use publicMetadata for role check
  const isMentor = user?.publicMetadata?.role === 'mentor'

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            AlumniConnect
          </Link>
          <div className="hidden md:flex ml-10 space-x-8">
            {isMentor ? (
              <>
                <Link to="/dashboard" className="text-gray-500 hover:text-gray-900">
                  Mentor Dashboard
                </Link>
                <Link to="/queries" className="text-gray-500 hover:text-gray-900">
                  View Queries
                </Link>
              </>
            ) : (
              <>
                <Link to="/mentors" className="text-gray-500 hover:text-gray-900">
                  Find Mentors
                </Link>
                <Link to="/queries" className="text-gray-500 hover:text-gray-900">
                  Open Queries
                </Link>
              </>
            )}
            <Link to="/jobs" className="text-gray-500 hover:text-gray-900">
              Job Board
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-500 hover:text-gray-900"
              >
                {isMentor ? 'Mentor Dashboard' : 'Dashboard'}
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Link
                to="/sign-in"
                className="text-gray-500 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                to="/sign-up"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
