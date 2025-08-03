import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Grid,
  IconButton,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Restaurant,
  MusicNote,
  Phone,
  SportsEsports,
  Book,
  Nature,
  Add,
  Close,
  CheckCircle,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { onboardingAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    preferredMealTimes: [],
    emotionalEatingFrequency: '',
    stressTriggers: [],
    comfortFoods: [],
    preferredCopingMethods: [],
    supportContacts: [],
    calmingSongs: [],
    preferredActivities: [],
  });

  // Temporary input states
  const [newTrigger, setNewTrigger] = useState('');
  const [newComfortFood, setNewComfortFood] = useState('');
  const [newSong, setNewSong] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phoneNumber: '',
    email: '',
  });

  const steps = [
    'Food Habits',
    'Stress & Triggers',
    'Coping Preferences',
    'Support Network',
    'Review & Complete'
  ];

  const mealTimeOptions = [
    'Early Morning (5-8 AM)',
    'Morning (8-11 AM)',
    'Midday (11 AM-2 PM)',
    'Afternoon (2-5 PM)',
    'Evening (5-8 PM)',
    'Late Night (8 PM-12 AM)',
    'Night (12 AM-5 AM)'
  ];

  const copingMethodOptions = [
    { value: 'talking', label: 'Talking to Someone', icon: <Phone /> },
    { value: 'music', label: 'Listening to Music', icon: <MusicNote /> },
    { value: 'exercise', label: 'Physical Activity', icon: <SportsEsports /> },
    { value: 'reading', label: 'Reading', icon: <Book /> },
    { value: 'nature', label: 'Nature/Outdoors', icon: <Nature /> },
    { value: 'cooking', label: 'Cooking', icon: <Restaurant /> },
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleMealTimeToggle = (mealTime) => {
    setFormData(prev => ({
      ...prev,
      preferredMealTimes: prev.preferredMealTimes.includes(mealTime)
        ? prev.preferredMealTimes.filter(time => time !== mealTime)
        : [...prev.preferredMealTimes, mealTime]
    }));
  };

  const handleCopingMethodToggle = (method) => {
    setFormData(prev => ({
      ...prev,
      preferredCopingMethods: prev.preferredCopingMethods.includes(method)
        ? prev.preferredCopingMethods.filter(m => m !== method)
        : [...prev.preferredCopingMethods, method]
    }));
  };

  const addTrigger = () => {
    if (newTrigger.trim() && !formData.stressTriggers.includes(newTrigger.trim())) {
      setFormData(prev => ({
        ...prev,
        stressTriggers: [...prev.stressTriggers, newTrigger.trim()]
      }));
      setNewTrigger('');
    }
  };

  const removeTrigger = (trigger) => {
    setFormData(prev => ({
      ...prev,
      stressTriggers: prev.stressTriggers.filter(t => t !== trigger)
    }));
  };

  const addComfortFood = () => {
    if (newComfortFood.trim() && !formData.comfortFoods.includes(newComfortFood.trim())) {
      setFormData(prev => ({
        ...prev,
        comfortFoods: [...prev.comfortFoods, newComfortFood.trim()]
      }));
      setNewComfortFood('');
    }
  };

  const removeComfortFood = (food) => {
    setFormData(prev => ({
      ...prev,
      comfortFoods: prev.comfortFoods.filter(f => f !== food)
    }));
  };

  const addSong = () => {
    if (newSong.trim() && !formData.calmingSongs.includes(newSong.trim())) {
      setFormData(prev => ({
        ...prev,
        calmingSongs: [...prev.calmingSongs, newSong.trim()]
      }));
      setNewSong('');
    }
  };

  const removeSong = (song) => {
    setFormData(prev => ({
      ...prev,
      calmingSongs: prev.calmingSongs.filter(s => s !== song)
    }));
  };

  const addActivity = () => {
    if (newActivity.trim() && !formData.preferredActivities.includes(newActivity.trim())) {
      setFormData(prev => ({
        ...prev,
        preferredActivities: [...prev.preferredActivities, newActivity.trim()]
      }));
      setNewActivity('');
    }
  };

  const removeActivity = (activity) => {
    setFormData(prev => ({
      ...prev,
      preferredActivities: prev.preferredActivities.filter(a => a !== activity)
    }));
  };

  const addContact = () => {
    if (newContact.name.trim() && newContact.phoneNumber.trim()) {
      setFormData(prev => ({
        ...prev,
        supportContacts: [...prev.supportContacts, { ...newContact }]
      }));
      setNewContact({ name: '', relationship: '', phoneNumber: '', email: '' });
    }
  };

  const removeContact = (index) => {
    setFormData(prev => ({
      ...prev,
      supportContacts: prev.supportContacts.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      await onboardingAPI.completeOnboarding(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Food Habits
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
              Let's understand your eating habits
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, color: theme.palette.text.secondary }}>
              This helps us personalize your experience and provide better insights.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.text.primary }}>
                  When do you typically eat your meals?
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {mealTimeOptions.map((time) => (
                    <Chip
                      key={time}
                      label={time}
                      onClick={() => handleMealTimeToggle(time)}
                      color={formData.preferredMealTimes.includes(time) ? 'primary' : 'default'}
                      variant={formData.preferredMealTimes.includes(time) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>How often do you eat when stressed or emotional?</InputLabel>
                  <Select
                    value={formData.emotionalEatingFrequency}
                    onChange={(e) => setFormData(prev => ({ ...prev, emotionalEatingFrequency: e.target.value }))}
                    label="How often do you eat when stressed or emotional?"
                  >
                    <MenuItem value="rarely">Rarely</MenuItem>
                    <MenuItem value="sometimes">Sometimes</MenuItem>
                    <MenuItem value="often">Often</MenuItem>
                    <MenuItem value="very_often">Very Often</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.text.primary }}>
                  What foods do you crave when stressed? (Add your comfort foods)
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    value={newComfortFood}
                    onChange={(e) => setNewComfortFood(e.target.value)}
                    placeholder="e.g., Chocolate, Pizza, Ice Cream"
                    onKeyPress={(e) => e.key === 'Enter' && addComfortFood()}
                  />
                  <Button variant="contained" onClick={addComfortFood}>
                    <Add />
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.comfortFoods.map((food) => (
                    <Chip
                      key={food}
                      label={food}
                      onDelete={() => removeComfortFood(food)}
                      color="primary"
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        );

      case 1: // Stress & Triggers
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
              What triggers your stress or emotional eating?
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, color: theme.palette.text.secondary }}>
              Understanding your triggers helps us provide better coping strategies.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.text.primary }}>
                  Add your stress triggers
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    value={newTrigger}
                    onChange={(e) => setNewTrigger(e.target.value)}
                    placeholder="e.g., Work deadlines, Relationship issues, Financial stress"
                    onKeyPress={(e) => e.key === 'Enter' && addTrigger()}
                  />
                  <Button variant="contained" onClick={addTrigger}>
                    <Add />
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.stressTriggers.map((trigger) => (
                    <Chip
                      key={trigger}
                      label={trigger}
                      onDelete={() => removeTrigger(trigger)}
                      color="secondary"
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        );

      case 2: // Coping Preferences
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
              How do you prefer to cope with stress?
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, color: theme.palette.text.secondary }}>
              Select up to 3 methods that work best for you. We'll customize your coping tools accordingly.
            </Typography>

            <Grid container spacing={2}>
              {copingMethodOptions.map((method) => (
                <Grid item xs={12} sm={6} key={method.value}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: formData.preferredCopingMethods.includes(method.value) 
                        ? `2px solid ${theme.palette.primary.main}` 
                        : `2px solid ${theme.palette.divider}`,
                      bgcolor: formData.preferredCopingMethods.includes(method.value)
                        ? `${theme.palette.primary.main}10`
                        : 'transparent',
                    }}
                    onClick={() => handleCopingMethodToggle(method.value)}
                  >
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Box sx={{ mb: 1 }}>
                        {method.icon}
                      </Box>
                      <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                        {method.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 3: // Support Network
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
              Build your support network
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, color: theme.palette.text.secondary }}>
              Add people you can reach out to when you need support.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.text.primary }}>
                  Add a support contact
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={newContact.name}
                      onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Relationship"
                      value={newContact.relationship}
                      onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                      placeholder="e.g., Friend, Family, Therapist"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={newContact.phoneNumber}
                      onChange={(e) => setNewContact(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email (optional)"
                      value={newContact.email}
                      onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </Grid>
                </Grid>
                <Button variant="contained" onClick={addContact} sx={{ mt: 2 }}>
                  Add Contact
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.text.primary }}>
                  Your support contacts
                </Typography>
                {formData.supportContacts.map((contact, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary }}>
                            {contact.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            {contact.relationship} • {contact.phoneNumber}
                          </Typography>
                          {contact.email && (
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                              {contact.email}
                            </Typography>
                          )}
                        </Box>
                        <IconButton onClick={() => removeContact(index)} color="error">
                          <Close />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Grid>

              {formData.preferredCopingMethods.includes('music') && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.text.primary }}>
                    Add calming songs (up to 2)
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      value={newSong}
                      onChange={(e) => setNewSong(e.target.value)}
                      placeholder="e.g., Weightless by Marconi Union"
                      onKeyPress={(e) => e.key === 'Enter' && addSong()}
                      disabled={formData.calmingSongs.length >= 2}
                    />
                    <Button 
                      variant="contained" 
                      onClick={addSong}
                      disabled={formData.calmingSongs.length >= 2}
                    >
                      <Add />
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.calmingSongs.map((song) => (
                      <Chip
                        key={song}
                        label={song}
                        onDelete={() => removeSong(song)}
                        color="primary"
                      />
                    ))}
                  </Box>
                </Grid>
              )}

              {formData.preferredCopingMethods.includes('exercise') && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: theme.palette.text.primary }}>
                    Add your preferred activities
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      value={newActivity}
                      onChange={(e) => setNewActivity(e.target.value)}
                      placeholder="e.g., Walking, Yoga, Swimming"
                      onKeyPress={(e) => e.key === 'Enter' && addActivity()}
                    />
                    <Button variant="contained" onClick={addActivity}>
                      <Add />
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.preferredActivities.map((activity) => (
                      <Chip
                        key={activity}
                        label={activity}
                        onDelete={() => removeActivity(activity)}
                        color="secondary"
                      />
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        );

      case 4: // Review & Complete
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
              Review your preferences
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, color: theme.palette.text.secondary }}>
              Let's make sure everything looks right before we personalize your experience.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                      Food Habits
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      <strong>Meal Times:</strong> {formData.preferredMealTimes.join(', ') || 'None selected'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      <strong>Emotional Eating:</strong> {formData.emotionalEatingFrequency || 'Not specified'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      <strong>Comfort Foods:</strong> {formData.comfortFoods.join(', ') || 'None added'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                      Coping Preferences
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      <strong>Methods:</strong> {formData.preferredCopingMethods.join(', ') || 'None selected'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      <strong>Support Contacts:</strong> {formData.supportContacts.length} added
                    </Typography>
                    {formData.calmingSongs.length > 0 && (
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        <strong>Calming Songs:</strong> {formData.calmingSongs.join(', ')}
                      </Typography>
                    )}
                    {formData.preferredActivities.length > 0 && (
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        <strong>Activities:</strong> {formData.preferredActivities.join(', ')}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
                      Stress Triggers
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.stressTriggers.map((trigger) => (
                        <Chip key={trigger} label={trigger} color="secondary" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: theme.palette.text.primary }}>
            Welcome to Mood2Food! 🎉
          </Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            Let's personalize your experience to help you build better eating habits.
          </Typography>
          
          {/* Login option for existing users */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
              Already have an account?
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{ mr: 2 }}
            >
              Sign In Instead
            </Button>
          </Box>
        </Box>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mb: 4 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {activeStep === steps.length - 1 ? (
              <>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                >
                  Skip for Now
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={<CheckCircle />}
                >
                  {loading ? 'Completing...' : 'Complete Setup'}
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={
                  (activeStep === 0 && formData.preferredMealTimes.length === 0) ||
                  (activeStep === 1 && formData.stressTriggers.length === 0) ||
                  (activeStep === 2 && formData.preferredCopingMethods.length === 0)
                }
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Onboarding; 