package com.Mood2Food.mood2food.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class ChatMessageRequest {
    @NotBlank(message = "Message is required")
    private String message;
}