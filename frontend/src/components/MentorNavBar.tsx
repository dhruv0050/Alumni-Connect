import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { MessageCircle, FileQuestion, Briefcase, Home } from "lucide-react";

export default function MentorNavBar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <Link to="/mentor-dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-600">AlumniConnect</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/mentor-dashboard"
                className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-indigo-600"
              >
                <Home className="w-5 h-5 mr-1" />
                Home
              </Link>
              <Link
                to="/messages"
                className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-indigo-600 relative"
              >
                <MessageCircle className="w-5 h-5 mr-1" />
                Messages
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </Link>
              <Link
                to="/queries"
                className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-indigo-600 relative"
              >
                <FileQuestion className="w-5 h-5 mr-1" />
                Open Queries
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </Link>
              <Link
                to="/post-job"
                className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-indigo-600"
              >
                <Briefcase className="w-5 h-5 mr-1" />
                Post Jobs
              </Link>
            </div>
          </div>

          {/* Right side - User button */}
          <div className="flex items-center">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/mentor-dashboard"
            className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
          >
            <Home className="inline-block w-5 h-5 mr-1" />
            Home
          </Link>
          <Link
            to="/messages"
            className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 relative"
          >
            <MessageCircle className="inline-block w-5 h-5 mr-1" />
            Messages
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span>
          </Link>
          <Link
            to="/queries"
            className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 relative"
          >
            <FileQuestion className="inline-block w-5 h-5 mr-1" />
            Open Queries
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span>
          </Link>
          <Link
            to="/post-job"
            className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
          >
            <Briefcase className="inline-block w-5 h-5 mr-1" />
            Post Jobs
          </Link>
        </div>
      </div>
    </nav>
  );
} 