package com.Mood2Food.mood2food.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class CopingToolUsageRequest {
    @NotBlank(message = "Tool name is required")
    private String toolName;
}