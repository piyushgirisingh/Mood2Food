import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  LinearProgress,
  useTheme,
} from "@mui/material";
import {
  Mood,
  Psychology,
  Add,
  Close,
  TrendingUp,
  AccessTime,
} from "@mui/icons-material";
import { triggerLogAPI } from "../services/api";

const moodOptions = [
  { label: "Happy", emoji: "😊", color: "#4CAF50" },
  { label: "Sad", emoji: "😢", color: "#2196F3" },
  { label: "Stressed", emoji: "😰", color: "#FF9800" },
  { label: "Anxious", emoji: "😨", color: "#F44336" },
  { label: "Bored", emoji: "😐", color: "#9E9E9E" },
  { label: "Angry", emoji: "😠", color: "#D32F2F" },
  { label: "Lonely", emoji: "😔", color: "#7B1FA2" },
  { label: "Excited", emoji: "🤩", color: "#FF5722" },
];

const triggerOptions = [
  "Work stress",
  "Relationship issues",
  "Financial worries",
  "Health concerns",
  "Social media",
  "Boredom",
  "Celebration",
  "Loneliness",
  "Tiredness",
  "Hunger",
  "Emotional pain",
  "Success",
  "Failure",
  "Change",
  "Routine disruption",
];

const MoodTriggerTracker = () => {
  const theme = useTheme();
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [customTrigger, setCustomTrigger] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    loadRecentLogs();
  }, []);

  const loadRecentLogs = async () => {
    try {
      const response = await triggerLogAPI.getTriggerLogs();
      if (response.data) {
        setRecentLogs(response.data.slice(0, 5)); // Show last 5 logs
      }
    } catch (err) {
      console.error("Error loading recent logs:", err);
    }
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleTriggerToggle = (trigger) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger)
        ? prev.filter((t) => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleAddCustomTrigger = () => {
    if (
      customTrigger.trim() &&
      !selectedTriggers.includes(customTrigger.trim())
    ) {
      setSelectedTriggers((prev) => [...prev, customTrigger.trim()]);
      setCustomTrigger("");
    }
  };

  const handleSubmit = async () => {
    if (!selectedMood) {
      setError("Please select a mood");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const logData = {
        mood: selectedMood.label,
        triggers: selectedTriggers,
        intensity: intensity,
        notes: notes,
        timestamp: new Date().toISOString(),
      };

      await triggerLogAPI.saveTriggerLog(logData);
      setSuccess("Mood and triggers logged successfully!");
      setOpenDialog(false);
      resetForm();
      loadRecentLogs();

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to log mood and triggers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedMood(null);
    setSelectedTriggers([]);
    setCustomTrigger("");
    setIntensity(5);
    setNotes("");
  };

  const getMoodInsight = () => {
    if (!selectedMood) return "";

    const insights = {
      Happy: "Great mood! Consider what contributed to this positive state.",
      Sad: "It's okay to feel sad. Remember, food won't solve emotional pain.",
      Stressed:
        "Stress can trigger emotional eating. Try deep breathing first.",
      Anxious:
        "Anxiety often leads to comfort eating. Consider a walk instead.",
      Bored: "Boredom eating is very common. Find an engaging activity.",
      Angry: "Anger can drive impulsive eating. Take time to cool down.",
      Lonely: "Loneliness often triggers comfort eating. Reach out to someone.",
      Excited: "Excitement can lead to celebratory eating. Enjoy mindfully!",
    };

    return insights[selectedMood.label] || "";
  };

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Psychology sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6">Mood & Trigger Tracker</Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={2}>
            Track your emotional state and identify what triggers emotional
            eating
          </Typography>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            fullWidth
          >
            Log Current Mood & Triggers
          </Button>
        </CardContent>
      </Card>

      {/* Recent Logs */}
      {recentLogs.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Recent Entries
            </Typography>
            {recentLogs.map((log, index) => (
              <Box
                key={index}
                mb={2}
                p={2}
                bgcolor="background.paper"
                borderRadius={1}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="subtitle2" sx={{ mr: 1 }}>
                    {new Date(log.timestamp).toLocaleDateString()}
                  </Typography>
                  <Chip
                    label={log.mood}
                    size="small"
                    sx={{
                      bgcolor:
                        moodOptions.find((m) => m.label === log.mood)?.color ||
                        "grey.300",
                      color: "white",
                    }}
                  />
                </Box>
                {log.triggers && log.triggers.length > 0 && (
                  <Box mb={1}>
                    <Typography variant="caption" color="text.secondary">
                      Triggers: {log.triggers.join(", ")}
                    </Typography>
                  </Box>
                )}
                {log.notes && (
                  <Typography variant="body2" color="text.secondary">
                    {log.notes}
                  </Typography>
                )}
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Log Your Mood & Triggers</Typography>
            <IconButton onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Mood Selection */}
          <Typography variant="subtitle1" mb={2}>
            How are you feeling right now?
          </Typography>
          <Grid container spacing={1} mb={3}>
            {moodOptions.map((mood) => (
              <Grid item key={mood.label}>
                <Chip
                  icon={<Mood />}
                  label={`${mood.emoji} ${mood.label}`}
                  onClick={() => handleMoodSelect(mood)}
                  sx={{
                    bgcolor:
                      selectedMood?.label === mood.label
                        ? mood.color
                        : "transparent",
                    color:
                      selectedMood?.label === mood.label ? "white" : "inherit",
                    border: `1px solid ${mood.color}`,
                    "&:hover": { bgcolor: mood.color, color: "white" },
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {selectedMood && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {getMoodInsight()}
            </Alert>
          )}

          {/* Intensity */}
          <Typography variant="subtitle1" mb={1}>
            How intense is this feeling? (1-10)
          </Typography>
          <Box display="flex" alignItems="center" mb={3}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              1
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(intensity / 10) * 100}
              sx={{ flexGrow: 1, mr: 2 }}
            />
            <Typography variant="body2">{intensity}</Typography>
          </Box>
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            style={{ width: "100%", marginBottom: "16px" }}
          />

          {/* Triggers */}
          <Typography variant="subtitle1" mb={2}>
            What triggered this feeling?
          </Typography>
          <Grid container spacing={1} mb={2}>
            {triggerOptions.map((trigger) => (
              <Grid item key={trigger}>
                <Chip
                  label={trigger}
                  onClick={() => handleTriggerToggle(trigger)}
                  sx={{
                    bgcolor: selectedTriggers.includes(trigger)
                      ? "primary.main"
                      : "transparent",
                    color: selectedTriggers.includes(trigger)
                      ? "white"
                      : "inherit",
                    border: "1px solid",
                    borderColor: "primary.main",
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {/* Custom Trigger */}
          <Box display="flex" mb={3}>
            <TextField
              size="small"
              placeholder="Add custom trigger..."
              value={customTrigger}
              onChange={(e) => setCustomTrigger(e.target.value)}
              sx={{ flexGrow: 1, mr: 1 }}
            />
            <Button
              variant="outlined"
              onClick={handleAddCustomTrigger}
              disabled={!customTrigger.trim()}
            >
              Add
            </Button>
          </Box>

          {/* Notes */}
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Additional notes (optional)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!selectedMood || loading}
          >
            {loading ? "Saving..." : "Save Entry"}
          </Button>
        </DialogActions>
      </Dialog>

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Box>
  );
};

export default MoodTriggerTracker;
