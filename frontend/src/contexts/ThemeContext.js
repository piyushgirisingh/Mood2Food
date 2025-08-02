import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Check localStorage for saved preference
    const savedMode = localStorage.getItem('theme-mode');
    return savedMode || 'dark';
  });

  const toggleMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', newMode);
      return newMode;
    });
  };

  const theme = createTheme({
    palette: {
      mode,
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
        default: mode === 'dark' ? "#334155" : "#F8FAFC",
        paper: mode === 'dark' ? "#475569" : "#FFFFFF",
      },
      text: {
        primary: mode === 'dark' ? "#F8FAFC" : "#0F172A",
        secondary: mode === 'dark' ? "#CBD5E1" : "#475569",
        disabled: mode === 'dark' ? "#64748B" : "#94A3B8",
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
      divider: mode === 'dark' ? "#334155" : "#E2E8F0",
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        color: mode === 'dark' ? "#F8FAFC" : "#0F172A",
      },
      h2: {
        fontWeight: 600,
        color: mode === 'dark' ? "#F8FAFC" : "#0F172A",
      },
      h3: {
        fontWeight: 600,
        color: mode === 'dark' ? "#F8FAFC" : "#0F172A",
      },
      h4: {
        fontWeight: 600,
        color: mode === 'dark' ? "#F8FAFC" : "#0F172A",
      },
      h5: {
        fontWeight: 600,
        color: mode === 'dark' ? "#F8FAFC" : "#0F172A",
      },
      h6: {
        fontWeight: 600,
        color: mode === 'dark' ? "#F8FAFC" : "#0F172A",
      },
      body1: {
        color: mode === 'dark' ? "#F1F5F9" : "#1E293B",
      },
      body2: {
        color: mode === 'dark' ? "#CBD5E1" : "#475569",
      },
      caption: {
        color: mode === 'dark' ? "#94A3B8" : "#94A3B8",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: mode === 'dark' ? "#334155" : "#F8FAFC",
            color: mode === 'dark' ? "#F8FAFC" : "#1E293B",
            scrollbarColor: mode === 'dark' ? "#475569 #1E293B" : "#CBD5E1 #F1F5F9",
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: "4px",
              backgroundColor: mode === 'dark' ? "#475569" : "#CBD5E1",
              minHeight: "24px",
            },
            "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
              borderRadius: "4px",
              backgroundColor: mode === 'dark' ? "#1E293B" : "#F1F5F9",
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? "#1E293B" : "#FFFFFF",
            borderBottom: `1px solid ${mode === 'dark' ? "#334155" : "#E2E8F0"}`,
            boxShadow: mode === 'dark' 
              ? "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
              : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? "#1E293B" : "#FFFFFF",
            borderRight: `1px solid ${mode === 'dark' ? "#334155" : "#E2E8F0"}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? "#475569" : "#FFFFFF",
            border: `1px solid ${mode === 'dark' ? "#334155" : "#E2E8F0"}`,
            borderRadius: "12px",
            boxShadow: mode === 'dark'
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
              : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            "&:hover": {
              boxShadow: mode === 'dark'
                ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
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
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            "&:hover": {
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
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
              backgroundColor: mode === 'dark' ? "#374151" : "#FFFFFF",
              borderRadius: "8px",
              "& fieldset": {
                borderColor: mode === 'dark' ? "#4B5563" : "#D1D5DB",
              },
              "&:hover fieldset": {
                borderColor: mode === 'dark' ? "#6B7280" : "#9CA3AF",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#8B5CF6",
              },
              "& input": {
                color: mode === 'dark' ? "#F8FAFC" : "#0F172A",
              },
              "& textarea": {
                color: mode === 'dark' ? "#F8FAFC" : "#0F172A",
              },
            },
            "& .MuiInputLabel-root": {
              color: mode === 'dark' ? "#D1D5DB" : "#475569",
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
            backgroundColor: mode === 'dark' ? "#374151" : "#FFFFFF",
            borderRadius: "8px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: mode === 'dark' ? "#4B5563" : "#D1D5DB",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: mode === 'dark' ? "#6B7280" : "#9CA3AF",
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
            borderColor: mode === 'dark' ? "#4B5563" : "#D1D5DB",
            color: mode === 'dark' ? "#D1D5DB" : "#475569",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? "#1E293B" : "#FFFFFF",
            borderRadius: "12px",
            border: `1px solid ${mode === 'dark' ? "#334155" : "#E2E8F0"}`,
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? "#F8FAFC" : "#0F172A",
            borderBottom: `1px solid ${mode === 'dark' ? "#334155" : "#E2E8F0"}`,
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? "#F1F5F9" : "#1E293B",
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? "#374151" : "#F1F5F9",
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
            backgroundColor: mode === 'dark' ? "#065F46" : "#D1FAE5",
            borderColor: "#10B981",
            color: mode === 'dark' ? "#D1FAE5" : "#065F46",
          },
          standardError: {
            backgroundColor: mode === 'dark' ? "#7F1D1D" : "#FEE2E2",
            borderColor: "#EF4444",
            color: mode === 'dark' ? "#FEE2E2" : "#7F1D1D",
          },
          standardWarning: {
            backgroundColor: mode === 'dark' ? "#78350F" : "#FEF3C7",
            borderColor: "#F59E0B",
            color: mode === 'dark' ? "#FEF3C7" : "#78350F",
          },
          standardInfo: {
            backgroundColor: mode === 'dark' ? "#1E3A8A" : "#DBEAFE",
            borderColor: "#3B82F6",
            color: mode === 'dark' ? "#DBEAFE" : "#1E3A8A",
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? "#D1D5DB" : "#64748B",
            "&.Mui-focused": {
              color: "#8B5CF6",
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? "#D1D5DB" : "#64748B",
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

  const value = {
    mode,
    toggleMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 