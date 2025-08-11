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
} from "@mui/material";
import {
  Add,
  Lightbulb,
  TrendingUp,
  Psychology,
  Restaurant,
  AccessTime,
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
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [reflectionText, setReflectionText] = useState("");
  const [savingReflection, setSavingReflection] = useState(false);

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

  const handlePromptSelect = (prompt) => {
    setSelectedPrompt(prompt);
    setReflectionText(""); // Clear previous reflection when selecting new prompt
  };

  const handleSaveReflection = async () => {
    if (!selectedPrompt || !reflectionText.trim()) {
      setError("Please select a prompt and write your reflection");
      return;
    }

    setSavingReflection(true);
    try {
      // Create a reflection insight
      const reflectionInsight = `Weekly Reflection - ${selectedPrompt}\n\n${reflectionText}`;
      await insightAPI.addInsight(reflectionInsight);
      setSelectedPrompt("");
      setReflectionText("");
      setSuccess("Reflection saved successfully!");
      loadInsights();
      loadLatestInsight();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to save reflection");
    } finally {
      setSavingReflection(false);
    }
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
                  <Timeline sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography
                    variant="h6"
                    sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
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
                            <Lightbulb sx={{ color: theme.palette.primary.main }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={insight.message}
                            secondary={new Date(
                              insight.timestamp
                            ).toLocaleDateString()}
                            primaryTypographyProps={{
                              sx: {
                                color: theme.palette.text.primary,
                                lineHeight: 1.5,
                                mb: 1,
                              },
                            }}
                            secondaryTypographyProps={{
                              sx: {
                                color: theme.palette.text.secondary,
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
                      sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
                    >
                      {resource.title}
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                    {resource.description}
                  </Typography>

                  <Accordion
                    sx={{ backgroundColor: "transparent", boxShadow: "none" }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore sx={{ color: theme.palette.primary.main }} />}
                      sx={{
                        "& .MuiAccordionSummary-content": {
                          color: theme.palette.primary.main,
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
                                sx={{ fontSize: 16, color: theme.palette.success.main }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={tip}
                              primaryTypographyProps={{
                                sx: { color: theme.palette.text.secondary, fontSize: "0.875rem" },
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
                  <PsychologyAlt sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography
                    variant="h6"
                    sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
                  >
                    Weekly Reflection Prompts
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3 }}>
                  Take time each week to reflect on your journey. Choose a
                  prompt and write your thoughts below.
                </Typography>

                <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
                  {reflectionPrompts.map((prompt, index) => (
                    <Chip
                      key={index}
                      label={prompt}
                      variant={selectedPrompt === prompt ? "filled" : "outlined"}
                      color="primary"
                      size="small"
                      onClick={() => handlePromptSelect(prompt)}
                      sx={{
                        mb: 1,
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "rgba(139, 92, 246, 0.1)",
                        },
                        ...(selectedPrompt === prompt && {
                          backgroundColor: theme.palette.primary.main,
                          color: "white",
                        }),
                      }}
                    />
                  ))}
                </Box>

                {selectedPrompt && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Selected Prompt:</strong> {selectedPrompt}
                    </Typography>
                  </Alert>
                )}

                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder={selectedPrompt ? "Write your reflection here..." : "Choose a prompt above and write your reflection here..."}
                  disabled={!selectedPrompt}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: theme.palette.mode === 'dark' ? '#374151' : '#f8fafc',
                      "& textarea": {
                        color: theme.palette.text.primary,
                      },
                    },
                  }}
                />

                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="contained"
                    startIcon={savingReflection ? <CircularProgress size={20} color="inherit" /> : <Bookmark />}
                    onClick={handleSaveReflection}
                    disabled={!selectedPrompt || !reflectionText.trim() || savingReflection}
                    sx={{
                      background:
                        "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                      color: "white",
                      fontWeight: 600,
                      "&:disabled": {
                        background: "rgba(139, 92, 246, 0.3)",
                        color: "rgba(255, 255, 255, 0.5)",
                      },
                    }}
                  >
                    {savingReflection ? "Saving..." : "Save Reflection"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>


        </Grid>
      )}


    </Container>
  );
};

export default Insights;
