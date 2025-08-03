import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { onboardingAPI } from "../services/api";
import { CircularProgress, Box } from "@mui/material";

const OnboardingCheck = ({ children }) => {
  const { user, loading } = useAuth();
  const [onboardingCompleted, setOnboardingCompleted] = useState(null);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user) {
        try {
          const response = await onboardingAPI.getOnboardingStatus();
          setOnboardingCompleted(response.data.completed);
        } catch (error) {
          console.error("Error checking onboarding status:", error);
          setOnboardingCompleted(false);
        } finally {
          setCheckingOnboarding(false);
        }
      } else {
        setCheckingOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  if (loading || checkingOnboarding) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If onboarding is not completed, show a choice instead of forcing redirect
  if (onboardingCompleted === false) {
    // For now, let users proceed to dashboard even without onboarding
    // They can complete onboarding later if they want
    console.log("Onboarding not completed, but allowing access to dashboard");
  }

  // If onboarding is completed, show the protected content
  return children;
};

export default OnboardingCheck; 