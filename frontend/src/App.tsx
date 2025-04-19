import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Mentors from "./pages/Mentors";
import Queries from "./pages/Queries";
import Jobs from "./pages/Jobs";
import NotFound from "./pages/NotFound";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import MentorDashboard from "./pages/MentorDashboard";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import { SignedIn, SignedOut, RedirectToSignIn, useAuth, useUser } from "@clerk/clerk-react";
import { userApi } from './services/api';
import Navbar from "@/components/Navbar";
import MentorNavbar from "@/components/MentorNavbar";

const queryClient = new QueryClient();

const App = () => {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const { user } = useUser();
  const [isMentor, setIsMentor] = useState(false);
  const [isUserSetupComplete, setIsUserSetupComplete] = useState(false);

  useEffect(() => {
    const setupUser = async () => {
      if (!isLoaded || !userId || !user) {
        setIsUserSetupComplete(false);
        return;
      }

      try {
        // Check if user exists in our database
        const email = user.primaryEmailAddress?.emailAddress;
        if (!email) {
          setIsUserSetupComplete(false);
          return;
        }

        // First check if they should be a mentor
        const mentorCheck = await userApi.checkMentorStatus(email);
        console.log('Mentor check result:', mentorCheck);

        // Create or update user in our database
        const userData = await userApi.createOrUpdateUser({
          clerkId: userId,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || email.split('@')[0].replace('.', ' '),
          email: email,
          role: mentorCheck.isMentor ? 'mentor' : 'user'
        });

        setIsMentor(userData.role === 'mentor');
        setIsUserSetupComplete(true);
      } catch (error) {
        console.error('Error in setupUser:', error);
        setIsUserSetupComplete(true);
      }
    };

    setupUser();
  }, [isLoaded, userId, user]);

  const shouldRedirectToMentorDashboard = (pathname: string) => {
    return isSignedIn && 
           isUserSetupComplete && 
           isMentor && 
           (pathname === '/' || pathname === '/dashboard');
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <div>
            {!['/sign-in', '/sign-up'].includes(window.location.pathname) && (
              isSignedIn ? (
                isMentor ? <MentorNavbar /> : <Navbar />
              ) : (
                <Navbar />
              )
            )}
            <Routes>
              <Route 
                path="/" 
                element={
                  shouldRedirectToMentorDashboard(window.location.pathname) 
                    ? <Navigate to="/mentor-dashboard" replace /> 
                    : <Index />
                } 
              />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/mentors" element={<Mentors />} />
              <Route path="/queries" element={<Queries />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route
                path="/dashboard"
                element={
                  shouldRedirectToMentorDashboard(window.location.pathname)
                    ? <Navigate to="/mentor-dashboard" replace />
                    : isSignedIn 
                      ? <Dashboard />
                      : <Navigate to="/sign-in" replace />
                }
              />
              <Route
                path="/mentor-dashboard"
                element={
                  isSignedIn
                    ? isMentor
                      ? <MentorDashboard />
                      : <Navigate to="/dashboard" replace />
                    : <Navigate to="/sign-in" replace />
                }
              />
              <Route
                path="/chat/:id"
                element={
                  isSignedIn
                    ? <Chat />
                    : <Navigate to="/sign-in" replace />
                }
              />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
