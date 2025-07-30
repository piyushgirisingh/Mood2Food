package com.Mood2Food.mood2food.dto;

import java.time.LocalDateTime;

public class FoodLogRequest {
    private String foodItem;
    private String quantity;
    private String mealType;
    private LocalDateTime eatingTime;
    private String emotionEmoji;
    private String emotionDescription;
    private Integer hungerLevel;
    private Integer satisfactionLevel;
    private String location;
    private String company;
    private String notes;
    
    // Constructors
    public FoodLogRequest() {}
    
    public FoodLogRequest(String foodItem, String quantity, String mealType, LocalDateTime eatingTime, 
                         String emotionEmoji, String emotionDescription, Integer hungerLevel, 
                         Integer satisfactionLevel, String location, String company, String notes) {
        this.foodItem = foodItem;
        this.quantity = quantity;
        this.mealType = mealType;
        this.eatingTime = eatingTime;
        this.emotionEmoji = emotionEmoji;
        this.emotionDescription = emotionDescription;
        this.hungerLevel = hungerLevel;
        this.satisfactionLevel = satisfactionLevel;
        this.location = location;
        this.company = company;
        this.notes = notes;
    }
    
    // Getters and Setters
    public String getFoodItem() {
        return foodItem;
    }
    
    public void setFoodItem(String foodItem) {
        this.foodItem = foodItem;
    }
    
    public String getQuantity() {
        return quantity;
    }
    
    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }
    
    public String getMealType() {
        return mealType;
    }
    
    public void setMealType(String mealType) {
        this.mealType = mealType;
    }
    
    public LocalDateTime getEatingTime() {
        return eatingTime;
    }
    
    public void setEatingTime(LocalDateTime eatingTime) {
        this.eatingTime = eatingTime;
    }
    
    public String getEmotionEmoji() {
        return emotionEmoji;
    }
    
    public void setEmotionEmoji(String emotionEmoji) {
        this.emotionEmoji = emotionEmoji;
    }
    
    public String getEmotionDescription() {
        return emotionDescription;
    }
    
    public void setEmotionDescription(String emotionDescription) {
        this.emotionDescription = emotionDescription;
    }
    
    public Integer getHungerLevel() {
        return hungerLevel;
    }
    
    public void setHungerLevel(Integer hungerLevel) {
        this.hungerLevel = hungerLevel;
    }
    
    public Integer getSatisfactionLevel() {
        return satisfactionLevel;
    }
    
    public void setSatisfactionLevel(Integer satisfactionLevel) {
        this.satisfactionLevel = satisfactionLevel;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getCompany() {
        return company;
    }
    
    public void setCompany(String company) {
        this.company = company;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
} 