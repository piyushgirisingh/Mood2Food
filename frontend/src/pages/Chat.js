import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Avatar,
  Fade,
  CircularProgress,
  useTheme,
  Alert,
  Snackbar,
} from "@mui/material";
import { Send, SmartToy } from "@mui/icons-material";
import GlowingBorder from "../components/GlowingBorder";
import { chatAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const Chat = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [glowActive, setGlowActive] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  // Load chat history on component mount
  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  const loadChatHistory = async () => {
    try {
      const response = await chatAPI.getChatHistory();
      if (response.data && Array.isArray(response.data)) {
        const formattedMessages = response.data.map((msg) => {
          const [sender, ...messageParts] = msg.reply.split(": ");
          return {
            text: messageParts.join(": "),
            sender: sender.toLowerCase(),
            timestamp: msg.timestamp,
          };
        });
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error("Error loading chat history:", err);
      setError("Failed to load chat history. Please try again later.");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !user) return;

    const newMessage = {
      text: message,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setIsTyping(true);
    setGlowActive(true);

    try {
      const response = await chatAPI.sendMessage(message);
      if (response.data) {
        const botMessage = {
          text: response.data.reply,
          sender: "bot",
          timestamp: response.data.timestamp || new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
      // Remove the failed message
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsTyping(false);
      setTimeout(() => setGlowActive(false), 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <Box
        sx={{
          height: "calc(100vh - 100px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Please log in to use the chat feature.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "calc(100vh - 100px)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 3,
        position: "relative",
      }}
    >
      <GlowingBorder isActive={glowActive} />

      <Paper
        elevation={3}
        sx={{
          flex: 1,
          borderRadius: 4,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          position: "relative",
        }}
      >
        {/* Messages Container */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            bgcolor: "#f8fafc",
          }}
        >
          {messages.map((msg, index) => (
            <Fade in key={index}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                  gap: 1,
                  alignItems: "flex-start",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor:
                      msg.sender === "user"
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main,
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  {msg.sender === "user" ? "U" : <SmartToy />}
                </Avatar>
                <Box sx={{ maxWidth: "70%" }}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor:
                        msg.sender === "user"
                          ? theme.palette.primary.main
                          : "#ffffff",
                      color: msg.sender === "user" ? "#ffffff" : "text.primary",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        width: 0,
                        height: 0,
                        borderStyle: "solid",
                        ...(msg.sender === "user"
                          ? {
                              right: -8,
                              borderWidth: "8px 0 8px 8px",
                              borderColor: `transparent transparent transparent ${theme.palette.primary.main}`,
                            }
                          : {
                              left: -8,
                              borderWidth: "8px 8px 8px 0",
                              borderColor:
                                "transparent #ffffff transparent transparent",
                            }),
                      },
                    }}
                  >
                    <Typography variant="body1">{msg.text}</Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 0.5,
                      textAlign: msg.sender === "user" ? "right" : "left",
                      color: "text.secondary",
                    }}
                  >
                    {formatTime(msg.timestamp)}
                  </Typography>
                </Box>
              </Box>
            </Fade>
          ))}
          {isTyping && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                <SmartToy />
              </Avatar>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <CircularProgress size={20} />
                <Typography>Thinking...</Typography>
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Container */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "#ffffff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              bgcolor: "#f8fafc",
              borderRadius: 3,
              p: 1,
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  p: 1,
                  "& textarea": {
                    transition: "all 0.2s ease-in-out",
                    "&:focus": {
                      transform: "translateY(-1px)",
                    },
                  },
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!message.trim() || isTyping}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: "#ffffff",
                "&:hover": {
                  bgcolor: theme.palette.primary.dark,
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                },
                "&:disabled": {
                  bgcolor: theme.palette.action.disabledBackground,
                },
              }}
            >
              <Send />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setError("")} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Chat;
