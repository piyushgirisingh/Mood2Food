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
  Rating,
  Tooltip,
  Chip,
} from "@mui/material";
import { Send, SmartToy, ThumbUp, ThumbDown, Close } from "@mui/icons-material";
import GlowingBorder from "../components/GlowingBorder";
import { chatAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const Chat = ({ onClose }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [glowActive, setGlowActive] = useState(false);
  const [error, setError] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState({});
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
            id: msg.id,
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
      id: `user-${Date.now()}`,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setIsTyping(true);
    setGlowActive(true);

    try {
      // Add context about emotional eating support
      const enhancedMessage = `[Emotional Eating Support Context] ${message}`;
      const response = await chatAPI.sendMessage(enhancedMessage);
      if (response.data) {
        const botMessage = {
          text: response.data.reply,
          sender: "bot",
          timestamp: response.data.timestamp || new Date().toISOString(),
          id: `bot-${Date.now()}`,
          emotion: response.data.emotion,
          confidence: response.data.confidence,
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

  const handleFeedback = async (messageId, rating, feedbackText = "") => {
    try {
      const message = messages.find(msg => msg.id === messageId);
      if (!message || message.sender !== "bot") return;

      // Find the user message that preceded this bot response
      const messageIndex = messages.findIndex(msg => msg.id === messageId);
      const userMessage = messageIndex > 0 ? messages[messageIndex - 1] : null;

      if (userMessage && userMessage.sender === "user") {
        await chatAPI.sendFeedback({
          user_id: user.id,
          message: userMessage.text,
          response: message.text,
          emotion: message.emotion || "neutral",
          rating: rating,
          feedback_text: feedbackText,
        });

        setFeedbackSubmitted(prev => ({ ...prev, [messageId]: rating }));
        
        // Show success message
        setError(""); // Clear any existing errors
        setTimeout(() => {
          // You could show a success snackbar here if needed
        }, 100);
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Failed to submit feedback. Please try again.");
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
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        position: "relative",
        bgcolor: "background.paper",
        borderRadius: 0,
        width: "100%", // Make chat take full width
        maxWidth: "100%", // Ensure it doesn't overflow
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
          width: "100%", // Full width
        }}
      >
        {/* Chat Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SmartToy sx={{ color: "primary.main", fontSize: 24 }} />
            <Typography variant="h6" fontWeight={600}>
              AI Chat Assistant
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "error.main",
                bgcolor: "error.light",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>

        {/* Messages Container */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            bgcolor: theme.palette.background.default,
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
                  width: "100%", // Full width for message container
                }}
              >
                <Avatar
                  sx={{
                    bgcolor:
                      msg.sender === "user"
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main,
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    flexShrink: 0, // Prevent avatar from shrinking
                  }}
                >
                  {msg.sender === "user" ? "U" : <SmartToy />}
                </Avatar>
                <Box 
                  sx={{ 
                    maxWidth: "75%", // Increased from 70% to 75%
                    minWidth: "200px", // Minimum width for messages
                    flex: 1, // Allow box to grow
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor:
                        msg.sender === "user"
                          ? theme.palette.primary.main
                          : theme.palette.background.paper,
                      color:
                        msg.sender === "user"
                          ? "#ffffff"
                          : theme.palette.text.primary,
                      position: "relative",
                      width: "100%", // Full width within container
                      wordWrap: "break-word", // Handle long text
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
                    <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                      {msg.text}
                    </Typography>
                    
                    {/* Feedback Section for Bot Messages */}
                    {msg.sender === "bot" && (
                      <Box 
                        sx={{ 
                          mt: 2, 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 1,
                          flexWrap: "wrap", // Allow wrapping on small screens
                          width: "100%", // Full width
                        }}
                      >
                        {feedbackSubmitted[msg.id] ? (
                          <Chip
                            label={`Rated: ${feedbackSubmitted[msg.id]}/5`}
                            color="success"
                            size="small"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        ) : (
                          <>
                            <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                              Rate this response:
                            </Typography>
                            <Rating
                              size="small"
                              onChange={(event, newValue) => {
                                if (newValue) {
                                  handleFeedback(msg.id, newValue);
                                }
                              }}
                              sx={{
                                flexShrink: 0,
                                '& .MuiRating-iconFilled': {
                                  color: theme.palette.primary.main,
                                },
                                '& .MuiRating-iconHover': {
                                  color: theme.palette.primary.light,
                                },
                              }}
                            />
                            <Tooltip title="Quick feedback">
                              <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleFeedback(msg.id, 5)}
                                  sx={{
                                    color: theme.palette.success.main,
                                    '&:hover': {
                                      bgcolor: theme.palette.success.light + '20',
                                    },
                                  }}
                                >
                                  <ThumbUp fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleFeedback(msg.id, 1)}
                                  sx={{
                                    color: theme.palette.error.main,
                                    '&:hover': {
                                      bgcolor: theme.palette.error.light + '20',
                                    },
                                  }}
                                >
                                  <ThumbDown fontSize="small" />
                                </IconButton>
                              </Box>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    )}
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
            bgcolor: theme.palette.background.paper,
            width: "100%", // Full width
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              bgcolor: theme.palette.background.default,
              borderRadius: 3,
              p: 1,
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
              width: "100%", // Full width
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
                flexShrink: 0, // Prevent button from shrinking
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
