import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import ProfileView from '../components/Profile/ProfileView';
import ProfileEdit from '../components/Profile/ProfileEdit';
import { IMentor } from '../../../backend/src/models/Mentor';
import { useUser } from "@clerk/clerk-react";
import { mentorApi } from '../services/api';
import NavBar from '../components/NavBar';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [mentor, setMentor] = useState<IMentor | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = user?.id === id;

  useEffect(() => {
    const fetchMentorProfile = async () => {
      try {
        setLoading(true);
        const data = await mentorApi.getMentorById(id!);
        setMentor(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMentorProfile();
    }
  }, [id]);

  const handleSave = async (updatedMentor: Partial<IMentor>) => {
    try {
      const response = await fetch(`/api/mentors/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMentor),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await response.json();
      setMentor(updatedData);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress />
          </Box>
        </div>
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <div>Error: {error || 'Profile not found'}</div>
            <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
              Go Back
            </Button>
          </Box>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isOwnProfile && !isEditing && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          </Box>
        )}

        {isEditing ? (
          <ProfileEdit
            mentor={mentor}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ProfileView mentor={mentor} isOwnProfile={isOwnProfile} />
        )}
      </div>
    </div>
  );
};

export default Profile; 