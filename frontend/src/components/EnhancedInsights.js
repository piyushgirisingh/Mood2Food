import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  Paper,
  Button,
} from "@mui/material";
import {
  TrendingUp,
  Psychology,
  Restaurant,
  AccessTime,
  Lightbulb,
  Warning,
  CheckCircle,
  Schedule,
  EmojiEvents,
  Timeline,
} from "@mui/icons-material";
import { insightAPI, foodLogAPI, triggerLogAPI } from "../services/api";

const EnhancedInsights = () => {
  const theme = useTheme();
  const [insights, setInsights] = useState(null);
  const [foodLogs, setFoodLogs] = useState([]);
  const [triggerLogs, setTriggerLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [insightsRes, foodLogsRes, triggerLogsRes] = await Promise.all([
        insightAPI.getAllInsights(),
        foodLogAPI.getFoodLogs(),
        triggerLogAPI.getTriggerLogs(),
      ]);

      setInsights(insightsRes.data);
      setFoodLogs(foodLogsRes.data || []);
      setTriggerLogs(triggerLogsRes.data || []);
    } catch (err) {
      console.error("Error loading insights data:", err);
      setError("Failed to load insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const analyzePatterns = () => {
    if (!foodLogs.length && !triggerLogs.length) {
      return {
        emotionalEatingFrequency: 0,
        commonTriggers: [],
        peakTimes: [],
        moodFoodConnections: [],
        progressIndicators: [],
        recommendations: [],
      };
    }

    // Analyze emotional eating frequency
    const emotionalLogs = foodLogs.filter(
      (log) => log.emotion && log.emotion !== "neutral"
    );
    const emotionalEatingFrequency =
      (emotionalLogs.length / foodLogs.length) * 100;

    // Analyze common triggers
    const triggerCounts = {};
    triggerLogs.forEach((log) => {
      if (log.triggers) {
        log.triggers.forEach((trigger) => {
          triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
        });
      }
    });
    const commonTriggers = Object.entries(triggerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([trigger, count]) => ({ trigger, count }));

    // Analyze peak times
    const timeCounts = {};
    console.log("Food logs for time analysis:", foodLogs);
    foodLogs.forEach((log) => {
      const hour = new Date(log.eatingTime).getHours();
      let timeSlot;
      if (hour >= 5 && hour < 12) {
        timeSlot = "Morning";
      } else if (hour >= 12 && hour < 17) {
        timeSlot = "Afternoon";
      } else {
        timeSlot = "Evening";
      }
      console.log(`Food log at ${log.eatingTime}, hour: ${hour}, timeSlot: ${timeSlot}`);
      timeCounts[timeSlot] = (timeCounts[timeSlot] || 0) + 1;
    });
    console.log("Time counts:", timeCounts);
    const peakTimes = Object.entries(timeCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([time, count]) => ({ time, count }));

    // Analyze mood-food connections
    const moodFoodConnections = [];
    const moodFoodMap = {};
    foodLogs.forEach((log) => {
      if (log.emotion && log.foodItems) {
        if (!moodFoodMap[log.emotion]) {
          moodFoodMap[log.emotion] = [];
        }
        moodFoodMap[log.emotion].push(...log.foodItems);
      }
    });

    Object.entries(moodFoodMap).forEach(([mood, foods]) => {
      const foodCounts = {};
      foods.forEach((food) => {
        foodCounts[food] = (foodCounts[food] || 0) + 1;
      });
      const topFood = Object.entries(foodCounts).sort(
        ([, a], [, b]) => b - a
      )[0];
      if (topFood) {
        moodFoodConnections.push({
          mood,
          food: topFood[0],
          frequency: topFood[1],
        });
      }
    });

    // Progress indicators
    const progressIndicators = [];
    const recentLogs = foodLogs.slice(-7); // Last 7 days
    const olderLogs = foodLogs.slice(-14, -7); // 7 days before that

    if (recentLogs.length > 0 && olderLogs.length > 0) {
      const recentEmotional = recentLogs.filter(
        (log) => log.emotion && log.emotion !== "neutral"
      ).length;
      const olderEmotional = olderLogs.filter(
        (log) => log.emotion && log.emotion !== "neutral"
      ).length;

      const emotionalChange =
        (recentEmotional / recentLogs.length -
          olderEmotional / olderLogs.length) *
        100;

      if (emotionalChange < 0) {
        progressIndicators.push({
          type: "improvement",
          message: `You've reduced emotional eating by ${Math.abs(
            emotionalChange
          ).toFixed(1)}% this week!`,
          icon: <CheckCircle />,
          color: "success",
        });
      } else if (emotionalChange > 0) {
        progressIndicators.push({
          type: "warning",
          message: `Emotional eating increased by ${emotionalChange.toFixed(
            1
          )}% this week.`,
          icon: <Warning />,
          color: "warning",
        });
      }
    }

    // Generate recommendations
    const recommendations = [];

    if (emotionalEatingFrequency > 50) {
      recommendations.push({
        priority: "high",
        message: "Consider using coping strategies before reaching for food",
        action: "Try the 5-minute pause technique",
      });
    }

    if (commonTriggers.length > 0) {
      const topTrigger = commonTriggers[0];
      recommendations.push({
        priority: "medium",
        message: `"${topTrigger.trigger}" is your most common trigger`,
        action: "Develop a plan for when this trigger occurs",
      });
    }

    if (peakTimes.length > 0 && peakTimes[0].time === "Evening") {
      recommendations.push({
        priority: "medium",
        message: "Evening is your peak emotional eating time",
        action: "Plan engaging evening activities",
      });
    }

    return {
      emotionalEatingFrequency,
      commonTriggers,
      peakTimes,
      moodFoodConnections,
      progressIndicators,
      recommendations,
    };
  };

  const patterns = analyzePatterns();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <LinearProgress sx={{ width: "100%" }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      {/* Progress Indicators */}
      {patterns.progressIndicators.length > 0 && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              <EmojiEvents sx={{ mr: 1, verticalAlign: "middle" }} />
              Your Progress
            </Typography>
            {patterns.progressIndicators.map((indicator, index) => (
              <Alert
                key={index}
                severity={indicator.color}
                icon={indicator.icon}
                sx={{ mb: 1 }}
              >
                {indicator.message}
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}



      {/* Common Triggers */}
      {patterns.commonTriggers.length > 0 && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              <Warning sx={{ mr: 1, verticalAlign: "middle" }} />
              Your Common Triggers
            </Typography>

            <Grid container spacing={1}>
              {patterns.commonTriggers.map((trigger, index) => (
                <Grid item key={index}>
                  <Chip
                    label={`${trigger.trigger} (${trigger.count})`}
                    color={index === 0 ? "error" : "default"}
                    variant={index === 0 ? "filled" : "outlined"}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Peak Times */}
      {patterns.peakTimes.length > 0 && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              <Schedule sx={{ mr: 1, verticalAlign: "middle" }} />
              Peak Emotional Eating Times
            </Typography>

            <List>
              {patterns.peakTimes.map((time, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <AccessTime />
                  </ListItemIcon>
                  <ListItemText
                    primary={time.time}
                    secondary={`${time.count} instances`}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={(time.count / patterns.peakTimes[0].count) * 100}
                    sx={{ width: 100, height: 6, borderRadius: 3 }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Mood-Food Connections */}
      {patterns.moodFoodConnections.length > 0 && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              <Restaurant sx={{ mr: 1, verticalAlign: "middle" }} />
              Mood-Food Patterns
            </Typography>

            <Grid container spacing={2}>
              {patterns.moodFoodConnections.map((connection, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="subtitle2" color="primary">
                      When feeling {connection.mood}
                    </Typography>
                    <Typography variant="h6">{connection.food}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {connection.frequency} times
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {patterns.recommendations.length > 0 && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              <Lightbulb sx={{ mr: 1, verticalAlign: "middle" }} />
              Personalized Recommendations
            </Typography>

            <List>
              {patterns.recommendations.map((rec, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      {rec.priority === "high" ? (
                        <Warning color="error" />
                      ) : (
                        <CheckCircle color="primary" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={rec.message}
                      secondary={rec.action}
                    />
                  </ListItem>
                  {index < patterns.recommendations.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      )}


    </Box>
  );
};

export default EnhancedInsights;
