package com.Mood2Food.mood2food.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CopingToolUsageResponse {
    private UUID id;
    private String toolName;
    private LocalDateTime usedAt;
}