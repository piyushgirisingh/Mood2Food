import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton,
  Alert,
  useTheme,
  Paper,
} from "@mui/material";
import {
  Psychology,
  Favorite,
  ExpandMore,
  ExpandLess,
  Timer,
  DirectionsWalk,
  MusicNote,
  Book,
  Spa,
  Phone,
  SportsEsports,
  Brush,
  Restaurant,
  LocalCafe,
} from "@mui/icons-material";
import { copingToolAPI } from "../services/api";

const copingStrategies = {
  Stressed: [
    {
      name: "Deep Breathing",
      icon: <Spa />,
      duration: "5 min",
      description:
        "Take slow, deep breaths to activate your parasympathetic nervous system",
    },
    {
      name: "Quick Walk",
      icon: <DirectionsWalk />,
      duration: "10 min",
      description: "Physical movement helps reduce cortisol levels",
    },
    {
      name: "Mindful Tea",
      icon: <LocalCafe />,
      duration: "15 min",
      description: "Sip slowly and focus on the taste and warmth",
    },
    {
      name: "Progressive Relaxation",
      icon: <Psychology />,
      duration: "10 min",
      description: "Tense and relax each muscle group",
    },
  ],
  Sad: [
    {
      name: "Call a Friend",
      icon: <Phone />,
      duration: "15 min",
      description: "Social connection releases oxytocin",
    },
    {
      name: "Listen to Music",
      icon: <MusicNote />,
      duration: "20 min",
      description: "Choose uplifting or calming tunes",
    },
    {
      name: "Creative Activity",
      icon: <Brush />,
      duration: "30 min",
      description: "Drawing, painting, or crafting",
    },
    {
      name: "Read Something Uplifting",
      icon: <Book />,
      duration: "20 min",
      description: "Positive stories or motivational content",
    },
  ],
  Bored: [
    {
      name: "Learn Something New",
      icon: <Book />,
      duration: "30 min",
      description: "Watch an educational video or read",
    },
    {
      name: "Creative Project",
      icon: <Brush />,
      duration: "45 min",
      description: "Start a new hobby or project",
    },
    {
      name: "Physical Activity",
      icon: <SportsEsports />,
      duration: "20 min",
      description: "Dance, exercise, or play a game",
    },
    {
      name: "Organize Something",
      icon: <Psychology />,
      duration: "30 min",
      description: "Clean a drawer or organize photos",
    },
  ],
  Anxious: [
    {
      name: "Grounding Exercise",
      icon: <Psychology />,
      duration: "5 min",
      description: "Name 5 things you can see, 4 you can touch, 3 you can hear",
    },
    {
      name: "Gentle Stretching",
      icon: <Spa />,
      duration: "15 min",
      description: "Slow, mindful movements",
    },
    {
      name: "Write It Down",
      icon: <Book />,
      duration: "10 min",
      description: "Journal your worries and possible solutions",
    },
    {
      name: "Nature Sounds",
      icon: <MusicNote />,
      duration: "20 min",
      description: "Listen to rain, waves, or forest sounds",
    },
  ],
  Lonely: [
    {
      name: "Reach Out",
      icon: <Phone />,
      duration: "15 min",
      description: "Call or message someone you care about",
    },
    {
      name: "Join Online Community",
      icon: <SportsEsports />,
      duration: "30 min",
      description: "Find groups with shared interests",
    },
    {
      name: "Self-Care Activity",
      icon: <Spa />,
      duration: "45 min",
      description: "Take a bath, do skincare, or pamper yourself",
    },
    {
      name: "Volunteer Virtually",
      icon: <Psychology />,
      duration: "60 min",
      description: "Help others through online platforms",
    },
  ],
  Angry: [
    {
      name: "Cool Down Walk",
      icon: <DirectionsWalk />,
      duration: "20 min",
      description: "Physical activity helps release tension",
    },
    {
      name: "Write a Letter",
      icon: <Book />,
      duration: "15 min",
      description: "Write out your feelings (don't send it)",
    },
    {
      name: "Intense Exercise",
      icon: <SportsEsports />,
      duration: "30 min",
      description: "Channel anger into physical activity",
    },
    {
      name: "Count to 100",
      icon: <Timer />,
      duration: "5 min",
      description: "Simple but effective anger management technique",
    },
  ],
  Happy: [
    {
      name: "Celebrate Mindfully",
      icon: <Restaurant />,
      duration: "30 min",
      description: "Enjoy a special treat without overindulging",
    },
    {
      name: "Share Joy",
      icon: <Phone />,
      duration: "15 min",
      description: "Call someone to share your good mood",
    },
    {
      name: "Creative Expression",
      icon: <Brush />,
      duration: "45 min",
      description: "Channel positive energy into art",
    },
    {
      name: "Plan Something Fun",
      icon: <Psychology />,
      duration: "20 min",
      description: "Plan future activities to look forward to",
    },
  ],
};

