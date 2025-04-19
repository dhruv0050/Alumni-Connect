import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { SignedIn, SignedOut, RedirectToSignIn, useUser, useClerk } from "@clerk/clerk-react";
import { userApi } from './services/api';

const queryClient = new QueryClient();

const App = () => {
  const { user, isLoaded } = useUser();
  const clerk = useClerk();
  const [isLoading, setIsLoading] = useState(true);
  const [isMentor, setIsMentor] = useState(false);
  const [roleCheckComplete, setRoleCheckComplete] = useState(false);

  useEffect(() => {
    const setupUser = async () => {
      // Only proceed if user is loaded and role check hasn't been completed
      if (!isLoaded || !user || roleCheckComplete) {
        setIsLoading(false);
        return;
      }

      const email = user.primaryEmailAddress?.emailAddress;
      if (!email) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('Checking mentor status for:', email);
        // Check mentor status
        const mentorCheck = await userApi.checkMentorStatus(email);
        console.log('Mentor check result:', mentorCheck);
        
        const shouldBeMentor = mentorCheck.isMentor;
        console.log('Should be mentor:', shouldBeMentor);
        
        // Update Clerk metadata using the correct method
        try {
          console.log('Current metadata:', user.publicMetadata);
          
          // First update the database
          await userApi.createOrUpdateUser({
            clerkId: user.id,
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: email,
            role: shouldBeMentor ? 'mentor' : 'user'
          });

          // Then update Clerk metadata
          await clerk.user?.update({
            unsafeMetadata: {
              role: shouldBeMentor ? 'mentor' : 'user'
            }
          });
          
          console.log('Updated metadata:', user.publicMetadata);
          setIsMentor(shouldBeMentor);
          
          // Force a reload if the role changed
          const currentRole = user.publicMetadata?.role;
          console.log('Current role:', currentRole, 'Should be:', shouldBeMentor ? 'mentor' : 'user');
          
          if (shouldBeMentor && currentRole !== 'mentor') {
            console.log('Role mismatch detected, reloading...');
            window.location.reload();
            return;
          }
        } catch (error) {
          console.error('Error updating metadata:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
        }
        
        setRoleCheckComplete(true);
      } catch (error) {
        console.error('Error in setupUser:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
      }

      setIsLoading(false);
    };

    setupUser();
  }, [isLoaded, user, roleCheckComplete, clerk]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Use the role from Clerk's publicMetadata and fallback to checking isMentor state
  const userIsMentor = user?.publicMetadata?.role === 'mentor' || isMentor;
  console.log('Rendering with userIsMentor:', userIsMentor, 'publicMetadata:', user?.publicMetadata);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/queries" element={<Queries />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/profile/:id" element={<Profile />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <SignedIn>
                  {userIsMentor ? <MentorDashboard /> : <Dashboard />}
                </SignedIn>
              }
            />
            <Route
              path="/chat/:chatId"
              element={
                <SignedIn>
                  <Chat />
                </SignedIn>
              }
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
