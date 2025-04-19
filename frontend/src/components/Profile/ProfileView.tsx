import React from 'react';
import { Box, Avatar, Typography, Grid, Chip, Card, CardContent, Divider, Link, IconButton, Button } from '@mui/material';
import { LinkedIn, GitHub, Language, Twitter, LocationOn, Email, Phone, Edit } from '@mui/icons-material';
import { IMentor } from '../../../../backend/src/models/Mentor';

interface ProfileViewProps {
  mentor: IMentor;
  isOwnProfile: boolean;
  onEditClick?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ mentor, isOwnProfile, onEditClick }) => {
  const canViewPrivateInfo = isOwnProfile;

  const shouldShow = (field: keyof IMentor['privacySettings']) => {
    return isOwnProfile || mentor.privacySettings[field];
  };

  const formatDate = (date: string | undefined): string => {
    if (!date) return 'Present';
    try {
      return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', padding: 3 }}>
      {/* Header Section */}
      <Card sx={{ mb: 3, position: 'relative' }}>
        {isOwnProfile && onEditClick && (
          <IconButton
            onClick={onEditClick}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
            }}
          >
            <Edit />
          </IconButton>
        )}
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                src={mentor.imageUrl}
                alt={mentor.name}
                sx={{ width: 120, height: 120 }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                {mentor.name}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                {mentor.role} at {mentor.company}
              </Typography>
              <Box sx={{ mt: 2 }}>
                {shouldShow('location') && (
                  <Chip
                    icon={<LocationOn />}
                    label={mentor.location}
                    sx={{ mr: 1 }}
                  />
                )}
                {shouldShow('email') && (
                  <Chip
                    icon={<Email />}
                    label={mentor.email}
                    sx={{ mr: 1 }}
                  />
                )}
                {shouldShow('phone') && mentor.phone && (
                  <Chip
                    icon={<Phone />}
                    label={mentor.phone}
                    sx={{ mr: 1 }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Bio Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            About
          </Typography>
          <Typography variant="body1">
            {mentor.bio || 'No bio provided'}
          </Typography>
        </CardContent>
      </Card>

      {/* Social Links */}
      {shouldShow('socialLinks') && mentor.socialLinks && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Connect
            </Typography>
            <Box>
              {mentor.socialLinks.linkedin && (
                <IconButton href={mentor.socialLinks.linkedin} target="_blank">
                  <LinkedIn />
                </IconButton>
              )}
              {mentor.socialLinks.github && (
                <IconButton href={mentor.socialLinks.github} target="_blank">
                  <GitHub />
                </IconButton>
              )}
              {mentor.socialLinks.twitter && (
                <IconButton href={mentor.socialLinks.twitter} target="_blank">
                  <Twitter />
                </IconButton>
              )}
              {mentor.socialLinks.website && (
                <IconButton href={mentor.socialLinks.website} target="_blank">
                  <Language />
                </IconButton>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Experience Section */}
      {shouldShow('experience') && mentor.experience && mentor.experience.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Experience
            </Typography>
            {mentor.experience.map((exp, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {exp.title} at {exp.company}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                </Typography>
                {exp.description && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {exp.description}
                  </Typography>
                )}
                {index < mentor.experience.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Education Section */}
      {shouldShow('education') && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Education
            </Typography>
            {mentor.education?.map((edu, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {edu.degree}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {edu.institution} • {edu.year}
                </Typography>
                {index < (mentor.education?.length || 0) - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Expertise Section */}
      {mentor.expertise && mentor.expertise.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Areas of Expertise
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {mentor.expertise.map((skill, index) => (
                <Chip key={index} label={skill} />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ProfileView; 