const CopingStrategies = () => {
  const theme = useTheme();
  const [selectedMood, setSelectedMood] = useState("Stressed");
  const [expandedStrategy, setExpandedStrategy] = useState(null);
  const [usedStrategies, setUsedStrategies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadUsedStrategies();
  }, []);

  const loadUsedStrategies = async () => {
    try {
      const response = await copingToolAPI.getUsageHistory();
      if (response.data) {
        setUsedStrategies(response.data);
      }
    } catch (err) {
      console.error("Error loading used strategies:", err);
    }
  };

  const handleStrategyUse = async (strategy) => {
    setLoading(true);
    try {
      await copingToolAPI.logUsage(strategy.name);
      setSuccess(`Great job using "${strategy.name}"! Keep it up!`);
      loadUsedStrategies();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error logging strategy use:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExpandStrategy = (strategyName) => {
    setExpandedStrategy(
      expandedStrategy === strategyName ? null : strategyName
    );
  };

  const getMostUsedStrategies = () => {
    const strategyCounts = {};
    usedStrategies.forEach((usage) => {
      strategyCounts[usage.toolName] =
        (strategyCounts[usage.toolName] || 0) + 1;
    });

    return Object.entries(strategyCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
  };

  const currentStrategies =
    copingStrategies[selectedMood] || copingStrategies["Stressed"];

  return (
    <Box>
      <Card
        sx={{
          mb: 2,
          background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
          border: "1px solid #475569",
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Psychology sx={{ mr: 1, color: "#8B5CF6" }} />
            <Typography variant="h6" sx={{ color: "#F8FAFC", fontWeight: 600 }}>
              Coping Strategies
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ color: "#CBD5E1", mb: 2 }}>
            Find healthy alternatives to emotional eating based on your current
            mood
          </Typography>

          {/* Mood Selection */}
          <Typography
            variant="subtitle2"
            mb={1}
            sx={{ color: "#F1F5F9", fontWeight: 500 }}
          >
            Select your current mood:
          </Typography>
          <Grid container spacing={1} mb={3}>
            {Object.keys(copingStrategies).map((mood) => (
              <Grid item key={mood}>
                <Chip
                  label={mood}
                  onClick={() => setSelectedMood(mood)}
                  sx={{
                    bgcolor: selectedMood === mood ? "#8B5CF6" : "transparent",
                    color: selectedMood === mood ? "white" : "#D1D5DB",
                    border: "1px solid",
                    borderColor: selectedMood === mood ? "#8B5CF6" : "#4B5563",
                    fontWeight: 500,
                    "&:hover": {
                      bgcolor:
                        selectedMood === mood
                          ? "#7C3AED"
                          : "rgba(139, 92, 246, 0.1)",
                      borderColor: "#8B5CF6",
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Strategies List */}
      <Card
        sx={{
          mb: 2,
          background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
          border: "1px solid #475569",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            mb={2}
            sx={{ color: "#F8FAFC", fontWeight: 600 }}
          >
            Strategies for when you're feeling {selectedMood.toLowerCase()}
          </Typography>

          <List>
            {currentStrategies.map((strategy, index) => (
              <Paper key={index} sx={{ mb: 1, overflow: "hidden" }}>
                <ListItem>
                  <ListItemIcon>{strategy.icon}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography variant="subtitle1">
                          {strategy.name}
                        </Typography>
                        <Chip
                          label={strategy.duration}
                          size="small"
                          icon={<Timer />}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    secondary={strategy.description}
                  />
                  <Box>
                    <IconButton
                      onClick={() => handleExpandStrategy(strategy.name)}
                      size="small"
                    >
                      {expandedStrategy === strategy.name ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </IconButton>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleStrategyUse(strategy)}
                      disabled={loading}
                      startIcon={<Favorite />}
                    >
                      Try This
                    </Button>
                  </Box>
                </ListItem>

                <Collapse in={expandedStrategy === strategy.name}>
                  <Box p={2} bgcolor="background.paper">
                    <Typography variant="body2" color="text.secondary">
                      <strong>How to do it:</strong> {strategy.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      <strong>Why it works:</strong> This activity helps
                      redirect your attention and provides a healthier way to
                      process your emotions.
                    </Typography>
                  </Box>
                </Collapse>
              </Paper>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Most Used Strategies */}
      {getMostUsedStrategies().length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Your Most Used Strategies
            </Typography>
            {getMostUsedStrategies().map((strategy, index) => (
              <Box key={index} display="flex" alignItems="center" mb={1}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {index + 1}.
                </Typography>
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {strategy.name}
                </Typography>
                <Chip
                  label={`${strategy.count} times`}
                  size="small"
                  color="primary"
                />
              </Box>
            ))}
            <Typography variant="caption" color="text.secondary" mt={1}>
              Keep using what works for you!
            </Typography>
          </CardContent>
        </Card>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default CopingStrategies;
