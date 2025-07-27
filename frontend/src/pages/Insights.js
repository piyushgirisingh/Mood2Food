import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Add, Lightbulb, TrendingUp } from '@mui/icons-material';
import { insightAPI } from '../services/api';

const Insights = () => {
  const [insights, setInsights] = useState([]);
  const [newInsight, setNewInsight] = useState('');
  const [latestInsight, setLatestInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadInsights();
    loadLatestInsight();
  }, []);

  const loadInsights = async () => {
    try {
      const response = await insightAPI.getAllInsights();
      setInsights(response.data);
    } catch (err) {
      setError('Failed to load insights');
    }
  };

  const loadLatestInsight = async () => {
    try {
      const response = await insightAPI.getLatestInsight();
      setLatestInsight(response.data);
    } catch (err) {
      // It's ok if there's no latest insight
      console.log('No latest insight found');
    }
  };

  const handleAddInsight = async () => {
    if (!newInsight.trim()) return;

    setLoading(true);
    try {
      await insightAPI.addInsight(newInsight);
      setNewInsight('');
      setSuccess('Insight added successfully!');
      loadInsights();
      loadLatestInsight();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add insight');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddInsight();
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Personal Insights
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Record your thoughts, realizations, and personal growth moments.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Latest Insight Card */}
      {latestInsight && (
        <Card sx={{ mb: 3, bgcolor: '#f3e5f5' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <TrendingUp sx={{ mr: 1, color: '#7b1fa2' }} />
              <Typography variant="h6" color="#7b1fa2">
                Latest Insight
              </Typography>
            </Box>
            <Typography variant="body1">
              {latestInsight.message}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {new Date(latestInsight.createdAt).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Add New Insight */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Lightbulb sx={{ mr: 1, color: '#f57c00' }} />
          <Typography variant="h6">
            Add New Insight
          </Typography>
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="What insights have you gained today? Share your thoughts, realizations, or lessons learned..."
          value={newInsight}
          onChange={(e) => setNewInsight(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleAddInsight}
          disabled={loading || !newInsight.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : <Add />}
        >
          {loading ? 'Adding...' : 'Add Insight'}
        </Button>
      </Paper>

      {/* All Insights */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          All Insights ({insights.length})
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {insights.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Lightbulb sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              No insights recorded yet. Start by adding your first insight above!
            </Typography>
          </Box>
        ) : (
          <List>
            {insights.map((insight, index) => (
              <React.Fragment key={insight.id}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {insight.message}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {new Date(insight.createdAt).toLocaleString()}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < insights.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default Insights; 