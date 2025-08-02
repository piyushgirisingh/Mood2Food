import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  IconButton,
  Collapse,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  AccessTime as TimeIcon,
  EmojiEmotions as EmojiIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { foodLogAPI } from '../services/api';
import EditFoodLogForm from './EditFoodLogForm';

const TodayFoodLogs = ({ refreshTrigger }) => {
  const theme = useTheme();
  const [foodLogs, setFoodLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [editingFoodLog, setEditingFoodLog] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    loadTodayFoodLogs();
  }, [refreshTrigger]);

  const loadTodayFoodLogs = async () => {
    try {
      setLoading(true);
      const response = await foodLogAPI.getTodayFoodLogs();
      setFoodLogs(response.data);
    } catch (err) {
      setError('Failed to load today\'s food logs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (foodLogId) => {
    try {
      await foodLogAPI.deleteFoodLog(foodLogId);
      setFoodLogs(prev => prev.filter(log => log.id !== foodLogId));
      // Dispatch custom event to refresh insights
      window.dispatchEvent(new Event('foodLogUpdated'));
    } catch (err) {
      setError('Failed to delete food log');
    }
  };

  const handleEdit = (foodLog) => {
    setEditingFoodLog(foodLog);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditingFoodLog(null);
  };

  const handleFoodLogUpdated = () => {
    loadTodayFoodLogs();
    // Dispatch custom event to refresh insights
    window.dispatchEvent(new Event('foodLogUpdated'));
  };

  const toggleExpanded = (foodLogId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(foodLogId)) {
      newExpanded.delete(foodLogId);
    } else {
      newExpanded.add(foodLogId);
    }
    setExpandedItems(newExpanded);
  };

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMealTypeColor = (mealType) => {
    const colors = {
      breakfast: theme.palette.warning.main,
      lunch: theme.palette.success.main,
      dinner: theme.palette.info.main,
      snack: theme.palette.secondary.main,
    };
    return colors[mealType] || theme.palette.text.secondary;
  };

  const getSatisfactionColor = (level) => {
    if (level >= 8) return '#4caf50';
    if (level >= 6) return '#ff9800';
    return '#f44336';
  };

  const getHungerColor = (level) => {
    if (level >= 8) return '#f44336';
    if (level >= 6) return '#ff9800';
    return '#4caf50';
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

  if (foodLogs.length === 0) {
    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="center" p={3}>
            <RestaurantIcon sx={{ fontSize: 48, color: 'text.secondary', mr: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No food logs for today yet
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
        Today's Food Logs ({foodLogs.length})
      </Typography>
      
      <Grid container spacing={2}>
        {foodLogs.map((foodLog) => (
          <Grid item xs={12} key={foodLog.id}>
            <Card 
              sx={{ 
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                }
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={2} flex={1}>
                    <RestaurantIcon color="primary" />
                    <Box flex={1}>
                      <Typography variant="h6" component="div">
                        {foodLog.foodItem}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatTime(foodLog.eatingTime)}
                        </Typography>
                        {foodLog.quantity && (
                          <>
                            <Typography variant="body2" color="text.secondary">
                              •
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {foodLog.quantity}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={1}>
                    {foodLog.emotionEmoji && (
                      <Chip
                        icon={<EmojiIcon />}
                        label={foodLog.emotionEmoji}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    
                    {foodLog.mealType && (
                      <Chip
                        label={foodLog.mealType.charAt(0).toUpperCase() + foodLog.mealType.slice(1)}
                        size="small"
                        sx={{ 
                          backgroundColor: getMealTypeColor(foodLog.mealType),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                    
                    <IconButton
                      size="small"
                      onClick={() => toggleExpanded(foodLog.id)}
                    >
                      {expandedItems.has(foodLog.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                </Box>

                <Collapse in={expandedItems.has(foodLog.id)}>
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={2}>
                    {/* Satisfaction and Hunger Levels */}
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Satisfaction Level
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 100,
                            height: 8,
                            backgroundColor: theme.palette.divider,
                            borderRadius: 4,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${(foodLog.satisfactionLevel / 10) * 100}%`,
                              height: '100%',
                              backgroundColor: getSatisfactionColor(foodLog.satisfactionLevel),
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {foodLog.satisfactionLevel}/10
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Hunger Level
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 100,
                            height: 8,
                            backgroundColor: theme.palette.divider,
                            borderRadius: 4,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${(foodLog.hungerLevel / 10) * 100}%`,
                              height: '100%',
                              backgroundColor: getHungerColor(foodLog.hungerLevel),
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {foodLog.hungerLevel}/10
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Location and Company */}
                    {foodLog.location && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          Location
                        </Typography>
                        <Chip label={foodLog.location} size="small" variant="outlined" />
                      </Grid>
                    )}

                    {foodLog.company && (
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          Company
                        </Typography>
                        <Chip label={foodLog.company} size="small" variant="outlined" />
                      </Grid>
                    )}

                    {/* Notes */}
                    {foodLog.notes && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>
                          Notes
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {foodLog.notes}
                        </Typography>
                      </Grid>
                    )}

                    {/* Actions */}
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="flex-end" gap={1}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(foodLog)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(foodLog.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Edit Food Log Dialog */}
      <EditFoodLogForm
        open={editDialogOpen}
        onClose={handleEditClose}
        foodLog={editingFoodLog}
        onFoodLogUpdated={handleFoodLogUpdated}
      />
    </Box>
  );
};

export default TodayFoodLogs; 