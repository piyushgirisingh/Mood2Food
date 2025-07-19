package com.Mood2Food.mood2food.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessageResponse {
    private String reply;
    private LocalDateTime timestamp;
}