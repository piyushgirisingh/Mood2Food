import React, { useState, useEffect } from 'react';
import {
  Phone,
  MusicNote,
  SportsEsports,
  Book,
  Nature,
  Restaurant,
  Spa,
  Psychology,
  DirectionsWalk,
  LocalCafe,
  Brush,
  EmojiEvents,
} from '@mui/icons-material';
import { onboardingAPI } from '../services/api';

const PersonalizedCopingTools = () => {
  const [personalizedTools, setPersonalizedTools] = useState([]);
  const [supportContacts, setSupportContacts] = useState([]);
  const [calmingSongs, setCalmingSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPersonalizedData();
  }, []);

  const loadPersonalizedData = async () => {
    try {
      const [toolsRes, contactsRes, songsRes] = await Promise.all([
        onboardingAPI.getPersonalizedCopingTools(),
        onboardingAPI.getSupportContacts(),
        onboardingAPI.getCalmingSongs(),
      ]);

      const preferredMethods = toolsRes.data.preferredMethods || [];
      const contacts = contactsRes.data.contacts || [];
      const songs = songsRes.data.songs || [];

      setSupportContacts(contacts);
      setCalmingSongs(songs);

      // Generate personalized tools based on preferences
      const tools = generatePersonalizedTools(preferredMethods, contacts, songs);
      setPersonalizedTools(tools);
    } catch (error) {
      console.error('Error loading personalized data:', error);
      // Fallback to default tools if there's an error
      setPersonalizedTools(generateDefaultTools());
    } finally {
      setLoading(false);
    }
  };

  const generatePersonalizedTools = (preferredMethods, contacts, songs) => {
    const tools = [];

    // Always include breathing exercises as they're universally helpful
    tools.push({
      id: "deep-breathing",
      name: "Deep Breathing Exercise",
      category: "breathing",
      duration: 300,
      description: "Guided breathing to calm your nervous system",
      instruction: "Follow the breathing pattern: Inhale for 4 counts, hold for 4, exhale for 6. Repeat.",
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
    });

    // Add tools based on user preferences
    preferredMethods.forEach(method => {
      switch (method) {
        case 'talking':
          if (contacts.length > 0) {
            tools.push({
              id: "reach-out",
              name: "Reach Out to Someone",
              category: "social",
              duration: 0, // No timer needed
              description: "Connect with your support network",
              instruction: "Call or message someone from your support network",
              icon: <Phone />,
              color: "#2196F3",
              steps: [
                "Choose someone from your support contacts",
                "Call or message them",
                "Share how you're feeling",
                "Listen to their support",
                "Express gratitude for their time",
              ],
              benefits: [
                "Reduces loneliness",
                "Provides emotional support",
                "Offers perspective",
                "Strengthens relationships",
              ],
              customData: {
                type: 'support_contacts',
                contacts: contacts,
              },
            });
          }
          break;

        case 'music':
          if (songs.length > 0) {
            tools.push({
              id: "calming-music",
              name: "Listen to Calming Music",
              category: "music",
              duration: 600, // 10 minutes
              description: "Listen to your personalized calming songs",
              instruction: "Play your selected calming songs and focus on the music",
              icon: <MusicNote />,
              color: "#9C27B0",
              steps: [
                "Find a quiet space",
                "Put on headphones if possible",
                "Play your calming songs",
                "Close your eyes and focus on the music",
                "Let the music wash over you",
                "Breathe with the rhythm",
              ],
              benefits: [
                "Reduces anxiety",
                "Improves mood",
                "Provides distraction",
                "Creates relaxation",
              ],
              customData: {
                type: 'calming_songs',
                songs: songs,
              },
            });
          }
          break;

        case 'exercise':
          tools.push({
            id: "gentle-exercise",
            name: "Gentle Physical Activity",
            category: "physical",
            duration: 900, // 15 minutes
            description: "Light physical activity to release tension",
            instruction: "Engage in gentle movement to release stress",
              icon: <SportsEsports />,
              color: "#FF9800",
              steps: [
                "Start with gentle stretching",
                "Move your body slowly",
                "Focus on your breathing",
                "Listen to your body",
                "Don't push yourself too hard",
                "End with a cool-down",
              ],
              benefits: [
                "Releases endorphins",
                "Reduces muscle tension",
                "Improves mood",
                "Increases energy",
              ],
          });
          break;

        case 'reading':
          tools.push({
            id: "mindful-reading",
            name: "Mindful Reading",
            category: "mental",
            duration: 1200, // 20 minutes
            description: "Read something uplifting or distracting",
            instruction: "Choose a book or article that brings you joy",
              icon: <Book />,
              color: "#795548",
              steps: [
                "Choose a book you enjoy",
                "Find a comfortable spot",
                "Take a few deep breaths",
                "Read slowly and mindfully",
                "Let yourself get lost in the story",
                "Take breaks if needed",
              ],
              benefits: [
                "Provides mental escape",
                "Reduces stress",
                "Improves focus",
                "Expands perspective",
              ],
          });
          break;

        case 'nature':
          tools.push({
            id: "nature-connection",
            name: "Nature Connection",
            category: "outdoor",
            duration: 1800, // 30 minutes
            description: "Spend time in nature to ground yourself",
            instruction: "Go outside and connect with the natural world",
              icon: <Nature />,
              color: "#4CAF50",
              steps: [
                "Step outside your door",
                "Take a few deep breaths",
                "Notice the air on your skin",
                "Look at the sky and trees",
                "Listen to natural sounds",
                "Feel connected to the earth",
              ],
              benefits: [
                "Reduces stress hormones",
                "Improves mood",
                "Provides perspective",
                "Connects you to something larger",
              ],
          });
          break;

        case 'cooking':
          tools.push({
            id: "mindful-cooking",
            name: "Mindful Cooking",
            category: "creative",
            duration: 2400, // 40 minutes
            description: "Cook something simple and nourishing",
            instruction: "Prepare a meal with full attention to the process",
              icon: <Restaurant />,
              color: "#FF5722",
              steps: [
                "Choose a simple recipe",
                "Gather your ingredients",
                "Wash your hands mindfully",
                "Focus on each step of cooking",
                "Notice the smells and textures",
                "Enjoy the process, not just the result",
              ],
              benefits: [
                "Provides creative outlet",
                "Offers sense of accomplishment",
                "Creates something nourishing",
                "Focuses the mind",
              ],
          });
          break;
      }
    });

    // Add progressive muscle relaxation as a universal tool
    tools.push({
      id: "progressive-relaxation",
      name: "Progressive Muscle Relaxation",
      category: "relaxation",
      duration: 600, // 10 minutes
      description: "Systematically tense and relax muscle groups",
      instruction: "Tense each muscle group for 5 seconds, then relax completely for 10 seconds.",
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
    });

    return tools;
  };

  const generateDefaultTools = () => {
    return [
      {
        id: "deep-breathing",
        name: "Deep Breathing Exercise",
        category: "breathing",
        duration: 300,
        description: "Guided breathing to calm your nervous system",
        instruction: "Follow the breathing pattern: Inhale for 4 counts, hold for 4, exhale for 6. Repeat.",
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
        duration: 600,
        description: "Systematically tense and relax muscle groups",
        instruction: "Tense each muscle group for 5 seconds, then relax completely for 10 seconds.",
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
    ];
  };

  return {
    tools: personalizedTools,
    loading,
    supportContacts,
    calmingSongs,
  };
};

export default PersonalizedCopingTools; 