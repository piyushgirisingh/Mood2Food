import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  LinearProgress,
  Chip,
  Grid,
  useTheme,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Warning,
  Close,
  PlayArrow,
  Pause,
  Stop,
  Phone,
  Psychology,
  Timer,
  Favorite,
  CheckCircle,
  Spa,
  MusicNote,
  DirectionsWalk,
  Brush,
  Book,
} from "@mui/icons-material";

const CrisisIntervention = () => {
  const theme = useTheme();
  const [showCrisisMode, setShowCrisisMode] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [crisisLevel, setCrisisLevel] = useState("moderate");
  const [completedActivities, setCompletedActivities] = useState([]);
  const intervalRef = useRef(null);

  const crisisActivities = {
    severe: [
      {
        id: "breathing",
        name: "Emergency Breathing",
        duration: 60,
        description: "4-7-8 breathing technique to calm your nervous system",
        instruction: "Inhale for 4, hold for 7, exhale for 8. Repeat 5 times.",
        icon: <Spa />,
        color: "#4CAF50",
        type: "breathing",
      },
      {
        id: "grounding",
        name: "5-4-3-2-1 Grounding",
        duration: 120,
        description:
          "Sensory grounding to bring you back to the present moment",
        instruction:
          "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
        icon: <Psychology />,
        color: "#2196F3",
        type: "grounding",
      },
      {
        id: "ice-cube",
        name: "Ice Cube Technique",
        duration: 30,
        description: "Hold an ice cube to interrupt the emotional eating urge",
        instruction:
          "Hold an ice cube in your hand for 30 seconds. Focus on the sensation.",
        icon: <Timer />,
        color: "#00BCD4",
        type: "physical",
      },
    ],
    moderate: [
      {
        id: "walk",
        name: "Quick Walk",
        duration: 300,
        description: "5-minute walk to release endorphins and clear your mind",
        instruction:
          "Walk around your space or outside. Focus on your steps and breathing.",
        icon: <DirectionsWalk />,
        color: "#FF9800",
        type: "movement",
      },
      {
        id: "music",
        name: "Calming Music",
        duration: 180,
        description: "Listen to calming music to shift your emotional state",
        instruction:
          "Play your favorite calming song. Focus on the melody and rhythm.",
        icon: <MusicNote />,
        color: "#9C27B0",
        type: "audio",
      },
      {
        id: "drawing",
        name: "Quick Drawing",
        duration: 240,
        description: "Express your emotions through simple drawing",
        instruction:
          "Draw whatever comes to mind. Don't worry about skill - just express.",
        icon: <Brush />,
        color: "#FF5722",
        type: "creative",
      },
    ],
    mild: [
      {
        id: "reading",
        name: "Read Something Uplifting",
        duration: 300,
        description: "Read a positive quote or short story",
        instruction: "Read something that makes you smile or feel hopeful.",
        icon: <Book />,
        color: "#795548",
        type: "cognitive",
      },
      {
        id: "gratitude",
        name: "Gratitude Practice",
        duration: 120,
        description: "List 3 things you're grateful for right now",
        instruction:
          "Write down or think of 3 things you appreciate in this moment.",
        icon: <Favorite />,
        color: "#E91E63",
        type: "cognitive",
      },
    ],
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsActive(false);
            handleActivityComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused]);

  const handleCrisisLevelSelect = (level) => {
    setCrisisLevel(level);
    setShowCrisisMode(true);
  };

  const startActivity = (activity) => {
    setCurrentActivity(activity);
    setTimeRemaining(activity.duration);
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseActivity = () => {
    setIsPaused(true);
  };

  const resumeActivity = () => {
    setIsPaused(false);
  };

  const stopActivity = () => {
    setIsActive(false);
    setIsPaused(false);
    setCurrentActivity(null);
    setTimeRemaining(300);
    clearInterval(intervalRef.current);
  };

  const handleActivityComplete = () => {
    if (currentActivity) {
      setCompletedActivities((prev) => [...prev, currentActivity]);
    }
    setCurrentActivity(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgress = () => {
    if (!currentActivity) return 0;
    return (
      ((currentActivity.duration - timeRemaining) / currentActivity.duration) *
      100
    );
  };

  const getCrisisMessage = () => {
    const messages = {
      severe:
        "I understand you're in a difficult moment. Let's get through this together.",
      moderate:
        "You're feeling overwhelmed, but you have the strength to handle this.",
      mild: "You're experiencing some stress, and that's okay. Let's find a healthy way through.",
    };
    return messages[crisisLevel] || messages.moderate;
  };

  const getEmergencyContacts = () => [
    {
      name: "Crisis Helpline",
      number: "988",
      description: "24/7 Mental Health Support",
    },
    {
      name: "National Eating Disorders",
      number: "1-800-931-2237",
      description: "Specialized Support",
    },
    {
      name: "Text HOME to 741741",
      number: "741741",
      description: "Crisis Text Line",
    },
  ];

  return (
    <Box>
      {/* Crisis Level Selection */}
      {!showCrisisMode && (
        <Card
          sx={{
            mb: 3,
            background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
            color: "white",
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Warning sx={{ mr: 1, fontSize: 32 }} />
              <Typography variant="h5" fontWeight="bold">
                Need Immediate Help?
              </Typography>
            </Box>
            <Typography variant="body1" mb={3}>
              How intense is your urge to emotional eat right now?
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    bgcolor: "#4CAF50",
                    "&:hover": { bgcolor: "#45a049" },
                    mb: 1,
                  }}
                  onClick={() => handleCrisisLevelSelect("mild")}
                >
                  Mild Urge
                </Button>
                <Typography variant="caption">
                  Feeling a bit stressed but manageable
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    bgcolor: "#FF9800",
                    "&:hover": { bgcolor: "#f57c00" },
                    mb: 1,
                  }}
                  onClick={() => handleCrisisLevelSelect("moderate")}
                >
                  Moderate Urge
                </Button>
                <Typography variant="caption">
                  Strong urge but can still think clearly
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    bgcolor: "#f44336",
                    "&:hover": { bgcolor: "#d32f2f" },
                    mb: 1,
                  }}
                  onClick={() => handleCrisisLevelSelect("severe")}
                >
                  Severe Urge
                </Button>
                <Typography variant="caption">
                  Very intense urge, feeling overwhelmed
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Crisis Mode Interface */}
      {showCrisisMode && (
        <Fade in={showCrisisMode}>
          <Box>
            {/* Current Activity */}
            {currentActivity && (
              <Card
                sx={{
                  mb: 3,
                  background: `linear-gradient(135deg, ${currentActivity.color} 0%, ${currentActivity.color}dd 100%)`,
                  color: "white",
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    {currentActivity.icon}
                    <Typography variant="h5" sx={{ ml: 1 }}>
                      {currentActivity.name}
                    </Typography>
                  </Box>

                  <Typography variant="h2" textAlign="center" mb={2}>
                    {formatTime(timeRemaining)}
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={getProgress()}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      mb: 2,
                      bgcolor: "rgba(255,255,255,0.3)",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "white",
                      },
                    }}
                  />

                  <Typography variant="body1" mb={3}>
                    {currentActivity.instruction}
                  </Typography>

                  <Box display="flex" justifyContent="center" gap={2}>
                    {isPaused ? (
                      <Button
                        variant="contained"
                        startIcon={<PlayArrow />}
                        onClick={resumeActivity}
                        sx={{ bgcolor: "white", color: currentActivity.color }}
                      >
                        Resume
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        startIcon={<Pause />}
                        onClick={pauseActivity}
                        sx={{ borderColor: "white", color: "white" }}
                      >
                        Pause
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      startIcon={<Stop />}
                      onClick={stopActivity}
                      sx={{ borderColor: "white", color: "white" }}
                    >
                      Stop
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Activity Selection */}
            {!currentActivity && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" mb={2}>
                    {getCrisisMessage()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Choose an activity to help you through this moment:
                  </Typography>

                  <Grid container spacing={2}>
                    {(
                      crisisActivities[crisisLevel] || crisisActivities.moderate
                    )?.map((activity) => (
                      <Grid item xs={12} sm={6} md={4} key={activity.id}>
                        <Card
                          sx={{
                            cursor: "pointer",
                            transition: "transform 0.2s",
                            "&:hover": { transform: "translateY(-4px)" },
                          }}
                          onClick={() => startActivity(activity)}
                        >
                          <CardContent>
                            <Box display="flex" alignItems="center" mb={1}>
                              <Box sx={{ color: activity.color, mr: 1 }}>
                                {activity.icon}
                              </Box>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {activity.name}
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              mb={1}
                            >
                              {activity.description}
                            </Typography>
                            <Chip
                              label={`${Math.floor(
                                activity.duration / 60
                              )} min`}
                              size="small"
                              sx={{ bgcolor: activity.color, color: "white" }}
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Emergency Contacts */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" mb={2}>
                  <Phone sx={{ mr: 1, verticalAlign: "middle" }} />
                  Need More Support?
                </Typography>
                <Grid container spacing={2}>
                  {getEmergencyContacts().map((contact, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box
                        p={2}
                        border={1}
                        borderColor="divider"
                        borderRadius={1}
                      >
                        <Typography variant="subtitle2" fontWeight="bold">
                          {contact.name}
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {contact.number}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {contact.description}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Completed Activities */}
            {completedActivities.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" mb={2}>
                    <CheckCircle
                      sx={{
                        mr: 1,
                        verticalAlign: "middle",
                        color: "success.main",
                      }}
                    />
                    Great Job! You've Completed:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {completedActivities.map((activity, index) => (
                      <Chip
                        key={index}
                        label={activity.name}
                        color="success"
                        variant="outlined"
                        icon={<CheckCircle />}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            <Box textAlign="center" mt={3}>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowCrisisMode(false);
                  setCurrentActivity(null);
                  setIsActive(false);
                  setIsPaused(false);
                  setTimeRemaining(300);
                  setCompletedActivities([]);
                }}
              >
                Exit Crisis Mode
              </Button>
            </Box>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default CrisisIntervention;
