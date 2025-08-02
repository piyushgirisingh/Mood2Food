import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Rating,
  Avatar,
  Badge,
} from "@mui/material";
import {
  Add,
  Lightbulb,
  TrendingUp,
  Psychology,
  Restaurant,
  AccessTime,
  EmojiEmotions,
  Timeline,
  Insights as InsightsIcon,
  Star,
  TrendingDown,
  CheckCircle,
  Warning,
  Info,
  Delete,
  Edit,
  ExpandMore,
  Favorite,
  Bookmark,
  Share,
  CalendarToday,
  PsychologyAlt,
  SelfImprovement,
  Spa,
  Meditation,
  Nature,
  MusicNote,
  SportsEsports,
  LocalLibrary,
  Group,
  School,
} from "@mui/icons-material";
import { insightAPI } from "../services/api";

const Insights = () => {
  const theme = useTheme();
  const [insights, setInsights] = useState([]);
  const [newInsight, setNewInsight] = useState("");
  const [latestInsight, setLatestInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadInsights();
    loadLatestInsight();
  }, []);

  const loadInsights = async () => {
    try {
      const response = await insightAPI.getAllInsights();
      setInsights(response.data);
    } catch (err) {
      setError("Failed to load insights");
    }
  };

  const loadLatestInsight = async () => {
    try {
      const response = await insightAPI.getLatestInsight();
      setLatestInsight(response.data);
    } catch (err) {
      console.log("No latest insight found");
    }
  };

  const handleAddInsight = async () => {
    if (!newInsight.trim()) return;

    setLoading(true);
    try {
      await insightAPI.addInsight(newInsight);
      setNewInsight("");
      setSuccess("Insight added successfully!");
      loadInsights();
      loadLatestInsight();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to add insight");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddInsight();
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Personal Growth Resources
  const growthResources = [
    {
      title: "Mindful Eating Techniques",
      description: "Learn to eat with awareness and intention",
      icon: <Restaurant />,
      color: "#8B5CF6",
      tips: [
        "Take 3 deep breaths before eating",
        "Chew each bite 20-30 times",
        "Put down your fork between bites",
        "Notice the taste, texture, and smell",
      ],
    },
    {
      title: "Emotional Regulation",
      description: "Tools to manage emotions without food",
      icon: <Psychology />,
      color: "#3B82F6",
      tips: [
        "Practice the 5-4-3-2-1 grounding technique",
        "Use progressive muscle relaxation",
        "Try box breathing (4-4-4-4)",
        "Write down your emotions in a journal",
      ],
    },
    {
      title: "Stress Management",
      description: "Healthy ways to cope with stress",
      icon: <Spa />,
      color: "#10B981",
      tips: [
        "Take a 10-minute walk outside",
        "Practice yoga or stretching",
        "Listen to calming music",
        "Call a supportive friend",
      ],
    },
    {
      title: "Self-Care Activities",
      description: "Nurture yourself without food",
      icon: <SelfImprovement />,
      color: "#F59E0B",
      tips: [
        "Take a warm bath with essential oils",
        "Read a book you enjoy",
        "Practice meditation or mindfulness",
        "Do something creative (art, music, writing)",
      ],
    },
  ];

  // Weekly Reflection Prompts
  const reflectionPrompts = [
    "What was my biggest challenge with emotional eating this week?",
    "What coping strategy worked best for me?",
    "What am I most proud of this week?",
    "What would I like to improve next week?",
    "How did my emotions affect my eating patterns?",
    "What healthy alternatives did I discover?",
    "What support do I need to ask for?",
    "What small victory can I celebrate?",
  ];

  // Personal Growth Challenges
  const growthChallenges = [
    {
      title: "Mindful Eating Challenge",
      duration: "7 days",
      description: "Practice mindful eating for one week",
      tasks: [
        "Eat without distractions (no phone/TV)",
        "Take time to appreciate your food",
        "Stop eating when 80% full",
        "Notice hunger and fullness cues",
      ],
    },
    {
      title: "Emotion Journal Challenge",
      duration: "14 days",
      description: "Track your emotions and eating patterns",
      tasks: [
        "Write down your emotions before eating",
        "Identify triggers and patterns",
        "Note successful coping strategies",
        "Celebrate small wins",
      ],
    },
    {
      title: "Healthy Coping Challenge",
      duration: "21 days",
      description: "Replace emotional eating with healthy alternatives",
      tasks: [
        "Try a new coping strategy each day",
        "Practice deep breathing exercises",
        "Engage in physical activity",
        "Connect with supportive people",
      ],
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box mb={4}>
        <Box display="flex" alignItems="center" mb={2}>
          <InsightsIcon sx={{ mr: 2, fontSize: 32, color: theme.palette.primary.main }} />
          <Typography variant="h4" sx={{ color: theme.palette.text.primary, fontWeight: 700 }}>
            Personal Insights & Growth
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ color: theme.palette.text.secondary, fontWeight: 400 }}>
          Reflect, learn, and grow on your emotional eating journey.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {/* Tabs Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              color: theme.palette.text.secondary,
              fontWeight: 500,
              "&.Mui-selected": {
                color: theme.palette.primary.main,
                fontWeight: 600,
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          <Tab label="My Insights" />
          <Tab label="Growth Resources" />
          <Tab label="Weekly Reflection" />
          <Tab label="Challenges" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          {/* Add New Insight */}
          <Grid item xs={12}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Lightbulb sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography
                    variant="h6"
                    sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
                  >
                    Add New Insight
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                  Record your thoughts, realizations, and personal growth
                  moments about your emotional eating journey.
                </Typography>

                <Box display="flex" gap={2}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Share your insight, realization, or breakthrough..."
                    value={newInsight}
                    onChange={(e) => setNewInsight(e.target.value)}
                    onKeyPress={handleKeyPress}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: theme.palette.mode === 'dark' ? "#374151" : "#FFFFFF",
                        "& textarea": {
                          color: theme.palette.text.primary,
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: theme.palette.text.secondary,
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddInsight}
                    disabled={loading || !newInsight.trim()}
                    startIcon={<Add />}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                      color: "white",
                      fontWeight: 600,
                      px: 3,
                      "&:hover": {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                      },
                      "&:disabled": {
                        background: theme.palette.mode === 'dark' ? "#6B7280" : "#CBD5E1",
                        color: theme.palette.mode === 'dark' ? "#9CA3AF" : "#64748B",
                      },
                    }}
                  >
                    {loading ? "Adding..." : "Add Insight"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Latest Insight Highlight */}
          {latestInsight && (
            <Grid item xs={12}>
              <Card
                sx={{
                  mb: 3,
                  background:
                    "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                  color: "white",
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Star sx={{ mr: 1, color: "#FBBF24" }} />
                    <Typography
                      variant="h6"
                      sx={{ color: "white", fontWeight: 600 }}
                    >
                      Latest Insight
                    </Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{ color: "white", mb: 1, lineHeight: 1.6 }}
                  >
                    "{latestInsight.message}"
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    {new Date(latestInsight.timestamp).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* All Insights */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Timeline sx={{ mr: 1, color: "#8B5CF6" }} />
                  <Typography
                    variant="h6"
                    sx={{ color: "#F8FAFC", fontWeight: 600 }}
                  >
                    All Insights ({insights.length})
                  </Typography>
                </Box>

                {insights.length === 0 ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={4}
                  >
                    <Box textAlign="center">
                      <Lightbulb
                        sx={{ fontSize: 48, color: "#6B7280", mb: 2 }}
                      />
                      <Typography variant="h6" sx={{ color: "#6B7280", mb: 1 }}>
                        No insights yet
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                        Start by adding your first insight above!
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <List>
                    {insights.map((insight, index) => (
                      <React.Fragment key={insight.id || index}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon>
                            <Lightbulb sx={{ color: "#8B5CF6" }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={insight.message}
                            secondary={new Date(
                              insight.timestamp
                            ).toLocaleDateString()}
                            primaryTypographyProps={{
                              sx: {
                                color: "#F8FAFC",
                                lineHeight: 1.5,
                                mb: 1,
                              },
                            }}
                            secondaryTypographyProps={{
                              sx: {
                                color: "#9CA3AF",
                              },
                            }}
                          />
                        </ListItem>
                        {index < insights.length - 1 && (
                          <Divider sx={{ my: 1 }} />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Growth Resources Tab */}
      {selectedTab === 1 && (
        <Grid container spacing={3}>
          {growthResources.map((resource, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box
                      sx={{
                        backgroundColor: resource.color,
                        borderRadius: "50%",
                        p: 1,
                        mr: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {React.cloneElement(resource.icon, {
                        sx: { color: "white" },
                      })}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ color: "#F8FAFC", fontWeight: 600 }}
                    >
                      {resource.title}
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ color: "#CBD5E1", mb: 2 }}>
                    {resource.description}
                  </Typography>

                  <Accordion
                    sx={{ backgroundColor: "transparent", boxShadow: "none" }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore sx={{ color: "#8B5CF6" }} />}
                      sx={{
                        "& .MuiAccordionSummary-content": {
                          color: "#8B5CF6",
                          fontWeight: 500,
                        },
                      }}
                    >
                      <Typography>View Tips & Techniques</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {resource.tips.map((tip, tipIndex) => (
                          <ListItem key={tipIndex} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircle
                                sx={{ fontSize: 16, color: "#10B981" }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={tip}
                              primaryTypographyProps={{
                                sx: { color: "#CBD5E1", fontSize: "0.875rem" },
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Weekly Reflection Tab */}
      {selectedTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                  <PsychologyAlt sx={{ mr: 1, color: "#8B5CF6" }} />
                  <Typography
                    variant="h6"
                    sx={{ color: "#F8FAFC", fontWeight: 600 }}
                  >
                    Weekly Reflection Prompts
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: "#CBD5E1", mb: 3 }}>
                  Take time each week to reflect on your journey. Choose a
                  prompt and write your thoughts below.
                </Typography>

                <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                  {reflectionPrompts.map((prompt, index) => (
                    <Chip
                      key={index}
                      label={prompt}
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{
                        mb: 1,
                        "&:hover": {
                          backgroundColor: "rgba(139, 92, 246, 0.1)",
                        },
                      }}
                    />
                  ))}
                </Box>

                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  placeholder="Choose a prompt above and write your reflection here..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#374151",
                      "& textarea": {
                        color: "#F8FAFC",
                      },
                    },
                  }}
                />

                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="contained"
                    startIcon={<Bookmark />}
                    sx={{
                      background:
                        "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    Save Reflection
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <CalendarToday sx={{ mr: 1, color: "#8B5CF6" }} />
                  <Typography
                    variant="h6"
                    sx={{ color: "#F8FAFC", fontWeight: 600 }}
                  >
                    Reflection Calendar
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: "#CBD5E1", mb: 2 }}>
                  Track your weekly reflections and see your progress over time.
                </Typography>

                <Box textAlign="center" py={3}>
                  <Typography variant="h4" sx={{ color: "#8B5CF6", mb: 1 }}>
                    12
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#CBD5E1" }}>
                    Weeks of Reflection
                  </Typography>
                </Box>

                <Box textAlign="center">
                  <Typography variant="h4" sx={{ color: "#10B981", mb: 1 }}>
                    8
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#CBD5E1" }}>
                    Consecutive Weeks
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Challenges Tab */}
      {selectedTab === 3 && (
        <Grid container spacing={3}>
          {growthChallenges.map((challenge, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Badge
                      badgeContent={challenge.duration}
                      color="primary"
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: "#8B5CF6",
                        },
                      }}
                    >
                      <Avatar sx={{ backgroundColor: "#8B5CF6" }}>
                        <EmojiEmotions />
                      </Avatar>
                    </Badge>
                    <Box ml={2}>
                      <Typography
                        variant="h6"
                        sx={{ color: "#F8FAFC", fontWeight: 600 }}
                      >
                        {challenge.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#CBD5E1" }}>
                        {challenge.description}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ color: "#CBD5E1", mb: 2 }}>
                    Complete these tasks to build healthy habits:
                  </Typography>

                  <List dense>
                    {challenge.tasks.map((task, taskIndex) => (
                      <ListItem key={taskIndex} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle
                            sx={{ fontSize: 16, color: "#10B981" }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={task}
                          primaryTypographyProps={{
                            sx: { color: "#CBD5E1", fontSize: "0.875rem" },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      mt: 2,
                      borderColor: "#8B5CF6",
                      color: "#8B5CF6",
                      "&:hover": {
                        borderColor: "#7C3AED",
                        backgroundColor: "rgba(139, 92, 246, 0.1)",
                      },
                    }}
                  >
                    Start Challenge
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Insights;
