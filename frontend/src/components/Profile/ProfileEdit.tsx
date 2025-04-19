import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { IMentor } from '../../../../backend/src/models/Mentor';

interface ProfileEditProps {
  mentor: IMentor;
  onSave: (updatedMentor: Partial<IMentor>) => Promise<void>;
  onCancel: () => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ mentor, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<IMentor>>({
    ...mentor,
  });

  const [newExpertise, setNewExpertise] = useState('');

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrivacyChange = (field: keyof IMentor['privacySettings']) => {
    setFormData((prev) => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        [field]: !prev.privacySettings?.[field],
      },
    }));
  };

  const handleSocialLinksChange = (platform: keyof IMentor['socialLinks'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleAddExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        { title: '', company: '', startDate: new Date(), description: '' },
      ],
    }));
  };

  const handleExperienceChange = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience?.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const handleRemoveExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience?.filter((_, i) => i !== index),
    }));
  };

  const handleAddEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        { degree: '', institution: '', year: new Date().getFullYear() },
      ],
    }));
  };

  const handleEducationChange = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education?.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const handleRemoveEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education?.filter((_, i) => i !== index),
    }));
  };

  const handleAddExpertise = () => {
    if (newExpertise.trim()) {
      setFormData((prev) => ({
        ...prev,
        expertise: [...(prev.expertise || []), newExpertise.trim()],
      }));
      setNewExpertise('');
    }
  };

  const handleRemoveExpertise = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 1200, margin: 'auto', padding: 3 }}>
      {/* Personal Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Personal Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                value={formData.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={4}
                value={formData.bio || ''}
                onChange={(e) => handleChange('bio', e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Professional Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Current Role"
                value={formData.role || ''}
                onChange={(e) => handleChange('role', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                value={formData.company || ''}
                onChange={(e) => handleChange('company', e.target.value)}
                required
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Social Links
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="LinkedIn"
                value={formData.socialLinks?.linkedin || ''}
                onChange={(e) => handleSocialLinksChange('linkedin', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="GitHub"
                value={formData.socialLinks?.github || ''}
                onChange={(e) => handleSocialLinksChange('github', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Twitter"
                value={formData.socialLinks?.twitter || ''}
                onChange={(e) => handleSocialLinksChange('twitter', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Personal Website"
                value={formData.socialLinks?.website || ''}
                onChange={(e) => handleSocialLinksChange('website', e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Experience</Typography>
            <Button startIcon={<AddIcon />} onClick={handleAddExperience}>
              Add Experience
            </Button>
          </Box>
          {formData.experience?.map((exp, index) => (
            <Box key={index} sx={{ mb: 3, position: 'relative' }}>
              <IconButton
                size="small"
                onClick={() => handleRemoveExperience(index)}
                sx={{ position: 'absolute', right: 0, top: 0 }}
              >
                <DeleteIcon />
              </IconButton>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={exp.title}
                    onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleExperienceChange(index, 'startDate', new Date(e.target.value))}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleExperienceChange(index, 'endDate', new Date(e.target.value))}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={2}
                    value={exp.description || ''}
                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Education</Typography>
            <Button startIcon={<AddIcon />} onClick={handleAddEducation}>
              Add Education
            </Button>
          </Box>
          {formData.education?.map((edu, index) => (
            <Box key={index} sx={{ mb: 3, position: 'relative' }}>
              <IconButton
                size="small"
                onClick={() => handleRemoveEducation(index)}
                sx={{ position: 'absolute', right: 0, top: 0 }}
              >
                <DeleteIcon />
              </IconButton>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Degree"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Institution"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Year"
                    type="number"
                    value={edu.year}
                    onChange={(e) => handleEducationChange(index, 'year', parseInt(e.target.value))}
                    required
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Expertise */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Areas of Expertise
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs>
                <TextField
                  fullWidth
                  label="Add Expertise"
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddExpertise();
                    }
                  }}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={handleAddExpertise}
                  sx={{ height: '100%' }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.expertise?.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                onDelete={() => handleRemoveExpertise(index)}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Privacy Settings
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.privacySettings?.email || false}
                    onChange={() => handlePrivacyChange('email')}
                  />
                }
                label="Show Email"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.privacySettings?.phone || false}
                    onChange={() => handlePrivacyChange('phone')}
                  />
                }
                label="Show Phone"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.privacySettings?.location || false}
                    onChange={() => handlePrivacyChange('location')}
                  />
                }
                label="Show Location"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.privacySettings?.socialLinks || false}
                    onChange={() => handlePrivacyChange('socialLinks')}
                  />
                }
                label="Show Social Links"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.privacySettings?.experience || false}
                    onChange={() => handlePrivacyChange('experience')}
                  />
                }
                label="Show Experience"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.privacySettings?.education || false}
                    onChange={() => handlePrivacyChange('education')}
                  />
                }
                label="Show Education"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" type="submit" color="primary">
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileEdit; 