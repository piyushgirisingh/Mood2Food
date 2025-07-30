import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

const GlowingBorder = ({ isActive, color = "#2196f3" }) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (isActive) {
      setOpacity(1);
    } else {
      setOpacity(0);
    }
  }, [isActive]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 9999,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: `4px solid ${color}`,
          opacity: opacity,
          transition: "opacity 0.3s ease-in-out",
          animation: isActive ? "glowingBorder 2s infinite" : "none",
          boxShadow: `0 0 20px ${color}, inset 0 0 20px ${color}`,
        },
        "@keyframes glowingBorder": {
          "0%": {
            opacity: 0.5,
            boxShadow: `0 0 20px ${color}, inset 0 0 20px ${color}`,
          },
          "50%": {
            opacity: 1,
            boxShadow: `0 0 40px ${color}, inset 0 0 40px ${color}`,
          },
          "100%": {
            opacity: 0.5,
            boxShadow: `0 0 20px ${color}, inset 0 0 20px ${color}`,
          },
        },
      }}
    />
  );
};

export default GlowingBorder;
