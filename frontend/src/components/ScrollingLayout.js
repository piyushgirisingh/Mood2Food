import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Fab,
  useTheme,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  Button,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  Chat as ChatIcon,
  AccountCircle,
  Notifications,
  NightsStay,
  WbSunny,
  Dashboard,
  Psychology,
  Insights,
  Restaurant,
  TrendingUp,
  EmojiEvents,
  Lightbulb,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useThemeMode } from "../contexts/ThemeContext";
import Chat from "../pages/Chat";
import { dashboardAPI, mlAPI } from "../services/api";

const ScrollingLayout = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setMousePosition({ x, y });
  };
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRefreshMessage, setShowRefreshMessage] = useState(false);
  const [dailyTip, setDailyTip] = useState({
    tip: "Try the 5-minute rule: wait 5 minutes before giving in to emotional eating urges.",
    category: "Mindful Eating"
  });

  const sections = [
    { path: "/", title: "Dashboard" },
    { path: "/coping-tools", title: "Coping Tools" },
    { path: "/insights", title: "Insights" },
  ];

  const sidebarItems = [
    { icon: <Dashboard />, text: "Quick Stats", action: () => navigate("/dashboard") },
    { icon: <Restaurant />, text: "Log Food", action: () => navigate("/food-log") },
    { icon: <Psychology />, text: "Coping Tools", action: () => navigate("/coping-tools") },
    { icon: <Insights />, text: "View Insights", action: () => navigate("/insights") },
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const toggleDarkMode = () => {
    toggleMode();
  };

  // Fetch daily tip
  const fetchDailyTip = async () => {
    try {
      const response = await mlAPI.getFactOfTheDay();
      if (response.success && response.fact) {
        setDailyTip({
          tip: response.fact.tip || response.fact.fact,
          category: response.fact.category || "Daily Tip"
        });
      }
    } catch (error) {
      console.error("Error fetching daily tip:", error);
      // Keep the default tip if API fails
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      console.log('ScrollingLayout: Fetching dashboard data...');
      setLoading(true);
      const response = await dashboardAPI.getDashboard();
      console.log('ScrollingLayout: Dashboard data received:', response.data);
      setDashboardData(response.data);
      
      // Show success message briefly
      setShowRefreshMessage(true);
      setTimeout(() => setShowRefreshMessage(false), 2000);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchDailyTip();
  }, []);

  // Listen for food log updates
  useEffect(() => {
    const handleFoodLogUpdate = () => {
      console.log('ScrollingLayout: Received foodLogUpdated event, refreshing dashboard data...');
      fetchDashboardData();
    };

    const handleStorageChange = (e) => {
      if (e.key === 'foodLogUpdated') {
        console.log('ScrollingLayout: Detected localStorage change, refreshing dashboard data...');
        fetchDashboardData();
      }
    };

    const handleDashboardRefresh = (e) => {
      console.log('ScrollingLayout: Received dashboardRefresh event, refreshing dashboard data...');
      fetchDashboardData();
    };

    window.addEventListener('foodLogUpdated', handleFoodLogUpdate);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dashboardRefresh', handleDashboardRefresh);
    
    return () => {
      window.removeEventListener('foodLogUpdated', handleFoodLogUpdate);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dashboardRefresh', handleDashboardRefresh);
    };
  }, []);

  return (
    <Box
      onMouseMove={handleMouseMove}
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        position: "relative",
        "&::before": {
          content: '""',
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(
            circle at ${mousePosition.x}% ${mousePosition.y}%, 
            ${theme.palette.primary.main}15 0%,
            ${theme.palette.secondary.main}15 50%,
            transparent 70%
          )`,
          pointerEvents: "none",
          transition: "background 0.3s ease-out",
          zIndex: 0,
        },
        "&::after": {
          content: '""',
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: "2px solid transparent",
          borderImage: `linear-gradient(
            to right,
            transparent,
            ${theme.palette.primary.main}50 ${Math.max(
            0,
            mousePosition.x - 20
          )}%,
            ${theme.palette.secondary.main}50 ${Math.min(
            100,
            mousePosition.x + 20
          )}%,
            transparent
          ) 1`,
          pointerEvents: "none",
          zIndex: theme.zIndex.appBar - 1,
        },
      }}
    >
      <AppBar position="fixed" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 600,
              background: `linear-gradient(
                45deg,
                ${theme.palette.primary.main},
                ${theme.palette.secondary.main}
              )`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mr: 4,
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                top: -4,
                left: -4,
                right: -4,
                bottom: -4,
                background: `linear-gradient(
                  45deg,
                  ${theme.palette.primary.main}50,
                  ${theme.palette.secondary.main}50
                )`,
                filter: "blur(8px)",
                opacity: 0.5,
                zIndex: -1,
                transition: "all 0.3s ease-in-out",
              },
              "&:hover::after": {
                opacity: 0.8,
                filter: "blur(12px)",
              },
            }}
          >
            Mood2Food
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              flexGrow: 1,
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "center",
            }}
          >
            {sections.map((section) => (
              <Button
                key={section.path}
                sx={{
                  position: "relative",
                  fontWeight: location.pathname === section.path ? 600 : 400,
                  color: theme.palette.text.primary,
                  backgroundColor:
                    location.pathname === section.path
                      ? `${theme.palette.primary.main}20`
                      : "transparent",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  border:
                    location.pathname === section.path
                      ? `1px solid ${theme.palette.primary.main}40`
                      : "1px solid transparent",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    width: location.pathname === section.path ? "100%" : "0%",
                    height: "2px",
                    bgcolor: "primary.main",
                    transform: "translateX(-50%)",
                    transition: "all 0.3s ease-in-out",
                  },
                  "&:hover": {
                    backgroundColor:
                      location.pathname === section.path
                        ? `${theme.palette.primary.main}30`
                        : `${theme.palette.text.primary}10`,
                    borderColor:
                      location.pathname === section.path
                        ? `${theme.palette.primary.main}60`
                        : `${theme.palette.text.primary}20`,
                  },
                  "&:hover::after": {
                    width: "80%",
                  },
                }}
                onClick={() => navigate(section.path)}
              >
                {section.title}
              </Button>
            ))}
          </Stack>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Tooltip title="Toggle theme" arrow>
                <IconButton onClick={toggleDarkMode} sx={{ color: theme.palette.text.primary }}>
                  {mode === 'dark' ? <WbSunny /> : <NightsStay />}
                </IconButton>
              </Tooltip>
            <Tooltip title="Notifications" arrow>
              <IconButton sx={{ color: theme.palette.text.primary }} onClick={handleNotificationOpen}>
                <Badge badgeContent={3} color="secondary">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Account" arrow>
              <IconButton onClick={handleMenuOpen} color="inherit">
                <Avatar
                  sx={{
                    cursor: "pointer",
                    bgcolor: theme.palette.primary.main,
                  }}
                >
                  <AccountCircle />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
        <MenuItem onClick={() => navigate("/settings")}>Settings</MenuItem>
        <Divider />
        <MenuItem onClick={logout} sx={{ color: theme.palette.error.main }}>
          Logout
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationClose}
        onClick={handleNotificationClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>New message from support</MenuItem>
        <MenuItem>New insights available</MenuItem>
        <MenuItem>System update completed</MenuItem>
      </Menu>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 280,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
            borderRight: "none",
            bgcolor: "background.paper",
            boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box sx={{ mt: 8, p: 2 }}>
          {/* Quick Actions */}
          <Card sx={{ mb: 3, bgcolor: "background.default" }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <Lightbulb color="primary" />
                Quick Actions
              </Typography>
              <List dense>
                {sidebarItems.map((item, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={item.action}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      "&:hover": {
                        bgcolor: "primary.light",
                        color: "primary.main",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Today's Progress */}
          <Card sx={{ mb: 3, bgcolor: "background.default" }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TrendingUp color="primary" />
                  Today's Progress
                </Box>
                <IconButton 
                  size="small" 
                  onClick={() => {
                    console.log('ScrollingLayout: Manual refresh clicked');
                    setLoading(true);
                    fetchDashboardData();
                    // Force a second refresh after a short delay
                    setTimeout(() => {
                      console.log('ScrollingLayout: Forcing second refresh...');
                      fetchDashboardData();
                    }, 1000);
                  }}
                  disabled={loading}
                  sx={{ 
                    color: "primary.main",
                    "&:hover": { backgroundColor: "primary.main", color: "white" },
                    "&:disabled": { color: "text.disabled" },
                    border: "1px solid",
                    borderColor: "primary.main"
                  }}
                >
                  <RefreshIcon sx={{ 
                    animation: loading ? "spin 1s linear infinite" : "none",
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" }
                    }
                  }} />
                </IconButton>
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Food Entries
                </Typography>
                <Typography variant="h4" color="primary">
                  {loading ? "..." : (dashboardData?.foodLogsCount || 0)}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Coping Strategies Used
                </Typography>
                <Typography variant="h4" color="secondary">
                  {loading ? "..." : (dashboardData?.copingToolsUsed || 0)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Current Streak
                </Typography>
                <Typography variant="h4" sx={{ color: "success.main" }}>
                  {loading ? "..." : `${dashboardData?.currentStreak || 0} days`}
                </Typography>
              </Box>
              
              {showRefreshMessage && (
                <Box sx={{ mt: 2, p: 1, bgcolor: "success.light", borderRadius: 1 }}>
                  <Typography variant="caption" color="success.contrastText">
                    ✓ Data refreshed successfully!
                  </Typography>
                </Box>
              )}
              

            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card sx={{ bgcolor: "background.default" }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EmojiEvents color="primary" />
                  Daily Tip
                </Typography>
                <IconButton
                  size="small"
                  onClick={fetchDailyTip}
                  sx={{ color: theme.palette.primary.main }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {dailyTip.tip}
              </Typography>
              <Chip
                label={dailyTip.category}
                size="small"
                color="primary"
                variant="outlined"
              />
            </CardContent>
          </Card>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          pt: 10,
          pl: 35, // Account for sidebar width (280px + padding)
          pr: 3,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            borderRadius: 4,
            bgcolor: "background.paper",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
          }}
        >
          {children}
        </Container>
      </Box>

      {/* Chat Overlay */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          width: {
            xs: "100vw", // Full width on mobile
            sm: "80vw",  // 80% width on small screens
            md: "600px", // Fixed 600px on medium and larger screens
          },
          height: "100vh",
          bgcolor: "background.paper",
          transform: showChat ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.1)",
          zIndex: theme.zIndex.drawer + 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {showChat && <Chat onClose={() => setShowChat(false)} />}
      </Box>

      {/* Chat Button */}
      <Fab
        color={showChat ? "secondary" : "primary"}
        aria-label="chat"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: theme.zIndex.drawer + 2,
        }}
        onClick={() => setShowChat(!showChat)}
      >
        <ChatIcon />
      </Fab>
    </Box>
  );
};

export default ScrollingLayout;
