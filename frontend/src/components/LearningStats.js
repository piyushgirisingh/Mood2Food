import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  TrendingUp,
  Psychology,
  EmojiEvents,
  Timeline,
} from '@mui/icons-material';
import { chatAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const LearningStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadLearningStats();
    }
  }, [user]);

  const loadLearningStats = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getLearningStats();
      if (response.data && response.data.stats) {
        setStats(response.data.stats);
      } else {
        setStats({
          total_interactions: 0,
          average_rating: 0,
          success_rate: 0,
          recent_performance: 0,
          improvement: 0,
          successful_strategies: [],
          learning_curve: [],
        });
      }
    } catch (err) {
      console.error('Error loading learning stats:', err);
      setError('Failed to load learning statistics');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Please log in to view your learning progress.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!stats || stats.total_interactions === 0) {
    return (
      <Paper sx={{ p: 3, m: 2, textAlign: 'center' }}>
        <Psychology sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Start Your Learning Journey
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Rate the chatbot's responses to help it learn and improve. Your feedback helps create a more personalized experience!
        </Typography>
      </Paper>
    );
  }

  const getPerformanceColor = (value) => {
    if (value >= 4) return 'success';
    if (value >= 3) return 'warning';
    return 'error';
  };

  const getImprovementColor = (value) => {
    if (value > 0) return 'success';
    if (value < 0) return 'error';
    return 'default';
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Psychology color="primary" />
        Your Learning Progress
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Total Interactions */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" gutterBottom>
                {stats.total_interactions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Interactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Rating */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h4" 
                color={getPerformanceColor(stats.average_rating)}
                gutterBottom
              >
                {stats.average_rating.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Average Rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Success Rate */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h4" 
                color={getPerformanceColor(stats.success_rate / 20)} // Convert percentage to 5-scale
                gutterBottom
              >
                {stats.success_rate.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Success Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Performance */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h4" 
                color={getPerformanceColor(stats.recent_performance)}
                gutterBottom
              >
                {stats.recent_performance.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recent Performance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Improvement Indicator */}
      {stats.improvement !== 0 && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TrendingUp 
              color={getImprovementColor(stats.improvement)} 
              sx={{ 
                transform: stats.improvement < 0 ? 'rotate(180deg)' : 'none' 
              }} 
            />
            <Typography variant="h6">
              {stats.improvement > 0 ? 'Improving' : 'Needs Attention'}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {stats.improvement > 0 
              ? `Your recent performance has improved by ${Math.abs(stats.improvement).toFixed(1)} points!`
              : `Your recent performance has decreased by ${Math.abs(stats.improvement).toFixed(1)} points. Keep rating responses to help the AI learn.`
            }
          </Typography>
        </Paper>
      )}

      {/* Successful Strategies */}
      {stats.successful_strategies && stats.successful_strategies.length > 0 && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmojiEvents color="success" />
            Successful Strategies
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {stats.successful_strategies.map((strategy, index) => (
              <Chip
                key={index}
                label={strategy}
                color="success"
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Paper>
      )}

      {/* Learning Curve */}
      {stats.learning_curve && stats.learning_curve.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Timeline color="primary" />
            Learning Curve (Last 10 Interactions)
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            {stats.learning_curve.map((rating, index) => (
              <Chip
                key={index}
                label={`${rating}/5`}
                color={getPerformanceColor(rating)}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Higher ratings (4-5) indicate successful responses that the AI will learn from.
          </Typography>
        </Paper>
      )}

      {/* Tips */}
      <Paper sx={{ p: 2, mt: 2, bgcolor: 'info.light' }}>
        <Typography variant="h6" gutterBottom>
          💡 Tips for Better Learning
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Rate responses honestly - this helps the AI understand what works for you
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Higher ratings (4-5) teach the AI your preferred communication style
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Lower ratings (1-2) help the AI avoid responses that don't work for you
        </Typography>
        <Typography variant="body2">
          • The more you interact and rate, the more personalized your experience becomes
        </Typography>
      </Paper>
    </Box>
  );
};

export default LearningStats; 