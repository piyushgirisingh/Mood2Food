import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  Avatar,
  CircularProgress,
  Alert,
  Rating,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Send, Person, SmartToy, ThumbUp, ThumbDown } from '@mui/icons-material';
import { chatAPI } from '../services/api';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ratings, setRatings] = useState({}); // Track ratings for each message
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const response = await chatAPI.getChatHistory();
      const formattedMessages = response.data.map((msg, index) => {
        const [sender, ...messageParts] = msg.reply.split(': ');
        return {
          id: index,
          sender: sender.toUpperCase(),
          message: messageParts.join(': '),
          timestamp: msg.timestamp,
        };
      });
      setMessages(formattedMessages);
    } catch (err) {
      setError('Failed to load chat history');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'USER',
      message: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        sender: 'BOT',
        message: response.data.reply,
        timestamp: response.data.timestamp,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (messageId, rating) => {
    try {
      const message = messages.find(m => m.id === messageId);
      if (!message || message.sender !== 'BOT') return;

      // Update local ratings
      setRatings(prev => ({ ...prev, [messageId]: rating }));

      // Send feedback to backend
      await chatAPI.sendFeedback({
        message: messages[messages.length - 2]?.message || '', // User's message
        response: message.message,
        emotion: 'neutral', // You could extract this from the response
        rating: rating,
        feedback_text: rating >= 4 ? 'Helpful response' : 'Could be better'
      });

      console.log(`Rated message ${messageId} with ${rating} stars`);
    } catch (err) {
      console.error('Failed to send feedback:', err);
    }
  };

  const handleQuickRating = async (messageId, isPositive) => {
    const rating = isPositive ? 5 : 1;
    await handleRating(messageId, rating);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Chat with AI Assistant
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: '60vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          <List>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                sx={{
                  flexDirection: message.sender === 'USER' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                }}
              >
                <Avatar sx={{ 
                  bgcolor: message.sender === 'USER' ? '#1976d2' : '#4caf50',
                  ml: message.sender === 'USER' ? 1 : 0,
                  mr: message.sender === 'BOT' ? 1 : 0,
                }}>
                  {message.sender === 'USER' ? <Person /> : <SmartToy />}
                </Avatar>
                <Box
                  sx={{
                    maxWidth: '70%',
                    bgcolor: message.sender === 'USER' ? '#1976d2' : '#f5f5f5',
                    color: message.sender === 'USER' ? 'white' : 'black',
                    borderRadius: 2,
                    p: 2,
                    mb: 1,
                  }}
                >
                  <Typography variant="body1">{message.message}</Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      opacity: 0.7,
                      display: 'block',
                      mt: 0.5,
                    }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </Typography>
                  
                  {/* Rating interface for bot messages */}
                  {message.sender === 'BOT' && (
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        Rate this response:
                      </Typography>
                      <Rating
                        size="small"
                        value={ratings[message.id] || 0}
                        onChange={(event, newValue) => {
                          if (newValue !== null) {
                            handleRating(message.id, newValue);
                          }
                        }}
                        sx={{ '& .MuiRating-iconFilled': { color: '#ff9800' } }}
                      />
                      <Tooltip title="This was helpful">
                        <IconButton
                          size="small"
                          onClick={() => handleQuickRating(message.id, true)}
                          sx={{ 
                            color: ratings[message.id] === 5 ? '#4caf50' : 'grey.400',
                            '&:hover': { color: '#4caf50' }
                          }}
                        >
                          <ThumbUp fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="This was not helpful">
                        <IconButton
                          size="small"
                          onClick={() => handleQuickRating(message.id, false)}
                          sx={{ 
                            color: ratings[message.id] === 1 ? '#f44336' : 'grey.400',
                            '&:hover': { color: '#f44336' }
                          }}
                        >
                          <ThumbDown fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
              </ListItem>
            ))}
            {loading && (
              <ListItem>
                <Avatar sx={{ bgcolor: '#4caf50', mr: 1 }}>
                  <SmartToy />
                </Avatar>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={20} />
                  <Typography sx={{ ml: 2 }}>AI is typing...</Typography>
                </Box>
              </ListItem>
            )}
          </List>
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={loading || !inputMessage.trim()}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              <Send />
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Chat; 