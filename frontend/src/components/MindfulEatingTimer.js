import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  useTheme,
  Chip,
} from "@mui/material";
import {
  Timer,
  PlayArrow,
  Pause,
  Stop,
  Restaurant,
  Psychology,
  Close,
  CheckCircle,
} from "@mui/icons-material";

const MindfulEatingTimer = () => {
  const theme = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(300); // 5 minutes default
  const [showDialog, setShowDialog] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const intervalRef = useRef(null);

  const mindfulSteps = [
    {
      title: "Take a Moment",
      description:
        "Before you start eating, take 3 deep breaths. Notice how you're feeling.",
      duration: 30,
      instruction: "Breathe in... Breathe out...",
    },
    {
      title: "Look at Your Food",
      description:
        "Take time to really see your food. Notice colors, textures, and shapes.",
      duration: 20,
      instruction: "Observe the colors and textures...",
    },
    {
      title: "Smell Your Food",
      description:
        "Bring your food close and take in the aroma. What do you notice?",
      duration: 15,
      instruction: "Take in the aroma...",
    },
    {
      title: "Take Your First Bite",
      description:
        "Take a small bite and let it rest in your mouth. Don't chew yet.",
      duration: 10,
      instruction: "Let the food rest in your mouth...",
    },
    {
      title: "Chew Slowly",
      description:
        "Chew slowly and mindfully. Notice the taste, texture, and sensations.",
      duration: 30,
      instruction: "Chew slowly and mindfully...",
    },
    {
      title: "Continue Mindfully",
      description: "Continue eating with awareness. Pause between bites.",
      duration: 175, // Remaining time
      instruction: "Continue eating mindfully...",
    },
  ];

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current);
            setIsActive(false);
            setSessionComplete(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused]);

  useEffect(() => {
    if (isActive) {
      const totalSteps = mindfulSteps.length;
      const timePerStep = 300 / totalSteps; // 5 minutes total
      const currentStepIndex = Math.floor((300 - time) / timePerStep);
      setCurrentStep(Math.min(currentStepIndex, totalSteps - 1));
    }
  }, [time, isActive]);

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
    setTime(300);
    setSessionComplete(false);
    setCurrentStep(0);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const stopTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime(300);
    setSessionComplete(false);
    setCurrentStep(0);
    clearInterval(intervalRef.current);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgress = () => {
    return ((300 - time) / 300) * 100;
  };

  const handleSessionComplete = () => {
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setSessionComplete(false);
  };

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Restaurant sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6">Mindful Eating Timer</Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={2}>
            Practice mindful eating with guided steps and a timer
          </Typography>

          {/* Timer Display */}
          <Box textAlign="center" mb={3}>
            <Typography variant="h2" fontWeight="bold" color="primary">
              {formatTime(time)}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={getProgress()}
              sx={{ height: 8, borderRadius: 4, mt: 2 }}
            />
          </Box>

          {/* Current Step */}
          {isActive && (
            <Box mb={3}>
              <Chip
                label={`Step ${currentStep + 1}: ${
                  mindfulSteps[currentStep]?.title
                }`}
                color="primary"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {mindfulSteps[currentStep]?.instruction}
              </Typography>
            </Box>
          )}

          {/* Controls */}
          <Box display="flex" justifyContent="center" gap={2}>
            {!isActive ? (
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={startTimer}
                size="large"
              >
                Start Mindful Eating
              </Button>
            ) : (
              <>
                {isPaused ? (
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={resumeTimer}
                  >
                    Resume
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<Pause />}
                    onClick={pauseTimer}
                  >
                    Pause
                  </Button>
                )}
                <Button
                  variant="outlined"
                  startIcon={<Stop />}
                  onClick={stopTimer}
                  color="error"
                >
                  Stop
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Mindful Eating Tips */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            <Psychology sx={{ mr: 1, verticalAlign: "middle" }} />
            Mindful Eating Tips
          </Typography>

          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              • Eat without distractions (no phone, TV, or computer)
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              • Take small bites and chew slowly
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              • Notice the taste, texture, and temperature
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              • Pause between bites
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Stop when you're satisfied, not full
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Session Complete Dialog */}
      <Dialog open={showDialog} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              Mindful Eating Session Complete!
            </Typography>
            <IconButton onClick={closeDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box textAlign="center" py={2}>
            <CheckCircle sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
            <Typography variant="h6" mb={2}>
              Great job completing your mindful eating session!
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              You've taken an important step toward developing a healthier
              relationship with food.
            </Typography>
            <Alert severity="success" sx={{ mt: 2 }}>
              Remember: Mindful eating is a practice. The more you do it, the
              easier it becomes!
            </Alert>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDialog} variant="contained">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MindfulEatingTimer;
