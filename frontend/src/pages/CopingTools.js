import React, { useState, useEffect, useRef } from "react";
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
  LinearProgress,
  IconButton,
  useTheme,
  Fade,
  Zoom,
  Avatar,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Psychology,
  Add,
  History,
  PlayArrow,
  Pause,
  Stop,
  Timer,
  CheckCircle,
  Favorite,
  Spa,
  DirectionsWalk,
  MusicNote,
  Brush,
  Book,
  Phone,
  SportsEsports,
  LocalCafe,
  Close,
  Star,
  TrendingUp,
  EmojiEvents,
} from "@mui/icons-material";
import { copingToolAPI } from "../services/api";

const CopingTools = () => {
  const theme = useTheme();
  const [selectedTool, setSelectedTool] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionNotes, setSessionNotes] = useState("");
  const [sessionRating, setSessionRating] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [usageHistory, setUsageHistory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const intervalRef = useRef(null);

  const copingTools = [
    // Breathing & Relaxation
    {
      id: "deep-breathing",
      name: "Deep Breathing Exercise",
      category: "breathing",
      duration: 300, // 5 minutes
      description: "Guided breathing to calm your nervous system",
      instruction:
        "Follow the breathing pattern: Inhale for 4 counts, hold for 4, exhale for 6. Repeat.",
      icon: <Spa />,
      color: "#4CAF50",
      steps: [
        "Find a comfortable position",
        "Close your eyes gently",
        "Inhale slowly through your nose for 4 counts",
        "Hold your breath for 4 counts",
        "Exhale slowly through your mouth for 6 counts",
        "Repeat this cycle for 5 minutes",
      ],
      benefits: [
        "Reduces stress hormones",
        "Lowers blood pressure",
        "Improves focus",
        "Calms the mind",
      ],
    },
    {
      id: "progressive-relaxation",
      name: "Progressive Muscle Relaxation",
      category: "relaxation",
      duration: 600, // 10 minutes
      description: "Systematically tense and relax muscle groups",
      instruction:
        "Tense each muscle group for 5 seconds, then relax completely for 10 seconds.",
      icon: <Psychology />,
      color: "#2196F3",
      steps: [
        "Start with your toes and feet",
        "Tense the muscles for 5 seconds",
        "Release and feel the relaxation",
        "Move up to your calves and thighs",
        "Continue with your stomach and chest",
        "Finish with your arms, shoulders, and face",
      ],
      benefits: [
        "Releases physical tension",
        "Reduces anxiety",
        "Improves sleep",
        "Increases body awareness",
      ],
    },

    // Physical Activities
    {
      id: "quick-walk",
      name: "Quick Walk",
      category: "physical",
      duration: 900, // 15 minutes
      description: "Gentle walking to release endorphins",
      instruction:
        "Walk at a comfortable pace, focusing on your steps and breathing.",
      icon: <DirectionsWalk />,
      color: "#FF9800",
      steps: [
        "Put on comfortable shoes",
        "Start with a slow, steady pace",
        "Focus on your breathing",
        "Notice your surroundings",
        "Feel the movement of your body",
        "Gradually increase pace if comfortable",
      ],
      benefits: [
        "Releases endorphins",
        "Clears the mind",
        "Improves mood",
        "Reduces stress",
      ],
    },
    {
      id: "gentle-stretching",
      name: "Gentle Stretching",
      category: "physical",
      duration: 480, // 8 minutes
      description: "Slow, mindful stretching movements",
      instruction:
        "Move slowly and mindfully through each stretch, holding for 20-30 seconds.",
      icon: <SportsEsports />,
      color: "#9C27B0",
      steps: [
        "Start with neck stretches",
        "Move to shoulder rolls",
        "Stretch your arms and wrists",
        "Gentle back stretches",
        "Hip and leg stretches",
        "Finish with deep breathing",
      ],
      benefits: [
        "Releases tension",
        "Improves flexibility",
        "Increases blood flow",
        "Calms the mind",
      ],
    },

    // Creative Activities
    {
      id: "mindful-drawing",
      name: "Mindful Drawing",
      category: "creative",
      duration: 600, // 10 minutes
      description: "Express emotions through simple drawing",
      instruction:
        "Draw whatever comes to mind without worrying about skill or outcome.",
      icon: <Brush />,
      color: "#FF5722",
      steps: [
        "Get paper and drawing materials",
        "Start with simple shapes",
        "Let your hand move freely",
        "Focus on the process, not the result",
        "Express your current emotions",
        "Notice how you feel as you draw",
      ],
      benefits: [
        "Expresses emotions",
        "Reduces stress",
        "Improves focus",
        "Provides creative outlet",
      ],
    },
    {
      id: "gratitude-journaling",
      name: "Gratitude Journaling",
      category: "creative",
      duration: 300, // 5 minutes
      description: "Write down things you're grateful for",
      instruction:
        "List 3-5 things you appreciate right now, no matter how small.",
      icon: <Book />,
      color: "#795548",
      steps: [
        "Find a quiet space",
        "Take a deep breath",
        "Think of something you appreciate",
        "Write it down in detail",
        "Add 2-4 more items",
        "Reflect on how you feel",
      ],
      benefits: [
        "Shifts perspective",
        "Improves mood",
        "Reduces stress",
        "Increases positivity",
      ],
    },

    // Sensory Activities
    {
      id: "mindful-tea",
      name: "Mindful Tea Ritual",
      category: "sensory",
      duration: 420, // 7 minutes
      description: "Sip tea slowly and mindfully",
      instruction:
        "Prepare and drink tea with full attention to the experience.",
      icon: <LocalCafe />,
      color: "#8BC34A",
      steps: [
        "Choose your favorite tea",
        "Boil water mindfully",
        "Steep the tea slowly",
        "Hold the cup and feel its warmth",
        "Take small, slow sips",
        "Notice the taste and aroma",
      ],
      benefits: [
        "Creates calm moment",
        "Engages senses",
        "Provides comfort",
        "Slows down mind",
      ],
    },
    {
      id: "music-therapy",
      name: "Calming Music Session",
      category: "sensory",
      duration: 600, // 10 minutes
      description: "Listen to calming music mindfully",
      instruction: "Choose calming music and listen with full attention.",
      icon: <MusicNote />,
      color: "#E91E63",
      steps: [
        "Choose calming music",
        "Find a comfortable position",
        "Close your eyes",
        "Focus on the melody",
        "Notice how it makes you feel",
        "Let the music wash over you",
      ],
      benefits: [
        "Reduces anxiety",
        "Improves mood",
        "Provides distraction",
        "Creates peace",
      ],
    },

    // Social Connection
    {
      id: "reach-out",
      name: "Reach Out to Someone",
      category: "social",
      duration: 300, // 5 minutes
      description: "Connect with a friend or family member",
      instruction: "Call or message someone you care about.",
      icon: <Phone />,
      color: "#00BCD4",
      steps: [
        "Think of someone you miss",
        "Send a simple message",
        "Ask how they're doing",
        "Share something positive",
        "Listen to their response",
        "Express appreciation",
      ],
      benefits: [
        "Reduces loneliness",
        "Increases oxytocin",
        "Provides support",
        "Improves mood",
      ],
    },
  ];

  const categories = [
    { value: "all", label: "All Tools" },
    { value: "breathing", label: "Breathing & Relaxation" },
    { value: "physical", label: "Physical Activities" },
    { value: "creative", label: "Creative Activities" },
    { value: "sensory", label: "Sensory Activities" },
    { value: "social", label: "Social Connection" },
  ];

  useEffect(() => {
    loadUsageHistory();
  }, []);

  useEffect(() => {
    if (isActive && !isPaused && activeSession) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsActive(false);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused, activeSession]);

  const loadUsageHistory = async () => {
    try {
      const response = await copingToolAPI.getUsageHistory();
      setUsageHistory(response.data || []);
    } catch (err) {
      setError("Failed to load usage history");
    }
  };

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    setDialogOpen(true);
  };

  const startSession = (tool) => {
    setActiveSession(tool);
    setTimeRemaining(tool.duration);
    setIsActive(true);
    setIsPaused(false);
    setSessionDialogOpen(true);
    setDialogOpen(false);
  };

  const pauseSession = () => {
    setIsPaused(true);
  };

  const resumeSession = () => {
    setIsPaused(false);
  };

  const stopSession = () => {
    setIsActive(false);
    setIsPaused(false);
    setActiveSession(null);
    setTimeRemaining(0);
    setSessionDialogOpen(false);
    clearInterval(intervalRef.current);
  };

  const handleSessionComplete = () => {
    setSessionDialogOpen(false);
    setSuccess(`Great job completing "${activeSession?.name}"!`);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleToolUse = async () => {
    setLoading(true);
    try {
      await copingToolAPI.logUsage(selectedTool.name);
      setDialogOpen(false);
      setSelectedTool(null);
      loadUsageHistory();
      setError("");
      setSuccess("Tool usage logged successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to log tool usage");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgress = () => {
    if (!activeSession) return 0;
    return (
      ((activeSession.duration - timeRemaining) / activeSession.duration) * 100
    );
  };

  const getFilteredTools = () => {
    if (selectedCategory === "all") return copingTools;
    return copingTools.filter((tool) => tool.category === selectedCategory);
  };

  const getMostUsedTools = () => {
    const toolCounts = {};
    usageHistory.forEach((usage) => {
      toolCounts[usage.toolName] = (toolCounts[usage.toolName] || 0) + 1;
    });

    return Object.entries(toolCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
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
        Interactive tools to help you manage stress and emotional eating urges.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {/* Category Filter */}
      <Box mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Filter by Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Most Used Tools */}
      {getMostUsedTools().length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              <Star sx={{ mr: 1, verticalAlign: "middle" }} />
              Your Most Used Tools
            </Typography>
            <Grid container spacing={2}>
              {getMostUsedTools().map((tool, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Box
                    display="flex"
                    alignItems="center"
                    p={2}
                    border={1}
                    borderColor="divider"
                    borderRadius={1}
                  >
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                      {tool.name}
                    </Typography>
                    <Chip
                      label={`${tool.count} times`}
                      size="small"
                      color="primary"
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tools Grid */}
      <Grid container spacing={3}>
        {getFilteredTools().map((tool) => (
          <Grid item xs={12} sm={6} md={4} key={tool.id}>
            <Card
              sx={{
                height: "100%",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
              onClick={() => handleToolSelect(tool)}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box sx={{ color: tool.color, mr: 1 }}>{tool.icon}</Box>
                  <Typography variant="h6" component="div">
                    {tool.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {tool.description}
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Chip
                    label={`${Math.floor(tool.duration / 60)} min`}
                    size="small"
                    icon={<Timer />}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<PlayArrow />}
                    sx={{ bgcolor: tool.color }}
                  >
                    Start Session
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tool Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Box sx={{ color: selectedTool?.color, mr: 1 }}>
              {selectedTool?.icon}
            </Box>
            <Typography variant="h6">{selectedTool?.name}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            {selectedTool?.description}
          </Typography>

          <Typography variant="h6" gutterBottom>
            How to do it:
          </Typography>
          <List>
            {selectedTool?.steps.map((step, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${index + 1}. ${step}`} />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Benefits:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {selectedTool?.benefits.map((benefit, index) => (
              <Chip
                key={index}
                label={benefit}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => startSession(selectedTool)}
            variant="contained"
            sx={{ bgcolor: selectedTool?.color }}
          >
            Start Guided Session
          </Button>
        </DialogActions>
      </Dialog>

      {/* Active Session Dialog */}
      <Dialog
        open={sessionDialogOpen}
        onClose={stopSession}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">{activeSession?.name}</Typography>
            <IconButton onClick={stopSession}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center" py={2}>
            <Typography
              variant="h2"
              fontWeight="bold"
              color={activeSession?.color}
            >
              {formatTime(timeRemaining)}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={getProgress()}
              sx={{
                height: 10,
                borderRadius: 5,
                my: 2,
                bgcolor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  bgcolor: activeSession?.color,
                },
              }}
            />

            <Typography variant="body1" mb={3}>
              {activeSession?.instruction}
            </Typography>

            <Box display="flex" justifyContent="center" gap={2}>
              {isPaused ? (
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={resumeSession}
                  sx={{ bgcolor: activeSession?.color }}
                >
                  Resume
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<Pause />}
                  onClick={pauseSession}
                >
                  Pause
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<Stop />}
                onClick={stopSession}
                color="error"
              >
                Stop
              </Button>
            </Box>
          </Box>
        </DialogContent>
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
                  <Chip label="Completed" color="success" size="small" />
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
