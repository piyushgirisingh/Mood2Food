package com.Mood2Food.mood2food.dto;    

import java.time.LocalDateTime;
import java.util.UUID;


public record TriggerLogResponse(
    UUID id,
    String emotion,
    String situation,
    int intensity,
    LocalDateTime timestamp
){
    
}
