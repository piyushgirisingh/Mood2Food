package com.Mood2Food.mood2food.dto;

public record TriggerLogRequest(
        String emotion,
        String situation,
        int intensity) {
}
