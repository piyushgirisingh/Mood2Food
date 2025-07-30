import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Lightbulb,
  EmojiEvents,
  Restaurant,
} from '@mui/icons-material';
import { dashboardAPI } from '../services/api';
import FoodLogForm from '../components/FoodLogForm';
import TodayFoodLogs from '../components/TodayFoodLogs';
import FoodInsights from '../components/FoodInsights';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [funFact, setFunFact] = useState(null);
  const [refreshFoodLogs, setRefreshFoodLogs] = useState(0);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(5);

  // Fun facts about emotional eating
  const funFacts = [
    {
      fact: "75% of overeating is caused by emotions, not hunger!",
      category: "Statistics",
      tip: "Next time you reach for food, ask yourself: 'Am I really hungry?'"
    },
    {
      fact: "Stress can make you crave sugary foods because cortisol increases blood sugar levels.",
      category: "Science",
      tip: "Try deep breathing instead of reaching for sweets when stressed."
    },
    {
      fact: "The average person makes 200+ food decisions per day, most unconsciously!",
      category: "Psychology",
      tip: "Being mindful of your food choices can help break emotional eating patterns."
    },
    {
      fact: "Comfort foods actually work! They trigger the release of serotonin, the 'feel-good' hormone.",
      category: "Biology",
      tip: "Find healthy alternatives that give you the same comfort without the guilt."
    },
    {
      fact: "Boredom eating is more common than stress eating, affecting 60% of people.",
      category: "Behavior",
      tip: "Keep your hands busy with activities like drawing, knitting, or puzzles."
    },
    {
      fact: "The 'hunger hormone' ghrelin increases when you're sleep-deprived, making you crave high-calorie foods.",
      category: "Health",
      tip: "Prioritize 7-9 hours of sleep to help regulate your appetite."
    },
    {
      fact: "Emotional eating often happens in the evening - our willpower is lowest at night!",
      category: "Timing",
      tip: "Plan healthy evening activities to avoid mindless snacking."
    },
    {
      fact: "People who journal about their emotions are 40% less likely to emotional eat.",
      category: "Research",
      tip: "Try writing down your feelings before reaching for food."
    },
    {
      fact: "The average emotional eating episode lasts 15 minutes but the guilt can last for hours.",
      category: "Duration",
      tip: "Use the 15-minute rule: wait 15 minutes before giving in to cravings."
    },
    {
      fact: "Exercise releases endorphins that can be more effective than comfort food for mood improvement.",
      category: "Alternative",
      tip: "Try a 10-minute walk instead of snacking when you're feeling down."
    },
    {
      fact: "Women are 3x more likely to emotional eat than men, especially during hormonal changes.",
      category: "Gender",
      tip: "Track your cycle and plan healthy snacks for hormonal days."
    },
    {
      fact: "The brain processes emotional pain and physical pain in the same regions!",
      category: "Neuroscience",
      tip: "Understanding this connection helps explain why we seek comfort food."
    },
    {
      fact: "Mindful eating can reduce emotional eating by 40% in just 8 weeks.",
      category: "Mindfulness",
      tip: "Try eating without distractions - just focus on your food."
    },
    {
      fact: "Social media can trigger emotional eating - seeing food posts increases cravings by 30%.",
      category: "Digital",
      tip: "Limit social media time, especially before meals."
    },
    {
      fact: "The 'hungry-angry' feeling (hangry) is real - low blood sugar affects mood regulation.",
      category: "Physiology",
      tip: "Keep healthy snacks handy to prevent getting hangry."
    },
    {
      fact: "Emotional eaters often prefer sweet and salty foods - evolution's comfort combo.",
      category: "Evolution",
      tip: "Recognize this preference and find healthier sweet-salty alternatives."
    },
    {
      fact: "People who eat with others are 30% less likely to emotional eat.",
      category: "Social",
      tip: "Try to share meals with friends or family when possible."
    },
    {
      fact: "The average emotional eating trigger is loneliness, not stress!",
      category: "Triggers",
      tip: "Build meaningful connections to reduce loneliness-driven eating."
    },
    {
      fact: "Drinking water before meals can reduce emotional eating by 25%.",
      category: "Hydration",
      tip: "Stay hydrated - sometimes thirst is mistaken for hunger."
    },
    {
      fact: "People who practice gratitude are 50% less likely to emotional eat.",
      category: "Gratitude",
      tip: "Start a daily gratitude practice to improve emotional well-being."
    },
    {
      fact: "The 'second brain' in your gut produces 90% of your serotonin!",
      category: "Gut-Brain",
      tip: "Eat gut-healthy foods like yogurt, fiber, and fermented foods."
    },
    {
      fact: "Emotional eating peaks between 3-5 PM - the 'afternoon slump' is real!",
      category: "Timing",
      tip: "Plan a healthy afternoon snack to avoid the slump."
    },
    {
      fact: "People who sleep 7-9 hours are 60% less likely to emotional eat.",
      category: "Sleep",
      tip: "Prioritize sleep - it's your body's natural appetite regulator."
    },
    {
      fact: "The average person gains 5-10 pounds during winter due to emotional eating.",
      category: "Seasonal",
      tip: "Stay active and maintain routines even in cold weather."
    },
    {
      fact: "Mindful breathing can reduce emotional eating cravings by 70% in 5 minutes.",
      category: "Breathing",
      tip: "Try 5 deep breaths before reaching for comfort food."
    },
    {
      fact: "People who cook at home are 40% less likely to emotional eat.",
      category: "Cooking",
      tip: "Learn to cook - it's therapeutic and healthier than takeout."
    },
    {
      fact: "The 'comfort food effect' is strongest when you're tired or stressed.",
      category: "Fatigue",
      tip: "Recognize when you're tired and choose rest over food."
    },
    {
      fact: "Emotional eaters often eat faster - slowing down can reduce intake by 30%.",
      category: "Pacing",
      tip: "Put your fork down between bites and savor each mouthful."
    },
    {
      fact: "People who track their emotions are 3x more likely to overcome emotional eating.",
      category: "Tracking",
      tip: "Keep a mood and food journal to identify patterns."
    },
    {
      fact: "The average emotional eating episode adds 300-500 extra calories.",
      category: "Calories",
      tip: "Be aware of portion sizes during emotional eating moments."
    },
    {
      fact: "Music can reduce emotional eating - calming tunes decrease stress eating by 25%.",
      category: "Music",
      tip: "Create a calming playlist for stressful moments."
    },
    {
      fact: "People who practice self-compassion are 50% less likely to emotional eat.",
      category: "Self-Care",
      tip: "Be kind to yourself - guilt only makes emotional eating worse."
    },
    {
      fact: "The 'freshman 15' is real - 60% of college students gain weight due to emotional eating.",
      category: "Life Changes",
      tip: "Major life changes require extra self-care and routine."
    },
    {
      fact: "Emotional eaters often eat in secret - breaking this habit is key to recovery.",
      category: "Secrecy",
      tip: "Eat in public spaces and share meals with others."
    },
    {
      fact: "The average person has 3-5 emotional eating triggers - knowing yours is power.",
      category: "Awareness",
      tip: "Identify your specific triggers and create action plans."
    },
    {
      fact: "People who exercise regularly are 70% less likely to emotional eat.",
      category: "Exercise",
      tip: "Find physical activities you enjoy - they're natural mood boosters."
    },
    {
      fact: "The 'weekend effect' - people eat 20% more on weekends due to emotional eating.",
      category: "Weekends",
      tip: "Maintain healthy routines even on weekends."
    },
    {
      fact: "Emotional eaters often skip breakfast - this increases evening emotional eating by 40%.",
      category: "Breakfast",
      tip: "Start your day with a healthy breakfast to stabilize blood sugar."
    },
    {
      fact: "The 'holiday season' can trigger emotional eating in 80% of people.",
      category: "Holidays",
      tip: "Plan ahead for holiday stress and maintain healthy boundaries."
    },
    {
      fact: "People who practice meditation are 60% less likely to emotional eat.",
      category: "Meditation",
      tip: "Start with just 5 minutes of daily meditation."
    },
    {
      fact: "The average emotional eating episode is triggered by a negative thought.",
      category: "Thoughts",
      tip: "Challenge negative thoughts before they trigger emotional eating."
    },
    {
      fact: "Emotional eaters often eat while distracted - this leads to 30% more consumption.",
      category: "Distraction",
      tip: "Eat without TV, phone, or other distractions."
    },
    {
      fact: "People who get enough vitamin D are 40% less likely to emotional eat.",
      category: "Nutrition",
      tip: "Get some sunlight daily or consider vitamin D supplements."
    },
    {
      fact: "The 'comfort food memory' - we crave foods from happy childhood moments.",
      category: "Memory",
      tip: "Create new happy memories with healthy foods."
    },
    {
      fact: "Emotional eaters often eat when not hungry - learning hunger cues is crucial.",
      category: "Hunger",
      tip: "Learn to distinguish between true hunger and emotional hunger."
    },
    {
      fact: "People who practice yoga are 50% less likely to emotional eat.",
      category: "Yoga",
      tip: "Try gentle yoga poses for stress relief instead of eating."
    },
    {
      fact: "The average emotional eating episode is followed by guilt and shame.",
      category: "Emotions",
      tip: "Practice self-forgiveness - everyone has emotional eating moments."
    },
    {
      fact: "Emotional eaters often eat in response to others' emotions, not their own.",
      category: "Empathy",
      tip: "Learn to separate your emotions from others' emotions."
    },
    {
      fact: "People who have strong social support are 70% less likely to emotional eat.",
      category: "Support",
      tip: "Build a support network of friends and family."
    },
    {
      fact: "The 'comfort food industry' is worth $50 billion annually.",
      category: "Industry",
      tip: "Be aware of marketing that targets emotional eaters."
    },
    {
      fact: "Emotional eaters often eat to avoid dealing with difficult emotions.",
      category: "Avoidance",
      tip: "Learn to sit with uncomfortable emotions instead of eating them."
    },
    {
      fact: "People who practice progressive muscle relaxation reduce emotional eating by 35%.",
      category: "Relaxation",
      tip: "Learn relaxation techniques for stress management."
    },
    {
      fact: "The average emotional eating episode is triggered by boredom or loneliness.",
      category: "Boredom",
      tip: "Find engaging activities and hobbies to fill empty time."
    },
    {
      fact: "Emotional eaters often eat to reward themselves for small achievements.",
      category: "Rewards",
      tip: "Find non-food rewards for your accomplishments."
    },
    {
      fact: "People who practice deep breathing reduce emotional eating by 45%.",
      category: "Breathing",
      tip: "Take 10 deep breaths when you feel the urge to emotional eat."
    },
    {
      fact: "The 'comfort food effect' is strongest when you're feeling vulnerable.",
      category: "Vulnerability",
      tip: "Recognize vulnerable moments and practice self-care."
    },
    {
      fact: "Emotional eaters often eat to fill an emotional void.",
      category: "Void",
      tip: "Identify what's missing in your life and address it directly."
    },
    {
      fact: "People who practice self-massage reduce emotional eating by 30%.",
      category: "Touch",
      tip: "Try gentle self-massage or ask for hugs from loved ones."
    },
    {
      fact: "The average emotional eating episode is triggered by a sense of loss.",
      category: "Loss",
      tip: "Allow yourself to grieve losses instead of eating through them."
    },
    {
      fact: "Emotional eaters often eat to celebrate, not just to cope.",
      category: "Celebration",
      tip: "Find non-food ways to celebrate your successes."
    },
    {
      fact: "People who practice visualization techniques reduce emotional eating by 40%.",
      category: "Visualization",
      tip: "Visualize yourself making healthy choices in difficult moments."
    },
    {
      fact: "The 'comfort food effect' is strongest when you're feeling overwhelmed.",
      category: "Overwhelm",
      tip: "Break overwhelming tasks into smaller, manageable steps."
    },
    {
      fact: "Emotional eaters often eat to avoid conflict or difficult conversations.",
      category: "Conflict",
      tip: "Learn healthy communication skills to address conflicts directly."
    },
    {
      fact: "People who practice positive self-talk reduce emotional eating by 50%.",
      category: "Self-Talk",
      tip: "Replace negative thoughts with positive, encouraging ones."
    },
    {
      fact: "The average emotional eating episode is triggered by a sense of failure.",
      category: "Failure",
      tip: "Reframe failures as learning opportunities, not reasons to eat."
    },
    {
      fact: "Emotional eaters often eat to feel in control when life feels chaotic.",
      category: "Control",
      tip: "Find other ways to feel in control, like organizing or planning."
    },
    {
      fact: "People who practice acceptance reduce emotional eating by 35%.",
      category: "Acceptance",
      tip: "Accept your emotions without trying to change them with food."
    },
    {
      fact: "The 'comfort food effect' is strongest when you're feeling rejected.",
      category: "Rejection",
      tip: "Build self-worth that doesn't depend on others' approval."
    },
    {
      fact: "Emotional eaters often eat to avoid feeling empty or purposeless.",
      category: "Purpose",
      tip: "Find activities and goals that give your life meaning."
    },
    {
      fact: "People who practice gratitude journaling reduce emotional eating by 45%.",
      category: "Gratitude",
      tip: "Write down 3 things you're grateful for each day."
    },
    {
      fact: "The average emotional eating episode is triggered by a sense of inadequacy.",
      category: "Inadequacy",
      tip: "Focus on your strengths and accomplishments, not your perceived flaws."
    },
    {
      fact: "Emotional eaters often eat to feel connected when they feel isolated.",
      category: "Connection",
      tip: "Reach out to friends, family, or support groups when feeling isolated."
    },
    {
      fact: "People who practice mindfulness meditation reduce emotional eating by 60%.",
      category: "Mindfulness",
      tip: "Practice being present in the moment without judgment."
    },
    {
      fact: "The 'comfort food effect' is strongest when you're feeling powerless.",
      category: "Power",
      tip: "Focus on what you can control and let go of what you can't."
    },
    {
      fact: "Emotional eaters often eat to avoid feeling vulnerable or exposed.",
      category: "Vulnerability",
      tip: "Embrace vulnerability as a strength, not a weakness."
    },
    {
      fact: "People who practice self-compassion reduce emotional eating by 55%.",
      category: "Compassion",
      tip: "Treat yourself with the same kindness you'd offer a friend."
    },
    {
      fact: "The average emotional eating episode is triggered by a sense of injustice.",
      category: "Justice",
      tip: "Channel feelings of injustice into positive action, not eating."
    },
    {
      fact: "Emotional eaters often eat to feel safe when they feel threatened.",
      category: "Safety",
      tip: "Identify what makes you feel safe and create that environment."
    },
    {
      fact: "People who practice emotional regulation reduce emotional eating by 70%.",
      category: "Regulation",
      tip: "Learn healthy ways to manage and express your emotions."
    },
    {
      fact: "The 'comfort food effect' is strongest when you're feeling misunderstood.",
      category: "Understanding",
      tip: "Practice self-expression and seek understanding from others."
    },
    {
      fact: "Emotional eaters often eat to avoid feeling overwhelmed by emotions.",
      category: "Overwhelm",
      tip: "Learn to process emotions one at a time instead of avoiding them."
    },
    {
      fact: "People who practice self-acceptance reduce emotional eating by 65%.",
      category: "Acceptance",
      tip: "Accept yourself exactly as you are, including your struggles."
    },
    {
      fact: "The average emotional eating episode is triggered by a sense of abandonment.",
      category: "Abandonment",
      tip: "Build secure attachments and learn to self-soothe healthily."
    },
    {
      fact: "Emotional eaters often eat to feel worthy when they feel unworthy.",
      category: "Worth",
      tip: "Recognize your inherent worth that doesn't depend on external factors."
    },
    {
      fact: "People who practice emotional intelligence reduce emotional eating by 75%.",
      category: "Intelligence",
      tip: "Develop your ability to understand and manage your emotions."
    },
    {
      fact: "The 'comfort food effect' is strongest when you're feeling hopeless.",
      category: "Hope",
      tip: "Focus on small steps forward and celebrate progress, not perfection."
    },
    {
      fact: "Emotional eaters often eat to avoid feeling responsible for their emotions.",
      category: "Responsibility",
      tip: "Take responsibility for your emotional well-being and choices."
    },
    {
      fact: "People who practice self-love reduce emotional eating by 80%.",
      category: "Love",
      tip: "Develop a loving relationship with yourself and your body."
    },
    {
      fact: "The average emotional eating episode is triggered by a sense of betrayal.",
      category: "Betrayal",
      tip: "Process feelings of betrayal through healthy communication and time."
    },
    {
      fact: "Emotional eaters often eat to feel powerful when they feel powerless.",
      category: "Power",
      tip: "Find healthy ways to feel powerful and in control of your life."
    },
    {
      fact: "People who practice emotional healing reduce emotional eating by 85%.",
      category: "Healing",
      tip: "Address underlying emotional wounds that drive emotional eating."
    },
    {
      fact: "The 'comfort food effect' is strongest when you're feeling disconnected.",
      category: "Connection",
      tip: "Build meaningful connections with yourself, others, and the world."
    },
    {
      fact: "Emotional eaters often eat to avoid feeling their authentic emotions.",
      category: "Authenticity",
      tip: "Allow yourself to feel and express your true emotions."
    },
    {
      fact: "People who practice emotional freedom reduce emotional eating by 90%.",
      category: "Freedom",
      tip: "Break free from emotional eating patterns and live authentically."
    }
  ];

  useEffect(() => {
    loadDashboardData();
    setFunFactOfTheDay();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-cycle through fun facts every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % funFacts.length;
        setFunFact(funFacts[nextIndex]);
        setTimeRemaining(5); // Reset timer
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [funFacts.length]);

  // Countdown timer for progress bar
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          return 5; // Reset when it reaches 0
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  const setFunFactOfTheDay = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const factIndex = dayOfYear % funFacts.length;
    setFunFact(funFacts[factIndex]);
  };

  const loadDashboardData = async () => {
    try {
      const response = await dashboardAPI.getDashboard();
      setDashboardData(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
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
    <Box>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Welcome back! Here's your progress overview.
      </Typography>



      {/* Interactive Fun Facts */}
      {funFact && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                }
              }}
            >
              <CardContent>
                                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <EmojiEvents sx={{ fontSize: 28, color: '#ffd700' }} />
                    <Typography variant="h6" fontWeight="bold">
                      Fun Facts
                    </Typography>
                  </Box>
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  mb={2} 
                  sx={{ 
                    lineHeight: 1.4,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                >
                  {funFact.fact}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Chip
                    label={funFact.category}
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                  <Lightbulb sx={{ fontSize: 20, color: '#ffd700' }} />
                </Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    opacity: 0.9, 
                    fontStyle: 'italic',
                    transition: 'opacity 0.3s ease-in-out',
                    mb: 2
                  }}
                >
                  💡 <strong>Pro Tip:</strong> {funFact.tip}
                </Typography>
                
                {/* Progress bar showing time until next fact */}
                <Box sx={{ mt: 2 }}>
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: 3, 
                      backgroundColor: 'rgba(255,255,255,0.2)', 
                      borderRadius: 1.5,
                      overflow: 'hidden'
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: `${(timeRemaining / 5) * 100}%`, 
                        height: '100%', 
                        backgroundColor: '#ffd700',
                        transition: 'width 1s linear',
                        borderRadius: 1.5
                      }} 
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {dashboardData?.recentActivity && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dashboardData.recentActivity}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Food Logging Section */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12}>
          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Restaurant sx={{ fontSize: 28, color: '#fff' }} />
                <Typography variant="h5" fontWeight="bold">
                  Food & Mood Tracking
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
                Track what you eat, when you eat it, and how you feel. This helps you become more aware of your eating habits and emotional patterns.
              </Typography>
              
              <Box display="flex" justifyContent="center">
                <FoodLogForm onFoodLogAdded={() => setRefreshFoodLogs(prev => prev + 1)} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Today's Food Logs */}
      <TodayFoodLogs refreshTrigger={refreshFoodLogs} />

      {/* Food Insights */}
      <FoodInsights />

    </Box>
  );
};

export default Dashboard; 