package com.Mood2Food.mood2food.dto;

import lombok.Data;
import java.util.List;

@Data
public class OnboardingRequest {
    
    // Food habit preferences
    private List<String> preferredMealTimes;
    private String emotionalEatingFrequency;
    private List<String> stressTriggers;
    private List<String> comfortFoods;
    
    // Coping tool preferences
    private List<String> preferredCopingMethods;
    private List<SupportContact> supportContacts;
    private List<String> calmingSongs;
    private List<String> preferredActivities;
    
    @Data
    public static class SupportContact {
        private String name;
        private String relationship;
        private String phoneNumber;
        private String email;
    }
} 