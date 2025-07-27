import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  Typography,
  Alert,
  TextField,
  Divider,
} from '@mui/material';
import { authAPI } from '../services/api';

const Debug = () => {
  const [testResults, setTestResults] = useState([]);
  const [testCredentials, setTestCredentials] = useState({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  });

  const addResult = (test, success, message) => {
    setTestResults(prev => [...prev, { test, success, message, timestamp: new Date() }]);
  };

  const testBackendConnection = async () => {
    setTestResults([]);
    
    // Test 1: Basic fetch to backend
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'OPTIONS'
      });
      addResult('CORS Preflight', true, `Status: ${response.status}`);
    } catch (error) {
      addResult('CORS Preflight', false, error.message);
    }

    // Test 2: Test signup endpoint
    try {
      await authAPI.signup(testCredentials);
      addResult('Signup API', true, 'Signup successful');
    } catch (error) {
      addResult('Signup API', false, `${error.response?.status || 'Network'}: ${error.response?.data?.message || error.message}`);
    }

    // Test 3: Test login endpoint  
    try {
      await authAPI.login({
        email: testCredentials.email,
        password: testCredentials.password
      });
      addResult('Login API', true, 'Login successful');
    } catch (error) {
      addResult('Login API', false, `${error.response?.status || 'Network'}: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Debug & Test Connection
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Credentials
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          value={testCredentials.name}
          onChange={(e) => setTestCredentials({...testCredentials, name: e.target.value})}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          value={testCredentials.email}
          onChange={(e) => setTestCredentials({...testCredentials, email: e.target.value})}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          value={testCredentials.password}
          onChange={(e) => setTestCredentials({...testCredentials, password: e.target.value})}
        />
        
        <Button
          variant="contained"
          onClick={testBackendConnection}
          sx={{ mt: 2 }}
        >
          Run Connection Tests
        </Button>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Test Results
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {testResults.length === 0 && (
          <Typography color="text.secondary">
            Click "Run Connection Tests" to check your backend connection
          </Typography>
        )}
        
        {testResults.map((result, index) => (
          <Alert 
            key={index} 
            severity={result.success ? 'success' : 'error'}
            sx={{ mb: 1 }}
          >
            <Typography variant="subtitle2">{result.test}</Typography>
            <Typography variant="body2">{result.message}</Typography>
          </Alert>
        ))}
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Common Issues & Solutions
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>1. Backend not running:</strong> Make sure your Spring Boot backend is running on port 8080
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>2. CORS errors:</strong> The backend CORS configuration has been updated to allow frontend connections
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>3. Database connection:</strong> Ensure your database is running and configured properly
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>4. Port conflicts:</strong> Frontend runs on :3000, Backend on :8080, ML on :5000
        </Typography>
      </Paper>
    </Box>
  );
};

export default Debug; 