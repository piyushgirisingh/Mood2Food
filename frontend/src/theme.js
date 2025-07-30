import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8B5CF6", // Vibrant purple
      light: "#A78BFA",
      dark: "#7C3AED",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F59E0B", // Vibrant orange
      light: "#FBBF24",
      dark: "#D97706",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#334155", // Even lighter dark blue-grey (was #1E293B)
      paper: "#475569", // Even lighter blue-grey for cards (was #334155)
    },
    text: {
      primary: "#F8FAFC", // Very light grey for primary text
      secondary: "#CBD5E1", // Light grey for secondary text
      disabled: "#64748B", // Medium grey for disabled text
    },
    error: {
      main: "#EF4444", // Bright red
      light: "#F87171",
      dark: "#DC2626",
    },
    success: {
      main: "#10B981", // Bright green
      light: "#34D399",
      dark: "#059669",
    },
    warning: {
      main: "#F59E0B", // Bright orange
      light: "#FBBF24",
      dark: "#D97706",
    },
    info: {
      main: "#3B82F6", // Bright blue
      light: "#60A5FA",
      dark: "#2563EB",
    },
    divider: "#334155", // Medium grey for dividers
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: "#F8FAFC",
    },
    h2: {
      fontWeight: 600,
      color: "#F8FAFC",
    },
    h3: {
      fontWeight: 600,
      color: "#F8FAFC",
    },
    h4: {
      fontWeight: 600,
      color: "#F8FAFC",
    },
    h5: {
      fontWeight: 600,
      color: "#F8FAFC",
    },
    h6: {
      fontWeight: 600,
      color: "#F8FAFC",
    },
    body1: {
      color: "#F1F5F9",
    },
    body2: {
      color: "#CBD5E1",
    },
    caption: {
      color: "#94A3B8",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#334155", // Use the lighter default color
          color: "#F8FAFC",
          scrollbarColor: "#475569 #1E293B",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: "4px",
            backgroundColor: "#475569",
            minHeight: "24px",
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            borderRadius: "4px",
            backgroundColor: "#1E293B",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1E293B",
          borderBottom: "1px solid #334155",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1E293B",
          borderRight: "1px solid #334155",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#475569", // Use the lighter paper color
          border: "1px solid #334155",
          borderRadius: "12px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          "&:hover": {
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 16px",
        },
        contained: {
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          "&:hover": {
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        },
        outlined: {
          borderWidth: "2px",
          "&:hover": {
            borderWidth: "2px",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#374151",
            borderRadius: "8px",
            "& fieldset": {
              borderColor: "#4B5563",
            },
            "&:hover fieldset": {
              borderColor: "#6B7280",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#8B5CF6",
            },
            "& input": {
              color: "#F8FAFC",
            },
            "& textarea": {
              color: "#F8FAFC",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#D1D5DB",
            "&.Mui-focused": {
              color: "#8B5CF6",
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: "#374151",
          borderRadius: "8px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#4B5563",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#6B7280",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8B5CF6",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          fontWeight: 500,
        },
        outlined: {
          borderColor: "#4B5563",
          color: "#D1D5DB",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1E293B",
          borderRadius: "12px",
          border: "1px solid #334155",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: "#F8FAFC",
          borderBottom: "1px solid #334155",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          color: "#F1F5F9",
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: "#374151",
          borderRadius: "4px",
        },
        bar: {
          borderRadius: "4px",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          border: "1px solid",
        },
        standardSuccess: {
          backgroundColor: "#065F46",
          borderColor: "#10B981",
          color: "#D1FAE5",
        },
        standardError: {
          backgroundColor: "#7F1D1D",
          borderColor: "#EF4444",
          color: "#FEE2E2",
        },
        standardWarning: {
          backgroundColor: "#78350F",
          borderColor: "#F59E0B",
          color: "#FEF3C7",
        },
        standardInfo: {
          backgroundColor: "#1E3A8A",
          borderColor: "#3B82F6",
          color: "#DBEAFE",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "#D1D5DB",
          "&.Mui-focused": {
            color: "#8B5CF6",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#D1D5DB",
          "&.Mui-focused": {
            color: "#8B5CF6",
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: "#8B5CF6",
        },
        track: {
          backgroundColor: "#8B5CF6",
        },
        thumb: {
          backgroundColor: "#8B5CF6",
          "&:hover": {
            backgroundColor: "#A78BFA",
          },
        },
      },
    },
  },
});

export default theme;
