import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import CopingTools from "./pages/CopingTools";
import Insights from "./pages/Insights";
import TriggerLogs from "./pages/TriggerLogs";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollingLayout from "./components/ScrollingLayout";

import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
                <ProtectedRoute>
                  <ScrollingLayout>
                    <Dashboard />
                  </ScrollingLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/coping-tools"
              element={
                <ProtectedRoute>
                  <ScrollingLayout>
                    <CopingTools />
                  </ScrollingLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/insights"
              element={
                <ProtectedRoute>
                  <ScrollingLayout>
                    <Insights />
                  </ScrollingLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/trigger-logs"
              element={
                <ProtectedRoute>
                  <ScrollingLayout>
                    <TriggerLogs />
                  </ScrollingLayout>
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
