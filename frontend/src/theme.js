import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8b5cf6", // Purple
      light: "#a78bfa",
      dark: "#7c3aed",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ec4899", // Pink
      light: "#f472b6",
      dark: "#db2777",
      contrastText: "#ffffff",
    },
    background: {
      default: "#0f172a", // Dark blue
      paper: "#1e293b",
      gradient:
        "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#94a3b8",
    },
    success: {
      main: "#10b981",
      light: "#34d399",
      dark: "#059669",
    },
    error: {
      main: "#ef4444",
      light: "#f87171",
      dark: "#dc2626",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
    },
    info: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#2563eb",
    },
    divider: "rgba(0, 0, 0, 0.05)",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "3.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2.75rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontSize: "2.25rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    subtitle1: {
      fontSize: "1.125rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.57,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    "none",
    "0px 1px 2px rgba(0, 0, 0, 0.05)",
    "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
    "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
    "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    ...Array(18).fill("none"),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0f172a",
          backgroundImage:
            "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)",
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(30, 41, 59, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(30, 41, 59, 0.9)",
          backdropFilter: "blur(12px)",
          border: "none",
          boxShadow:
            "0px 4px 6px -1px rgba(0, 0, 0, 0.2), 0px 2px 4px -1px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(30, 41, 59, 0.9)",
          backdropFilter: "blur(12px)",
          borderRadius: 16,
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow:
            "0px 4px 6px -1px rgba(0, 0, 0, 0.2), 0px 2px 4px -1px rgba(0, 0, 0, 0.1)",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow:
              "0px 20px 25px -5px rgba(0, 0, 0, 0.2), 0px 10px 10px -5px rgba(0, 0, 0, 0.1)",
            borderColor: "rgba(139, 92, 246, 0.3)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 24px",
          fontSize: "0.875rem",
          fontWeight: 600,
          textTransform: "none",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow:
              "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        },
        contained: {
          backgroundImage: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
          "&:hover": {
            backgroundImage:
              "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
          },
        },
        outlined: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(12px)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            },
            "&.Mui-focused": {
              backgroundColor: "#ffffff",
              boxShadow:
                "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
            },
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "rgba(99, 102, 241, 0.05)",
            transform: "translateX(4px)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(99, 102, 241, 0.15)",
            },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow:
            "0px 2px 4px -1px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.06)",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.1)",
            boxShadow:
              "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow:
              "0px 2px 4px -1px rgba(0, 0, 0, 0.1), 0px 1px 2px -1px rgba(0, 0, 0, 0.06)",
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(12px)",
          borderRadius: 8,
          padding: "8px 16px",
          fontSize: "0.875rem",
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow:
            "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow:
              "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
        },
      },
    },
  },
});

export default theme;
