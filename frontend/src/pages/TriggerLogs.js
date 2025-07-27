import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Chip,
  Grid,
} from '@mui/material';
import { Add, Warning, TrendingUp } from '@mui/icons-material';
import { triggerLogAPI } from '../services/api';

const TriggerLogs = () => {
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    trigger: '',
    intensity: '',
    location: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const intensityLevels = [
    { value: 1, label: 'Very Low', color: '#4caf50' },
    { value: 2, label: 'Low', color: '#8bc34a' },
    { value: 3, label: 'Moderate', color: '#ff9800' },
    { value: 4, label: 'High', color: '#ff5722' },
    { value: 5, label: 'Very High', color: '#f44336' },
  ];

  useEffect(() => {
    loadTriggerLogs();
  }, []);

  const loadTriggerLogs = async () => {
    try {
      const response = await triggerLogAPI.getTriggerLogs();
      setLogs(response.data);
    } catch (err) {
      setError('Failed to load trigger logs');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.trigger || !formData.intensity) {
      setError('Please fill in trigger and intensity fields');
      return;
    }

    setLoading(true);
    try {
      await triggerLogAPI.saveTriggerLog(formData);
      setFormData({
        trigger: '',
        intensity: '',
        location: '',
        notes: '',
      });
      setSuccess('Trigger log saved successfully!');
      loadTriggerLogs();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save trigger log');
    } finally {
      setLoading(false);
    }
  };

  const getIntensityLabel = (intensity) => {
    const level = intensityLevels.find(l => l.value === intensity);
    return level ? level.label : intensity;
  };

  const getIntensityColor = (intensity) => {
    const level = intensityLevels.find(l => l.value === intensity);
    return level ? level.color : '#757575';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Trigger Logs
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Track emotional triggers to identify patterns and improve self-awareness.
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

      <Grid container spacing={3}>
        {/* Add New Trigger Log */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Warning sx={{ mr: 1, color: '#ff9800' }} />
              <Typography variant="h6">
                Log New Trigger
              </Typography>
            </Box>
            
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                required
                label="Trigger Description"
                name="trigger"
                value={formData.trigger}
                onChange={handleInputChange}
                placeholder="What triggered this emotion?"
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth required sx={{ mb: 2 }}>
                <InputLabel>Intensity Level</InputLabel>
                <Select
                  name="intensity"
                  value={formData.intensity}
                  onChange={handleInputChange}
                  label="Intensity Level"
                >
                  {intensityLevels.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Where did this happen?"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Additional Notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional details or context..."
                sx={{ mb: 2 }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Add />}
                fullWidth
              >
                {loading ? 'Saving...' : 'Save Trigger Log'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Logs */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <TrendingUp sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6">
                Recent Logs ({logs.length})
              </Typography>
            </Box>

            {logs.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Warning sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No trigger logs found. Start by logging your first trigger above!
                </Typography>
              </Box>
            ) : (
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {logs.slice(0, 10).map((log, index) => (
                  <ListItem key={index} sx={{ px: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Box sx={{ width: '100%', mb: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {log.trigger}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <Chip
                          label={getIntensityLabel(log.intensity)}
                          size="small"
                          sx={{
                            backgroundColor: getIntensityColor(log.intensity),
                            color: 'white',
                          }}
                        />
                        {log.location && (
                          <Chip
                            label={log.location}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                      {log.notes && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {log.notes}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {new Date(log.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TriggerLogs; 