package com.Mood2Food.mood2food.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class InsightResponse {
    private UUID id;
    private String message;
    private LocalDateTime createdAt;
}