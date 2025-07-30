package com.Mood2Food.mood2food.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "food_logs")
public class FoodLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @Column(name = "food_item", nullable = false)
    private String foodItem;
    
    @Column(name = "quantity")
    private String quantity;
    
    @Column(name = "meal_type")
    private String mealType; // breakfast, lunch, dinner, snack
    
    @Column(name = "eating_time", nullable = false)
    private LocalDateTime eatingTime;
    
    @Column(name = "emotion_emoji")
    private String emotionEmoji; // 😊😢😡😴😰😋😐
    
    @Column(name = "emotion_description")
    private String emotionDescription; // happy, sad, angry, tired, anxious, hungry, neutral
    
    @Column(name = "hunger_level")
    private Integer hungerLevel; // 1-10 scale
    
    @Column(name = "satisfaction_level")
    private Integer satisfactionLevel; // 1-10 scale
    
    @Column(name = "location")
    private String location; // home, work, restaurant, car, etc.
    
    @Column(name = "company")
    private String company; // alone, with family, with friends, etc.
    
    @Column(name = "notes")
    private String notes;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public FoodLog() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public Student getStudent() {
        return student;
    }
    
    public void setStudent(Student student) {
        this.student = student;
    }
    
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
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
} 