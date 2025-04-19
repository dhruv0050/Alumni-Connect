import { ButtonCustom } from "./ui/button-custom"
import { useNavigate } from "react-router-dom"
import { useUser, useClerk, SignedIn, SignedOut } from "@clerk/clerk-react"
import { User } from "lucide-react"

export default function NavBar() {
  const navigate = useNavigate()
  const { user } = useUser()
  const { signOut } = useClerk()

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-indigo-600">
              AlumniConnect
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <a href="/mentors" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Find Mentors
            </a>
            <a href="/queries" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Open Queries
            </a>
            <a href="/jobs" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Job Board
            </a>
            
            <SignedOut>
              <ButtonCustom variant="default" size="sm" onClick={() => navigate('/sign-in')}>
                Sign In
              </ButtonCustom>
              <ButtonCustom variant="secondary" size="sm" onClick={() => navigate('/sign-up')}>
                Register
              </ButtonCustom>
            </SignedOut>
            
            <SignedIn>
              <div className="flex items-center space-x-4">
                <ButtonCustom 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </ButtonCustom>
                <ButtonCustom variant="secondary" size="sm" onClick={() => signOut()}>
                  Sign Out
                </ButtonCustom>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}
