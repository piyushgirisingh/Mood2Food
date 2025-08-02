import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Alert,
  Divider,
} from "@mui/material";
import {
  Restaurant as RestaurantIcon,
  Add as AddIcon,
  AccessTime as TimeIcon,
  EmojiEmotions as EmojiIcon,
} from "@mui/icons-material";
import { foodLogAPI } from "../services/api";

const FoodLog = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    foodItem: "",
    quantity: "",
    mealType: "",
    eatingTime: new Date().toISOString().slice(0, 16),
    emotionEmoji: "",
    emotionDescription: "",
    hungerLevel: 5,
    satisfactionLevel: 5,
    location: "",
    company: "",
    notes: "",
  });

  const mealTypes = [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "snack", label: "Snack" },
  ];

  const emotionOptions = [
    { emoji: "😊", description: "happy", label: "Happy" },
    { emoji: "😢", description: "sad", label: "Sad" },
    { emoji: "😡", description: "angry", label: "Angry" },
    { emoji: "😴", description: "tired", label: "Tired" },
    { emoji: "😰", description: "anxious", label: "Anxious" },
    { emoji: "😋", description: "hungry", label: "Hungry" },
    { emoji: "😐", description: "neutral", label: "Neutral" },
    { emoji: "😤", description: "stressed", label: "Stressed" },
    { emoji: "🥱", description: "bored", label: "Bored" },
  ];

  const locationOptions = [
    "Home",
    "Work",
    "Restaurant",
    "Car",
    "Park",
    "Gym",
    "School",
    "Other",
  ];

  const companyOptions = [
    "Alone",
    "With Family",
    "With Friends",
    "With Colleagues",
    "With Partner",
    "Other",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await foodLogAPI.createFoodLog(formData);
      setSuccess("Food log created successfully!");
      setFormData({
        foodItem: "",
        quantity: "",
        mealType: "",
        eatingTime: new Date().toISOString().slice(0, 16),
        emotionEmoji: "",
        emotionDescription: "",
        hungerLevel: 5,
        satisfactionLevel: 5,
        location: "",
        company: "",
        notes: "",
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create food log");
    } finally {
      setLoading(false);
    }
  };

  const handleEmotionSelect = (emotion) => {
    setFormData((prev) => ({
      ...prev,
      emotionEmoji: emotion.emoji,
      emotionDescription: emotion.description,
    }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <RestaurantIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Log Your Food Entry
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track what you eat, when you eat it, and how you feel. This helps you become more aware of your eating habits and emotional patterns.
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Food Details Section */}
          <Box mb={4}>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.primary,
                mb: 2,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
              }}
            >
              <RestaurantIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              Food Details
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="What did you eat?"
                  value={formData.foodItem}
                  onChange={(e) => handleInputChange("foodItem", e.target.value)}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#475569",
                      },
                      "&:hover fieldset": {
                        borderColor: "#8B5CF6",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#8B5CF6",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Quantity"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  placeholder="e.g., 1 plate, 2 slices"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#475569",
                      },
                      "&:hover fieldset": {
                        borderColor: "#8B5CF6",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#8B5CF6",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Meal Type</InputLabel>
                  <Select
                    value={formData.mealType}
                    onChange={(e) => handleInputChange("mealType", e.target.value)}
                    label="Meal Type"
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#475569",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8B5CF6",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8B5CF6",
                      },
                    }}
                  >
                    {mealTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="When did you eat?"
                  value={formData.eatingTime}
                  onChange={(e) => handleInputChange("eatingTime", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#475569",
                      },
                      "&:hover fieldset": {
                        borderColor: "#8B5CF6",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#8B5CF6",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Emotional State Section */}
          <Box mb={4}>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.primary,
                mb: 2,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
              }}
            >
              <EmojiIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              How were you feeling?
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Select your emotional state:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {emotionOptions.map((emotion) => (
                  <Chip
                    key={emotion.description}
                    label={`${emotion.emoji} ${emotion.label}`}
                    onClick={() => handleEmotionSelect(emotion)}
                    variant={
                      formData.emotionDescription === emotion.description
                        ? "filled"
                        : "outlined"
                    }
                    color={
                      formData.emotionDescription === emotion.description
                        ? "primary"
                        : "default"
                    }
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "primary.light",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>Hunger Level (1-10)</Typography>
                <Slider
                  value={formData.hungerLevel}
                  onChange={(e, value) => handleInputChange("hungerLevel", value)}
                  min={1}
                  max={10}
                  marks
                  valueLabelDisplay="auto"
                  sx={{
                    color: "#8B5CF6",
                    "& .MuiSlider-mark": {
                      backgroundColor: "#475569",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>Satisfaction Level (1-10)</Typography>
                <Slider
                  value={formData.satisfactionLevel}
                  onChange={(e, value) => handleInputChange("satisfactionLevel", value)}
                  min={1}
                  max={10}
                  marks
                  valueLabelDisplay="auto"
                  sx={{
                    color: "#8B5CF6",
                    "& .MuiSlider-mark": {
                      backgroundColor: "#475569",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Context Section */}
          <Box mb={4}>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.primary,
                mb: 2,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
              }}
            >
              <TimeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              Context
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    label="Location"
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#475569",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8B5CF6",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8B5CF6",
                      },
                    }}
                  >
                    {locationOptions.map((location) => (
                      <MenuItem key={location} value={location}>
                        {location}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Company</InputLabel>
                  <Select
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    label="Company"
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#475569",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8B5CF6",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8B5CF6",
                      },
                    }}
                  >
                    {companyOptions.map((company) => (
                      <MenuItem key={company} value={company}>
                        {company}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Additional Notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Any additional thoughts or observations..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#475569",
                      },
                      "&:hover fieldset": {
                        borderColor: "#8B5CF6",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#8B5CF6",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<AddIcon />}
              disabled={loading}
              sx={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
                color: "white",
                fontWeight: 600,
                padding: "12px 32px",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(139, 92, 246, 0.2)",
                "&:hover": {
                  background: "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)",
                  boxShadow: "0 10px 15px -3px rgba(139, 92, 246, 0.3)",
                },
                "&:disabled": {
                  background: "#475569",
                },
              }}
            >
              {loading ? "Saving..." : "Save Food Log"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default FoodLog; 