import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Restaurant as RestaurantIcon,
  AccessTime as TimeIcon,
  EmojiEmotions as EmojiIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { foodLogAPI } from "../services/api";

const FoodLogForm = ({ onFoodLogAdded }) => {
  const [open, setOpen] = useState(false);
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

    try {
      console.log("Submitting food log data:", formData);
      const response = await foodLogAPI.createFoodLog(formData);
      console.log("Food log response:", response);
      setSuccess("Food log added successfully!");
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
      setOpen(false);
      if (onFoodLogAdded) {
        onFoodLogAdded();
      }
    } catch (err) {
      console.error("Food log error:", err);
      console.error("Error response:", err.response);
      setError("Failed to add food log. Please try again.");
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

  const handleClose = () => {
    setOpen(false);
    setError("");
    setSuccess("");
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{
          background: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
          color: "white",
          fontWeight: 600,
          padding: "12px 24px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgba(139, 92, 246, 0.2)",
          "&:hover": {
            background: "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)",
            boxShadow: "0 10px 15px -3px rgba(139, 92, 246, 0.3)",
          },
        }}
      >
        Log Your Food Entry
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
            border: "1px solid #475569",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
            color: "white",
            borderRadius: "16px 16px 0 0",
            padding: "20px 24px",
          }}
        >
          <Box display="flex" alignItems="center">
            <RestaurantIcon sx={{ mr: 2, fontSize: 28 }} />
            <Typography variant="h6" fontWeight={600}>
              Log Your Food Entry
            </Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ padding: "24px" }}>
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
                  color: "#F8FAFC",
                  mb: 2,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <RestaurantIcon sx={{ mr: 1, color: "#8B5CF6" }} />
                Food Details
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="What did you eat?"
                    value={formData.foodItem}
                    onChange={(e) =>
                      handleInputChange("foodItem", e.target.value)
                    }
                    required
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: "#D1D5DB",
                        fontWeight: 500,
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#374151",
                        "& input": {
                          color: "#F8FAFC",
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
                    onChange={(e) =>
                      handleInputChange("quantity", e.target.value)
                    }
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: "#D1D5DB",
                        fontWeight: 500,
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#374151",
                        "& input": {
                          color: "#F8FAFC",
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: "#D1D5DB", fontWeight: 500 }}>
                      Meal Type
                    </InputLabel>
                    <Select
                      value={formData.mealType}
                      onChange={(e) =>
                        handleInputChange("mealType", e.target.value)
                      }
                      sx={{
                        backgroundColor: "#374151",
                        "& .MuiSelect-select": {
                          color: "#F8FAFC",
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
                    onChange={(e) =>
                      handleInputChange("eatingTime", e.target.value)
                    }
                    InputLabelProps={{
                      shrink: true,
                      sx: { color: "#D1D5DB", fontWeight: 500 },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#374151",
                        "& input": {
                          color: "#F8FAFC",
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3, borderColor: "#475569" }} />

            {/* Emotional State Section */}
            <Box mb={4}>
              <Typography
                variant="h6"
                sx={{
                  color: "#F8FAFC",
                  mb: 2,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <EmojiIcon sx={{ mr: 1, color: "#F59E0B" }} />
                How did you feel when eating?
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
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
                    sx={{
                      backgroundColor:
                        formData.emotionDescription === emotion.description
                          ? "#8B5CF6"
                          : "transparent",
                      color:
                        formData.emotionDescription === emotion.description
                          ? "white"
                          : "#D1D5DB",
                      borderColor: "#4B5563",
                      "&:hover": {
                        backgroundColor:
                          formData.emotionDescription === emotion.description
                            ? "#7C3AED"
                            : "#374151",
                      },
                    }}
                  />
                ))}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#D1D5DB", mb: 1, fontWeight: 500 }}
                  >
                    Hunger Level (1-10): {formData.hungerLevel}
                  </Typography>
                  <Slider
                    value={formData.hungerLevel}
                    onChange={(e, value) =>
                      handleInputChange("hungerLevel", value)
                    }
                    min={1}
                    max={10}
                    marks
                    valueLabelDisplay="auto"
                    sx={{
                      color: "#8B5CF6",
                      "& .MuiSlider-mark": {
                        backgroundColor: "#6B7280",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#D1D5DB", mb: 1, fontWeight: 500 }}
                  >
                    Satisfaction Level (1-10): {formData.satisfactionLevel}
                  </Typography>
                  <Slider
                    value={formData.satisfactionLevel}
                    onChange={(e, value) =>
                      handleInputChange("satisfactionLevel", value)
                    }
                    min={1}
                    max={10}
                    marks
                    valueLabelDisplay="auto"
                    sx={{
                      color: "#F59E0B",
                      "& .MuiSlider-mark": {
                        backgroundColor: "#6B7280",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3, borderColor: "#475569" }} />

            {/* Context Section */}
            <Box mb={4}>
              <Typography
                variant="h6"
                sx={{
                  color: "#F8FAFC",
                  mb: 2,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TimeIcon sx={{ mr: 1, color: "#3B82F6" }} />
                Context
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: "#D1D5DB", fontWeight: 500 }}>
                      Location
                    </InputLabel>
                    <Select
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      sx={{
                        backgroundColor: "#374151",
                        "& .MuiSelect-select": {
                          color: "#F8FAFC",
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
                    <InputLabel sx={{ color: "#D1D5DB", fontWeight: 500 }}>
                      Company
                    </InputLabel>
                    <Select
                      value={formData.company}
                      onChange={(e) =>
                        handleInputChange("company", e.target.value)
                      }
                      sx={{
                        backgroundColor: "#374151",
                        "& .MuiSelect-select": {
                          color: "#F8FAFC",
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
                    sx={{
                      "& .MuiInputLabel-root": {
                        color: "#D1D5DB",
                        fontWeight: 500,
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#374151",
                        "& textarea": {
                          color: "#F8FAFC",
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </form>
        </DialogContent>

        <DialogActions
          sx={{
            padding: "16px 24px 24px",
            background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
            borderRadius: "0 0 16px 16px",
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              color: "#D1D5DB",
              "&:hover": {
                backgroundColor: "#374151",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            startIcon={<AddIcon />}
            sx={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
              color: "white",
              fontWeight: 600,
              padding: "10px 20px",
              borderRadius: "8px",
              "&:hover": {
                background: "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)",
              },
              "&:disabled": {
                background: "#6B7280",
                color: "#9CA3AF",
              },
            }}
          >
            {loading ? "Adding..." : "+ Add Food Log"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FoodLogForm;
