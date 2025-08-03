package com.Mood2Food.mood2food.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "students")
@Data
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Onboarding preferences
    @Column(name = "onboarding_completed", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean onboardingCompleted = false;

    // Food habit preferences
    @Column(name = "preferred_meal_times", length = 1000)
    private String preferredMealTimes; // JSON string of meal times

    @Column(name = "emotional_eating_frequency")
    private String emotionalEatingFrequency; // "rarely", "sometimes", "often", "very_often"

    @Column(name = "stress_triggers", length = 1000)
    private String stressTriggers; // JSON array of triggers

    @Column(name = "comfort_foods", length = 1000)
    private String comfortFoods; // JSON array of comfort foods

    // Coping tool preferences
    @Column(name = "preferred_coping_methods", length = 1000)
    private String preferredCopingMethods; // JSON array of preferred methods

    @Column(name = "support_contacts", length = 2000)
    private String supportContacts; // JSON array of contact info

    @Column(name = "calming_songs", length = 1000)
    private String calmingSongs; // JSON array of song names

    @Column(name = "preferred_activities", length = 1000)
    private String preferredActivities; // JSON array of activities
}