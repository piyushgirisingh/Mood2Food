import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import CopingTools from "./pages/CopingTools";
import Insights from "./pages/Insights";
import FoodLog from "./pages/FoodLog";
import Reports from "./pages/Reports";
import Onboarding from "./components/Onboarding";

import ProtectedRoute from "./components/ProtectedRoute";
import OnboardingCheck from "./components/OnboardingCheck";
import ScrollingLayout from "./components/ScrollingLayout";

import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <OnboardingCheck>
                  <ScrollingLayout>
                    <Dashboard />
                  </ScrollingLayout>
                </OnboardingCheck>
              }
            />
            <Route
              path="/coping-tools"
              element={
                <OnboardingCheck>
                  <ScrollingLayout>
                    <CopingTools />
                  </ScrollingLayout>
                </OnboardingCheck>
              }
            />
            <Route
              path="/insights"
              element={
                <OnboardingCheck>
                  <ScrollingLayout>
                    <Insights />
                  </ScrollingLayout>
                </OnboardingCheck>
              }
            />
            <Route
              path="/reports"
              element={
                <OnboardingCheck>
                  <ScrollingLayout>
                    <Reports />
                  </ScrollingLayout>
                </OnboardingCheck>
              }
            />
            <Route
              path="/food-log"
              element={
                <OnboardingCheck>
                  <ScrollingLayout>
                    <FoodLog />
                  </ScrollingLayout>
                </OnboardingCheck>
              }
            />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
