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
  Download,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { copingToolAPI, reportsAPI, onboardingAPI } from "../services/api";
import PersonalizedCopingTools from "../components/PersonalizedCopingTools";

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
  const [downloading, setDownloading] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(null);
  const intervalRef = useRef(null);

  // Get personalized tools
  const { tools: personalizedTools, loading: toolsLoading } = PersonalizedCopingTools();
  const copingTools = personalizedTools;

  // Generate categories dynamically from personalized tools
  const categories = [
    { value: "all", label: "All Tools" },
    ...Array.from(new Set(copingTools.map(tool => tool.category))).map(category => ({
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1) + " Activities"
    }))
  ];

  useEffect(() => {
    loadUsageHistory();
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const response = await onboardingAPI.getOnboardingStatus();
      setOnboardingCompleted(response.data.completed);
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    }
  };

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

  const handleDownloadCSV = async () => {
    setDownloading(true);
    try {
      const response = await reportsAPI.downloadCSV();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mood2food_report.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setSuccess('CSV report downloaded successfully!');
    } catch (error) {
      setError('Failed to download CSV report');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const response = await reportsAPI.downloadPDF();
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mood2food_report.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setSuccess('PDF report downloaded successfully!');
    } catch (error) {
      setError('Failed to download PDF report');
    } finally {
      setDownloading(false);
    }
  };

  if (toolsLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" gutterBottom>
          Your Personalized Coping Tools
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<History />}
            onClick={() => setHistoryDialogOpen(true)}
          >
            View History
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleDownloadCSV}
            disabled={downloading}
          >
            Download CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleDownloadPDF}
            disabled={downloading}
          >
            Download PDF
          </Button>
          {onboardingCompleted === false && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => window.location.href = '/onboarding'}
            >
              Complete Setup
            </Button>
          )}
        </Box>
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
