import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  Fade,
  Zoom,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  EmojiEvents,
  Star,
  TrendingUp,
  Celebration,
  Close,
  CheckCircle,
  Favorite,
  Psychology,
  Restaurant,
  Timer,
  LocalFireDepartment,
  Diamond,
  WorkspacePremium,
  PsychologyAlt,
  Spa,
  DirectionsWalk,
  MusicNote,
  Brush,
  Book,
  Phone,
} from "@mui/icons-material";
import { foodLogAPI, triggerLogAPI, copingToolAPI } from "../services/api";

const ProgressCelebration = () => {
  const theme = useTheme();
  const [achievements, setAchievements] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [loading, setLoading] = useState(true);

  const achievementTypes = {
    streak: {
      icon: <LocalFireDepartment />,
      color: "#FF5722",
      gradient: "linear-gradient(135deg, #FF5722 0%, #FF9800 100%)",
    },
    milestone: {
      icon: <EmojiEvents />,
      color: "#FFD700",
      gradient: "linear-gradient(135deg, #FFD700 0%, #FFA000 100%)",
    },
    skill: {
      icon: <Psychology />,
      color: "#2196F3",
      gradient: "linear-gradient(135deg, #2196F3 0%, #03A9F4 100%)",
    },
    wellness: {
      icon: <Spa />,
      color: "#4CAF50",
      gradient: "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
    },
  };

  const allAchievements = [
    // Streak Achievements
    {
      id: "streak_3",
      name: "Getting Started",
      description: "3 days without emotional eating",
      type: "streak",
      requirement: 3,
      reward: "Bronze Badge",
      icon: <Star />,
    },
    {
      id: "streak_7",
      name: "Week Warrior",
      description: "7 days without emotional eating",
      type: "streak",
      requirement: 7,
      reward: "Silver Badge",
      icon: <TrendingUp />,
    },
    {
      id: "streak_14",
      name: "Fortnight Fighter",
      description: "14 days without emotional eating",
      type: "streak",
      requirement: 14,
      reward: "Gold Badge",
      icon: <EmojiEvents />,
    },
    {
      id: "streak_30",
      name: "Monthly Master",
      description: "30 days without emotional eating",
      type: "streak",
      requirement: 30,
      reward: "Diamond Badge",
      icon: <Diamond />,
    },
    {
      id: "streak_100",
      name: "Century Champion",
      description: "100 days without emotional eating",
      type: "streak",
      requirement: 100,
      reward: "Legendary Badge",
      icon: <WorkspacePremium />,
    },

    // Skill Achievements
    {
      id: "mindful_10",
      name: "Mindful Beginner",
      description: "Complete 10 mindful eating sessions",
      type: "skill",
      requirement: 10,
      reward: "Mindfulness Certificate",
      icon: <Psychology />,
    },
    {
      id: "coping_20",
      name: "Coping Expert",
      description: "Use coping strategies 20 times",
      type: "skill",
      requirement: 20,
      reward: "Coping Master Badge",
      icon: <PsychologyAlt />,
    },
    {
      id: "journal_30",
      name: "Reflection Master",
      description: "Log mood and triggers for 30 days",
      type: "skill",
      requirement: 30,
      reward: "Self-Awareness Award",
      icon: <Book />,
    },

    // Wellness Achievements
    {
      id: "exercise_15",
      name: "Active Lifestyle",
      description: "Complete 15 physical activities",
      type: "wellness",
      requirement: 15,
      reward: "Fitness Enthusiast Badge",
      icon: <DirectionsWalk />,
    },
    {
      id: "meditation_25",
      name: "Zen Master",
      description: "Complete 25 meditation sessions",
      type: "wellness",
      requirement: 25,
      reward: "Inner Peace Award",
      icon: <Spa />,
    },
    {
      id: "creative_10",
      name: "Creative Soul",
      description: "Complete 10 creative activities",
      type: "wellness",
      requirement: 10,
      reward: "Artistic Expression Badge",
      icon: <Brush />,
    },
  ];

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    setLoading(true);
    try {
      // Load food logs, trigger logs, and coping tool usage
      const [foodLogsRes, triggerLogsRes, copingToolsRes] = await Promise.all([
        foodLogAPI.getFoodLogs(),
        triggerLogAPI.getTriggerLogs(),
        copingToolAPI.getUsageHistory(),
      ]);

      const foodLogs = foodLogsRes.data || [];
      const triggerLogs = triggerLogsRes.data || [];
      const copingTools = copingToolsRes.data || [];

      // Calculate streaks and achievements
      calculateStreaks(foodLogs);
      calculateAchievements(foodLogs, triggerLogs, copingTools);
    } catch (err) {
      console.error("Error loading progress data:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreaks = (foodLogs) => {
    // Calculate current streak (days without emotional eating)
    const today = new Date();
    let currentStreakCount = 0;
    let longestStreakCount = 0;
    let tempStreak = 0;

    // Sort logs by date
    const sortedLogs = foodLogs.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    for (let i = 0; i < sortedLogs.length; i++) {
      const log = sortedLogs[i];
      const logDate = new Date(log.timestamp);
      const isEmotionalEating = log.emotion && log.emotion !== "neutral";

      if (!isEmotionalEating) {
        tempStreak++;
        if (i === 0) currentStreakCount = tempStreak;
      } else {
        longestStreakCount = Math.max(longestStreakCount, tempStreak);
        tempStreak = 0;
      }
    }

    longestStreakCount = Math.max(longestStreakCount, tempStreak);
    setCurrentStreak(currentStreakCount);
    setLongestStreak(longestStreakCount);
    setTotalDays(foodLogs.length);
  };

  const calculateAchievements = (foodLogs, triggerLogs, copingTools) => {
    const earnedAchievements = [];

    // Calculate various metrics
    const mindfulSessions = foodLogs.filter((log) => log.mindfulEating).length;
    const copingToolUsage = copingTools.length;
    const journalEntries = triggerLogs.length;
    const exerciseActivities = copingTools.filter(
      (tool) =>
        tool.toolName.toLowerCase().includes("walk") ||
        tool.toolName.toLowerCase().includes("exercise")
    ).length;
    const meditationSessions = copingTools.filter(
      (tool) =>
        tool.toolName.toLowerCase().includes("breathing") ||
        tool.toolName.toLowerCase().includes("meditation")
    ).length;
    const creativeActivities = copingTools.filter(
      (tool) =>
        tool.toolName.toLowerCase().includes("draw") ||
        tool.toolName.toLowerCase().includes("creative")
    ).length;

    // Check each achievement
    allAchievements.forEach((achievement) => {
      let earned = false;
      let progress = 0;

      switch (achievement.id) {
        case "streak_3":
        case "streak_7":
        case "streak_14":
        case "streak_30":
        case "streak_100":
          progress = currentStreak;
          earned = currentStreak >= achievement.requirement;
          break;
        case "mindful_10":
          progress = mindfulSessions;
          earned = mindfulSessions >= achievement.requirement;
          break;
        case "coping_20":
          progress = copingToolUsage;
          earned = copingToolUsage >= achievement.requirement;
          break;
        case "journal_30":
          progress = journalEntries;
          earned = journalEntries >= achievement.requirement;
          break;
        case "exercise_15":
          progress = exerciseActivities;
          earned = exerciseActivities >= achievement.requirement;
          break;
        case "meditation_25":
          progress = meditationSessions;
          earned = meditationSessions >= achievement.requirement;
          break;
        case "creative_10":
          progress = creativeActivities;
          earned = creativeActivities >= achievement.requirement;
          break;
      }

      if (earned) {
        earnedAchievements.push({
          ...achievement,
          progress,
          earnedAt: new Date().toISOString(),
        });
      }
    });

    setAchievements(earnedAchievements);
  };

  const getProgressPercentage = (achievement) => {
    const progress = achievement.progress || 0;
    return Math.min((progress / achievement.requirement) * 100, 100);
  };

  const handleAchievementClick = (achievement) => {
    setSelectedAchievement(achievement);
    setShowCelebration(true);
  };

  const getRewardSuggestions = () => [
    "Treat yourself to a relaxing bath",
    "Buy yourself a small plant or flowers",
    "Take yourself to a movie",
    "Get a massage or spa treatment",
    "Buy a new book you've been wanting",
    "Plan a fun day trip",
    "Buy yourself a nice piece of jewelry",
    "Take a cooking class",
    "Get a new hobby supply",
    "Plan a special dinner with friends",
  ];

  return (
    <Box>
      {/* Current Progress Overview */}
      <Card
        sx={{
          mb: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <TrendingUp sx={{ mr: 1, fontSize: 32 }} />
            <Typography variant="h5" fontWeight="bold">
              Your Progress Journey
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight="bold" color="#FFD700">
                  {currentStreak}
                </Typography>
                <Typography variant="body1">Current Streak (Days)</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight="bold" color="#FFD700">
                  {longestStreak}
                </Typography>
                <Typography variant="body1">Longest Streak</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h3" fontWeight="bold" color="#FFD700">
                  {achievements.length}
                </Typography>
                <Typography variant="body1">Achievements Earned</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={3}>
            <EmojiEvents sx={{ mr: 1, verticalAlign: "middle" }} />
            Your Achievements
          </Typography>

          {achievements.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary" mb={2}>
                No achievements earned yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Keep using the app and making healthy choices to earn your first
                achievement!
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {achievements.map((achievement) => (
                <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      background: achievementTypes[achievement.type].gradient,
                      color: "white",
                      "&:hover": { transform: "translateY(-4px)" },
                    }}
                    onClick={() => handleAchievementClick(achievement)}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        {achievement.icon}
                        <Typography variant="h6" sx={{ ml: 1 }}>
                          {achievement.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" mb={2}>
                        {achievement.description}
                      </Typography>
                      <Chip
                        label={achievement.reward}
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Progress Towards Next Achievement */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" mb={3}>
            <Star sx={{ mr: 1, verticalAlign: "middle" }} />
            Progress Towards Next Achievements
          </Typography>

          <List>
            {achievements
              .filter((a) => a.type === "streak")
              .sort((a, b) => a.requirement - b.requirement)
              .slice(0, 3)
              .map((achievement) => (
                <ListItem key={achievement.id}>
                  <ListItemIcon>{achievement.icon}</ListItemIcon>
                  <ListItemText
                    primary={achievement.name}
                    secondary={`${achievement.progress}/${achievement.requirement} days`}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={getProgressPercentage(achievement)}
                    sx={{ width: 100, height: 8, borderRadius: 4 }}
                  />
                </ListItem>
              ))}
          </List>
        </CardContent>
      </Card>

      {/* Reward Suggestions */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={3}>
            <Favorite sx={{ mr: 1, verticalAlign: "middle" }} />
            Non-Food Reward Ideas
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Celebrate your achievements with these healthy rewards:
          </Typography>
          <Grid container spacing={1}>
            {getRewardSuggestions().map((reward, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Chip label={reward} variant="outlined" sx={{ mb: 1 }} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Achievement Celebration Dialog */}
      <Dialog
        open={showCelebration}
        onClose={() => setShowCelebration(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              <Celebration
                sx={{ mr: 1, verticalAlign: "middle", color: "#FFD700" }}
              />
              Achievement Unlocked!
            </Typography>
            <IconButton onClick={() => setShowCelebration(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {selectedAchievement && (
            <Box textAlign="center" py={2}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: "auto",
                  mb: 2,
                  background:
                    achievementTypes[selectedAchievement.type].gradient,
                }}
              >
                {selectedAchievement.icon}
              </Avatar>

              <Typography variant="h5" fontWeight="bold" mb={2}>
                {selectedAchievement.name}
              </Typography>

              <Typography variant="body1" mb={2}>
                {selectedAchievement.description}
              </Typography>

              <Chip
                label={selectedAchievement.reward}
                color="primary"
                size="large"
                sx={{ mb: 2 }}
              />

              <Typography variant="body2" color="text.secondary">
                You earned this on{" "}
                {new Date(selectedAchievement.earnedAt).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowCelebration(false)} variant="contained">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProgressCelebration;
