import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Lightbulb as LightbulbIcon,
  EmojiEmotions as EmojiIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { foodInsightsAPI } from '../services/api';

const FoodInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInsights();
  }, []);

  // Listen for food log updates from parent components
  useEffect(() => {
    const handleFoodLogUpdate = () => {
      loadInsights();
    };

    // Listen for custom events when food logs are updated
    window.addEventListener('foodLogUpdated', handleFoodLogUpdate);
    
    return () => {
      window.removeEventListener('foodLogUpdated', handleFoodLogUpdate);
    };
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const response = await foodInsightsAPI.getEmotionalEatingPatterns();
      setInsights(response.data);
    } catch (err) {
      setError('Failed to load food insights');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!insights || insights.message) {
    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="center" p={3}>
            <PsychologyIcon sx={{ fontSize: 48, color: 'text.secondary', mr: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {insights?.message || 'No insights available yet'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const emotionalPatterns = insights.emotionalPatterns || {};
  const timePatterns = insights.timePatterns || {};
  const recommendations = insights.recommendations || [];

  const getEmotionColor = (emotion) => {
    const colors = {
      happy: '#4caf50',
      sad: '#2196f3',
      angry: '#f44336',
      anxious: '#ff9800',
      stressed: '#9c27b0',
      neutral: '#757575',
    };
    return colors[emotion] || '#757575';
  };



  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
        Your Food & Mood Insights
      </Typography>

      <Grid container spacing={3}>
        {/* Most Common Emotion */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <EmojiIcon color="primary" />
                <Typography variant="h6">Most Common Emotion</Typography>
              </Box>
              
              {emotionalPatterns.mostCommonEmotion && (
                <Box display="flex" alignItems="center" gap={2}>
                  <Chip
                    label={emotionalPatterns.mostCommonEmotion}
                    sx={{
                      backgroundColor: getEmotionColor(emotionalPatterns.mostCommonEmotion),
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      padding: '8px 16px',
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    When eating, you most often feel {emotionalPatterns.mostCommonEmotion}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Peak Eating Hours */}
        {timePatterns.peakHours && timePatterns.peakHours.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <TimeIcon color="primary" />
                  <Typography variant="h6">Peak Eating Hours</Typography>
                </Box>
                
                <Box display="flex" gap={1} flexWrap="wrap">
                  {timePatterns.peakHours.map((hour, index) => (
                    <Chip
                      key={hour}
                      label={`${hour}:00`}
                      variant="outlined"
                      color="primary"
                      size="small"
                    />
                  ))}
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  You tend to eat most during these hours
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}



        {/* Personalized Recommendations */}
        {recommendations.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <LightbulbIcon color="primary" />
                  <Typography variant="h6">Personalized Recommendations</Typography>
                </Box>
                
                <List>
                  {recommendations.map((recommendation, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <LightbulbIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={recommendation}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default FoodInsights; 