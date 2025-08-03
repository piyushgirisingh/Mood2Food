import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import {
  Download,
  CloudUpload,
  Analytics,
  Assessment,
  TrendingUp,
  Psychology,
  Restaurant,
  Chat,
} from "@mui/icons-material";
import { reportsAPI, mlAPI } from "../services/api";

const Reports = () => {
  const theme = useTheme();
  const [downloadStatus, setDownloadStatus] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDownloadCSV = async () => {
    setLoading(true);
    setDownloadStatus({ type: "info", message: "Generating your report..." });

    try {
      const response = await reportsAPI.downloadCSV();

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "mood2food_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setDownloadStatus({
        type: "success",
        message: "Report downloaded successfully!",
      });
    } catch (error) {
      console.error("Error downloading CSV:", error);
      setDownloadStatus({
        type: "error",
        message: "Failed to download report. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };



  const reportFeatures = [
    {
      icon: <Restaurant />,
      title: "Food Logs",
      description: "Complete history of your food entries with emotions and context",
    },
    {
      icon: <Psychology />,
      title: "Emotional Patterns",
      description: "Analysis of your emotional eating triggers and patterns",
    },
    {
      icon: <Chat />,
      title: "Chat History",
      description: "All your conversations with the AI assistant",
    },
    {
      icon: <TrendingUp />,
      title: "Progress Tracking",
      description: "Your journey and improvement over time",
    },
  ];

  return (
    <Box sx={{ py: 3, width: "100%" }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Reports & Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Download Section */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, #1E293B 0%, #334155 100%)"
                  : "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
              color: theme.palette.text.primary,
              borderRadius: 3,
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 8px 32px rgba(30, 41, 59, 0.3)"
                  : "0 8px 32px rgba(0, 0, 0, 0.1)",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Assessment
                  sx={{
                    fontSize: 28,
                    color: theme.palette.secondary.main,
                    mr: 1,
                  }}
                />
                <Typography variant="h6" fontWeight="bold">
                  Download Your Data
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ mb: 3, color: theme.palette.text.secondary }}
              >
                Export all your data as a CSV file for backup or analysis.
              </Typography>

              {downloadStatus && (
                <Alert severity={downloadStatus.type} sx={{ mb: 2 }}>
                  {downloadStatus.message}
                </Alert>
              )}

              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <Download />}
                onClick={handleDownloadCSV}
                disabled={loading}
                sx={{
                  background: theme.palette.primary.main,
                  "&:hover": {
                    background: theme.palette.primary.dark,
                  },
                }}
              >
                {loading ? "Generating..." : "Download CSV Report"}
              </Button>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" fontWeight="bold" mb={2}>
                What's included in your report:
              </Typography>
              <List dense>
                {reportFeatures.map((feature, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {React.cloneElement(feature.icon, {
                        sx: { color: theme.palette.secondary.main },
                      })}
                    </ListItemIcon>
                    <ListItemText
                      primary={feature.title}
                      secondary={feature.description}
                      primaryTypographyProps={{ fontWeight: "bold" }}
                      secondaryTypographyProps={{
                        color: theme.palette.text.secondary,
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>


      </Grid>
    </Box>
  );
};

export default Reports; 