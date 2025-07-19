package com.Mood2Food.mood2food.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class InsightRequest {
    @NotBlank(message = "Insight message is required")
    private String message;
}