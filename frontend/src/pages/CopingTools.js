import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
} from '@mui/material';
import { Psychology, Add, History } from '@mui/icons-material';
import { copingToolAPI } from '../services/api';

const CopingTools = () => {
  const [tools] = useState([
    { name: 'Deep Breathing', description: 'Take slow, deep breaths for 5 minutes' },
    { name: 'Meditation', description: '10-minute mindfulness meditation' },
    { name: 'Progressive Muscle Relaxation', description: 'Tense and relax muscle groups' },
    { name: 'Journaling', description: 'Write down your thoughts and feelings' },
    { name: 'Exercise', description: 'Light physical activity or stretching' },
    { name: 'Listening to Music', description: 'Play calming or uplifting music' },
    { name: 'Positive Affirmations', description: 'Repeat encouraging statements to yourself' },
    { name: 'Grounding Technique', description: '5-4-3-2-1 sensory grounding exercise' },
  ]);
  
  const [usageHistory, setUsageHistory] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsageHistory();
  }, []);

  const loadUsageHistory = async () => {
    try {
      const response = await copingToolAPI.getUsageHistory();
      setUsageHistory(response.data);
    } catch (err) {
      setError('Failed to load usage history');
    }
  };

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    setDialogOpen(true);
  };

  const handleToolUse = async () => {
    setLoading(true);
    try {
      await copingToolAPI.logUsage(selectedTool.name);
      setDialogOpen(false);
      setSelectedTool(null);
      loadUsageHistory(); // Refresh history
      setError('');
    } catch (err) {
      setError('Failed to log tool usage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Coping Tools
        </Typography>
        <Button
          variant="outlined"
          startIcon={<History />}
          onClick={() => setHistoryDialogOpen(true)}
        >
          View History
        </Button>
      </Box>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Select a coping tool to help manage stress and improve your mood.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {tools.map((tool, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
              onClick={() => handleToolSelect(tool)}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Psychology sx={{ mr: 1, color: '#1976d2' }} />
                  <Typography variant="h6" component="div">
                    {tool.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {tool.description}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Add />}
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Use This Tool
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tool Usage Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Use Coping Tool</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {selectedTool?.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {selectedTool?.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click "Mark as Used" when you've completed this coping tool activity.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleToolUse} 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Logging...' : 'Mark as Used'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Usage History Dialog */}
      <Dialog 
        open={historyDialogOpen} 
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Usage History</DialogTitle>
        <DialogContent>
          {usageHistory.length === 0 ? (
            <Typography>No usage history found.</Typography>
          ) : (
            <List>
              {usageHistory.map((usage, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={usage.toolName}
                    secondary={new Date(usage.usedAt).toLocaleString()}
                  />
                  <Chip 
                    label="Completed" 
                    color="success" 
                    size="small" 
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CopingTools; 