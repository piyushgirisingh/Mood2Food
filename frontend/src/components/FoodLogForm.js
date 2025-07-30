import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Restaurant as RestaurantIcon,
  AccessTime as TimeIcon,
  EmojiEmotions as EmojiIcon,
} from '@mui/icons-material';
import { foodLogAPI } from '../services/api';

const FoodLogForm = ({ onFoodLogAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    foodItem: '',
    quantity: '',
    mealType: '',
    eatingTime: new Date().toISOString().slice(0, 16),
    emotionEmoji: '',
    emotionDescription: '',
    hungerLevel: 5,
    satisfactionLevel: 5,
    location: '',
    company: '',
    notes: '',
  });

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' },
  ];

  const emotionOptions = [
    { emoji: '😊', description: 'happy', label: 'Happy' },
    { emoji: '😢', description: 'sad', label: 'Sad' },
    { emoji: '😡', description: 'angry', label: 'Angry' },
    { emoji: '😴', description: 'tired', label: 'Tired' },
    { emoji: '😰', description: 'anxious', label: 'Anxious' },
    { emoji: '😋', description: 'hungry', label: 'Hungry' },
    { emoji: '😐', description: 'neutral', label: 'Neutral' },
    { emoji: '😤', description: 'stressed', label: 'Stressed' },
    { emoji: '🥱', description: 'bored', label: 'Bored' },
  ];

  const locationOptions = [
    'Home',
    'Work',
    'Restaurant',
    'Car',
    'Park',
    'Gym',
    'School',
    'Other',
  ];

  const companyOptions = [
    'Alone',
    'With Family',
    'With Friends',
    'With Colleagues',
    'With Partner',
    'Other',
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Fix timezone issue by preserving local time
      const localDateTime = new Date(formData.eatingTime);
      const offset = localDateTime.getTimezoneOffset();
      const utcDateTime = new Date(localDateTime.getTime() - (offset * 60 * 1000));
      
      const foodLogData = {
        ...formData,
        eatingTime: utcDateTime.toISOString(),
      };

      await foodLogAPI.createFoodLog(foodLogData);
      setSuccess('Food log added successfully!');
      
      // Reset form
      setFormData({
        foodItem: '',
        quantity: '',
        mealType: '',
        eatingTime: new Date().toISOString().slice(0, 16),
        emotionEmoji: '',
        emotionDescription: '',
        hungerLevel: 5,
        satisfactionLevel: 5,
        location: '',
        company: '',
        notes: '',
      });

      // Notify parent component
      if (onFoodLogAdded) {
        onFoodLogAdded();
      }

      // Dispatch custom event to refresh insights
      window.dispatchEvent(new Event('foodLogUpdated'));

      // Close dialog after a short delay
      setTimeout(() => {
        setOpen(false);
        setSuccess('');
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add food log');
    } finally {
      setLoading(false);
    }
  };

  const handleEmotionSelect = (emotion) => {
    setFormData(prev => ({
      ...prev,
      emotionEmoji: emotion.emoji,
      emotionDescription: emotion.description,
    }));
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
          },
        }}
      >
        Log Food Entry
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <RestaurantIcon color="primary" />
            <Typography variant="h6">Log Your Food Entry</Typography>
          </Box>
        </DialogTitle>
        
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}
              
              {success && (
                <Grid item xs={12}>
                  <Alert severity="success">{success}</Alert>
                </Grid>
              )}

              {/* Food Item */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="What did you eat?"
                  value={formData.foodItem}
                  onChange={(e) => handleInputChange('foodItem', e.target.value)}
                  required
                  placeholder="e.g., Grilled chicken salad"
                />
              </Grid>

              {/* Quantity */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="e.g., 1 bowl, 2 slices"
                />
              </Grid>

              {/* Meal Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Meal Type</InputLabel>
                  <Select
                    value={formData.mealType}
                    onChange={(e) => handleInputChange('mealType', e.target.value)}
                    label="Meal Type"
                  >
                    {mealTypes.map((meal) => (
                      <MenuItem key={meal.value} value={meal.value}>
                        {meal.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Eating Time */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="When did you eat?"
                  value={formData.eatingTime}
                  onChange={(e) => handleInputChange('eatingTime', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Emotion Selection */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  How did you feel when eating? <EmojiIcon color="primary" />
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {emotionOptions.map((emotion) => (
                    <Chip
                      key={emotion.description}
                      label={`${emotion.emoji} ${emotion.label}`}
                      onClick={() => handleEmotionSelect(emotion)}
                      variant={formData.emotionEmoji === emotion.emoji ? 'filled' : 'outlined'}
                      color={formData.emotionEmoji === emotion.emoji ? 'primary' : 'default'}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Grid>

              {/* Hunger Level */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Hunger Level (1-10): {formData.hungerLevel}
                </Typography>
                <Slider
                  value={formData.hungerLevel}
                  onChange={(e, value) => handleInputChange('hungerLevel', value)}
                  min={1}
                  max={10}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>

              {/* Satisfaction Level */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Satisfaction Level (1-10): {formData.satisfactionLevel}
                </Typography>
                <Slider
                  value={formData.satisfactionLevel}
                  onChange={(e, value) => handleInputChange('satisfactionLevel', value)}
                  min={1}
                  max={10}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>

              {/* Location */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    label="Location"
                  >
                    {locationOptions.map((location) => (
                      <MenuItem key={location} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Company */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Company</InputLabel>
                  <Select
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    label="Company"
                  >
                    {companyOptions.map((company) => (
                      <MenuItem key={company} value={company}>
                        {company}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Notes */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Additional Notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any thoughts about this meal..."
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !formData.foodItem}
              startIcon={<AddIcon />}
            >
              {loading ? 'Adding...' : 'Add Food Log'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default FoodLogForm; 