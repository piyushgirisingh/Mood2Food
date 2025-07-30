import React, { useState } from "react";
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
} from "@mui/material";
import {
  Chat as ChatIcon,
  AccountCircle,
  Notifications,
  NightsStay,
  WbSunny,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Chat from "../pages/Chat";

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
  const [darkMode, setDarkMode] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const sections = [
    { path: "/", title: "Dashboard" },
    { path: "/coping-tools", title: "Coping Tools" },
    { path: "/insights", title: "Insights" },
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
    setDarkMode(!darkMode);
  };

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
                color="inherit"
                onClick={() => navigate(section.path)}
                sx={{
                  position: "relative",
                  fontWeight: location.pathname === section.path ? 600 : 400,
                  backgroundColor:
                    location.pathname === section.path
                      ? "rgba(139, 92, 246, 0.15)"
                      : "transparent",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  border:
                    location.pathname === section.path
                      ? "1px solid rgba(139, 92, 246, 0.3)"
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
                        ? "rgba(139, 92, 246, 0.25)"
                        : "rgba(255, 255, 255, 0.1)",
                    borderColor:
                      location.pathname === section.path
                        ? "rgba(139, 92, 246, 0.5)"
                        : "rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover::after": {
                    width: "80%",
                  },
                }}
              >
                {section.title}
              </Button>
            ))}
          </Stack>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Toggle theme" arrow>
              <IconButton onClick={toggleDarkMode} color="inherit">
                {darkMode ? <WbSunny /> : <NightsStay />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications" arrow>
              <IconButton color="inherit" onClick={handleNotificationOpen}>
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

      <Box
        component="main"
        sx={{
          pt: 10,
          px: 3,
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
          width: "400px",
          height: "100vh",
          bgcolor: "background.paper",
          transform: showChat ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.1)",
          zIndex: theme.zIndex.drawer + 1,
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
