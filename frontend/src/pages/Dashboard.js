import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Button,
} from "@mui/material";
import {
  Lightbulb,
  EmojiEvents,
  Restaurant,
  TrendingUp,
  CloudUpload,
  Analytics,
} from "@mui/icons-material";
import { dashboardAPI, mlAPI, onboardingAPI } from "../services/api";
import FoodLogForm from "../components/FoodLogForm";
import TodayFoodLogs from "../components/TodayFoodLogs";


import EnhancedInsights from "../components/EnhancedInsights";




const Dashboard = () => {
  const theme = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [funFact, setFunFact] = useState(null);
  const [refreshFoodLogs, setRefreshFoodLogs] = useState(0);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [onboardingCompleted, setOnboardingCompleted] = useState(null);
  const [showOnboardingPrompt, setShowOnboardingPrompt] = useState(false);


  // Fun facts about emotional eating
  const funFacts = useMemo(() => [
    {
      fact: "75% of overeating is caused by emotions, not hunger!",
      category: "Statistics",
      tip: "Next time you reach for food, ask yourself: 'Am I really hungry?'",
    },
    {
      fact: "Stress can make you crave sugary foods because cortisol increases blood sugar levels.",
      category: "Science",
      tip: "Try deep breathing instead of reaching for sweets when stressed.",
    },
    {
      fact: "The average person makes 200+ food decisions per day, most unconsciously!",
      category: "Psychology",
      tip: "Being mindful of your food choices can help break emotional eating patterns.",
    },
    {
      fact: "Comfort foods actually work! They trigger the release of serotonin, the 'feel-good' hormone.",
      category: "Biology",
      tip: "Find healthy alternatives that give you the same comfort without the guilt.",
    },
    {
      fact: "Boredom eating is more common than stress eating, affecting 60% of people.",
      category: "Behavior",
      tip: "Keep your hands busy with activities like drawing, knitting, or puzzles.",
    },
    {
      fact: "The 'hunger hormone' ghrelin increases when you're sleep-deprived, making you crave high-calorie foods.",
      category: "Health",
      tip: "Prioritize 7-9 hours of sleep to help regulate your appetite.",
    },
    {
      fact: "Emotional eating often happens in the evening - our willpower is lowest at night!",
      category: "Timing",
      tip: "Plan healthy evening activities to avoid mindless snacking.",
    },
    {
      fact: "People who journal about their emotions are 40% less likely to emotional eat.",
      category: "Research",
      tip: "Try writing down your feelings before reaching for food.",
    },
    {
      fact: "The average emotional eating episode lasts 15 minutes but the guilt can last for hours.",
      category: "Duration",
      tip: "Use the 15-minute rule: wait 15 minutes before giving in to cravings.",
    },
    {
      fact: "Exercise releases endorphins that can be more effective than comfort food for mood improvement.",
      category: "Alternative",
      tip: "Try a 10-minute walk instead of snacking when you're feeling down.",
    },
    {
      fact: "Women are 3x more likely to emotional eat than men, especially during hormonal changes.",
      category: "Gender",
      tip: "Track your cycle and plan healthy snacks for hormonal days.",
    },
    {
      fact: "The brain processes emotional pain and physical pain in the same regions!",
      category: "Neuroscience",
      tip: "Understanding this connection helps explain why we seek comfort food.",
    },
    {
      fact: "Mindful eating can reduce emotional eating by 40% in just 8 weeks.",
      category: "Mindfulness",
      tip: "Try eating without distractions - just focus on your food.",
    },
    {
      fact: "Social media can trigger emotional eating - seeing food posts increases cravings by 30%.",
      category: "Digital",
      tip: "Limit social media time, especially before meals.",
    },
    {
      fact: "The color blue suppresses appetite - that's why you rarely see blue food!",
      category: "Color Psychology",
      tip: "Try using blue plates or eating in a blue-lit room.",
    },
  ], []);

  useEffect(() => {
    loadDashboardData();
    setFunFactOfTheDay();
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const response = await onboardingAPI.getOnboardingStatus();
      setOnboardingCompleted(response.data.completed);
      setShowOnboardingPrompt(!response.data.completed);
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setCurrentFactIndex((prevIndex) => (prevIndex + 1) % funFacts.length);
          setFunFact(funFacts[(currentFactIndex + 1) % funFacts.length]);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentFactIndex, funFacts]);

  const setFunFactOfTheDay = async () => {
    try {
      const response = await mlAPI.getFactOfTheDay();
      if (response.success && response.fact) {
        setFunFact({
          fact: response.fact,
          category: "Daily Tip",
          tip: "This fact is personalized for your emotional eating journey."
        });
      } else {
        // Fallback to hardcoded facts
        const today = new Date();
        const dayOfYear = Math.floor(
          (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
        );
        const factIndex = dayOfYear % funFacts.length;
        setFunFact(funFacts[factIndex]);
        setCurrentFactIndex(factIndex);
      }
    } catch (error) {
      console.error("Error fetching fun fact:", error);
      // Fallback to hardcoded facts
      const today = new Date();
      const dayOfYear = Math.floor(
        (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
      );
      const factIndex = dayOfYear % funFacts.length;
      setFunFact(funFacts[factIndex]);
      setCurrentFactIndex(factIndex);
    }
  };



  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getDashboard();
      setDashboardData(response.data);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Refresh dashboard data when food logs are added
  useEffect(() => {
    if (refreshFoodLogs > 0) {
      loadDashboardData();
    }
  }, [refreshFoodLogs]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ py: 3, width: "100%" }}>
      {/* Onboarding Completion Prompt */}
      {showOnboardingPrompt && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small"
              onClick={() => window.location.href = '/onboarding'}
            >
              Complete Setup
            </Button>
          }
        >
          Complete your profile setup to get personalized coping tools and insights!
        </Alert>
      )}

      {/* Header Section */}
      <Box mb={3}>
        <Typography variant="h4" sx={{ color: theme.palette.text.primary, fontWeight: 700, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="h6" sx={{ color: theme.palette.text.secondary, fontWeight: 400 }}>
          Welcome back! Here's your progress overview.
        </Typography>
      </Box>

      {/* Top Row - Fun Facts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Fun Facts Card */}
        <Grid item xs={12}>
          {funFact && (
            <Card
              sx={{
                background: theme.palette.mode === 'dark' 
                  ? "linear-gradient(135deg, #1E293B 0%, #334155 100%)"
                  : "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
                color: theme.palette.text.primary,
                borderRadius: 3,
                boxShadow: theme.palette.mode === 'dark'
                  ? "0 8px 32px rgba(30, 41, 59, 0.3)"
                  : "0 8px 32px rgba(0, 0, 0, 0.1)",
                height: "fit-content",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <EmojiEvents sx={{ fontSize: 28, color: theme.palette.secondary.main, mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    Fun Facts
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  mb={2}
                  sx={{ lineHeight: 1.4 }}
                >
                  {funFact.fact}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Chip
                    label={funFact.category}
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(139, 92, 246, 0.1)",
                      color: theme.palette.mode === 'dark' 
                        ? "white"
                        : theme.palette.primary.main,
                      fontWeight: "bold",
                    }}
                  />
                  <Lightbulb sx={{ fontSize: 20, color: theme.palette.secondary.main }} />
                </Box>
                <Typography
                  variant="body1"
                  sx={{ 
                    opacity: 0.9, 
                    fontStyle: "italic", 
                    mb: 2,
                    color: theme.palette.text.secondary
                  }}
                >
                  💡 <strong>Pro Tip:</strong> {funFact.tip}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      width: "100%",
                      height: 4,
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(139, 92, 246, 0.2)",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${(timeRemaining / 5) * 100}%`,
                        height: "100%",
                        backgroundColor: theme.palette.secondary.main,
                        transition: "width 1s linear",
                        borderRadius: 2,
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Main Content - Two Column Layout */}
      <Grid container spacing={3}>
        {/* Left Column - Food Tracking */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: theme.palette.mode === 'dark' 
                ? "linear-gradient(135deg, #1E293B 0%, #334155 100%)"
                : "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
              color: theme.palette.text.primary,
              borderRadius: 3,
              boxShadow: theme.palette.mode === 'dark'
                ? "0 8px 32px rgba(30, 41, 59, 0.3)"
                : "0 8px 32px rgba(0, 0, 0, 0.1)",
              height: "100%",
              minHeight: "400px",
            }}
          >
            <CardContent sx={{ p: 4, height: "100%", display: "flex", flexDirection: "column" }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Restaurant sx={{ fontSize: 32, color: theme.palette.secondary.main, mr: 2 }} />
                <Typography variant="h5" fontWeight="bold">
                  Food & Mood Tracking
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ 
                opacity: 0.9, 
                mb: 4, 
                lineHeight: 1.6,
                color: theme.palette.text.secondary
              }}>
                Track what you eat, when you eat it, and how you feel. This helps you become more aware of your eating habits and emotional patterns.
              </Typography>
              <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FoodLogForm
                  onFoodLogAdded={() =>
                    setRefreshFoodLogs((prev) => prev + 1)
                  }
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Insights & Logs */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TodayFoodLogs refreshTrigger={refreshFoodLogs} />
            </Grid>
            <Grid item xs={12}>
              <EnhancedInsights />
            </Grid>
          </Grid>
        </Grid>
      </Grid>



      {/* Recent Activity - Only show if data exists */}
      {dashboardData?.recentActivity && (
        <Card
          sx={{
            borderRadius: 3,
            background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
            mt: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <TrendingUp sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography
                variant="h6"
                sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
              >
                Recent Activity
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              {dashboardData.recentActivity}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Dashboard;
