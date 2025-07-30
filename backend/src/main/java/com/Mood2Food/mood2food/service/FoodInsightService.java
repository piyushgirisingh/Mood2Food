package com.Mood2Food.mood2food.service;

import com.Mood2Food.mood2food.entity.FoodLog;
import com.Mood2Food.mood2food.entity.Student;
import com.Mood2Food.mood2food.repository.FoodLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FoodInsightService {
    
    @Autowired
    private FoodLogRepository foodLogRepository;
    
    /**
     * Analyze user's emotional eating patterns from food logs
     */
    public Map<String, Object> analyzeEmotionalEatingPatterns(Student student) {
        Map<String, Object> insights = new HashMap<>();
        
        // Get all food logs for the student
        List<FoodLog> allFoodLogs = foodLogRepository.findByStudentOrderByEatingTimeDesc(student);
        
        if (allFoodLogs.isEmpty()) {
            insights.put("message", "No food logs found. Start logging your meals to get personalized insights!");
            return insights;
        }
        
        // Analyze emotional eating patterns
        Map<String, Object> emotionalPatterns = analyzeEmotionalPatterns(allFoodLogs);
        insights.put("emotionalPatterns", emotionalPatterns);
        
        // Analyze time-based patterns
        Map<String, Object> timePatterns = analyzeTimePatterns(allFoodLogs);
        insights.put("timePatterns", timePatterns);
        

        
        // Generate personalized recommendations
        List<String> recommendations = generateRecommendations(allFoodLogs);
        insights.put("recommendations", recommendations);
        

        
        return insights;
    }
    
    /**
     * Analyze emotional patterns in food logs
     */
    private Map<String, Object> analyzeEmotionalPatterns(List<FoodLog> foodLogs) {
        Map<String, Object> patterns = new HashMap<>();
        
        // Count emotions
        Map<String, Long> emotionCounts = foodLogs.stream()
            .filter(log -> log.getEmotionDescription() != null)
            .collect(Collectors.groupingBy(
                FoodLog::getEmotionDescription,
                Collectors.counting()
            ));
        
        patterns.put("emotionCounts", emotionCounts);
        
        // Find most common emotion
        String mostCommonEmotion = emotionCounts.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("neutral");
        
        patterns.put("mostCommonEmotion", mostCommonEmotion);
        
        // Analyze emotional eating triggers
        List<FoodLog> emotionalEatingLogs = foodLogs.stream()
            .filter(log -> log.getHungerLevel() != null && log.getSatisfactionLevel() != null)
            .filter(log -> log.getHungerLevel() >= 7 && log.getSatisfactionLevel() <= 5)
            .collect(Collectors.toList());
        
        patterns.put("emotionalEatingCount", emotionalEatingLogs.size());
        patterns.put("totalLogs", foodLogs.size());
        
        return patterns;
    }
    
    /**
     * Analyze time-based patterns
     */
    private Map<String, Object> analyzeTimePatterns(List<FoodLog> foodLogs) {
        Map<String, Object> patterns = new HashMap<>();
        
        // Group by hour of day
        Map<Integer, Long> hourCounts = foodLogs.stream()
            .collect(Collectors.groupingBy(
                log -> log.getEatingTime().getHour(),
                Collectors.counting()
            ));
        
        patterns.put("hourCounts", hourCounts);
        
        // Find peak eating hours
        List<Integer> peakHours = hourCounts.entrySet().stream()
            .sorted(Map.Entry.<Integer, Long>comparingByValue().reversed())
            .limit(3)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
        
        patterns.put("peakHours", peakHours);
        
        // Analyze emotional eating by time
        Map<Integer, Long> emotionalEatingByHour = foodLogs.stream()
            .filter(log -> log.getHungerLevel() != null && log.getSatisfactionLevel() != null)
            .filter(log -> log.getHungerLevel() >= 7 && log.getSatisfactionLevel() <= 5)
            .collect(Collectors.groupingBy(
                log -> log.getEatingTime().getHour(),
                Collectors.counting()
            ));
        
        patterns.put("emotionalEatingByHour", emotionalEatingByHour);
        
        return patterns;
    }
    

    
    /**
     * Generate personalized recommendations based on patterns
     */
    private List<String> generateRecommendations(List<FoodLog> foodLogs) {
        List<String> recommendations = new ArrayList<>();
        
        if (foodLogs.isEmpty()) {
            recommendations.add("Start logging your meals to get personalized recommendations!");
            return recommendations;
        }
        
        // Analyze patterns
        Map<String, Long> emotionCounts = foodLogs.stream()
            .filter(log -> log.getEmotionDescription() != null)
            .collect(Collectors.groupingBy(
                FoodLog::getEmotionDescription,
                Collectors.counting()
            ));
        
        // Find most common emotion
        String mostCommonEmotion = emotionCounts.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("neutral");
        
        // Generate emotion-specific recommendations
        switch (mostCommonEmotion.toLowerCase()) {
            case "sad":
                recommendations.add("When you're feeling sad, try calling a friend instead of reaching for comfort food");
                recommendations.add("Consider taking a short walk to boost your mood naturally");
                break;
            case "stressed":
                recommendations.add("Practice deep breathing exercises when stressed instead of emotional eating");
                recommendations.add("Try progressive muscle relaxation to reduce stress");
                break;
            case "anxious":
                recommendations.add("Use the 5-4-3-2-1 grounding technique when anxious");
                recommendations.add("Consider journaling your worries instead of eating them");
                break;
            case "bored":
                recommendations.add("Find engaging activities to replace boredom eating");
                recommendations.add("Try a new hobby or creative project");
                break;
            case "happy":
                recommendations.add("Celebrate your happiness with non-food activities");
                recommendations.add("Share your joy with others instead of eating alone");
                break;
            case "neutral":
                recommendations.add("Try adding more variety to your meals to make eating more enjoyable");
                recommendations.add("Consider eating with others to make meals more social and engaging");
                break;
        }
        
        // Time-based recommendations
        Map<Integer, Long> hourCounts = foodLogs.stream()
            .collect(Collectors.groupingBy(
                log -> log.getEatingTime().getHour(),
                Collectors.counting()
            ));
        
        Integer peakHour = hourCounts.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse(12);
        
        if (peakHour >= 20 || peakHour <= 6) {
            recommendations.add("Consider eating earlier in the day to avoid late-night emotional eating");
        }
        
        // Location-based recommendations
        Map<String, Long> locationCounts = foodLogs.stream()
            .filter(log -> log.getLocation() != null)
            .collect(Collectors.groupingBy(
                FoodLog::getLocation,
                Collectors.counting()
            ));
        
        String mostCommonLocation = locationCounts.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("Home");
        
        if (mostCommonLocation.toLowerCase().contains("bedroom") || 
            mostCommonLocation.toLowerCase().contains("couch") ||
            mostCommonLocation.toLowerCase().contains("car")) {
            recommendations.add("Try eating at a designated dining area instead of in bed or on the couch");
        }
        
        // Company-based recommendations
        Map<String, Long> companyCounts = foodLogs.stream()
            .filter(log -> log.getCompany() != null)
            .collect(Collectors.groupingBy(
                FoodLog::getCompany,
                Collectors.counting()
            ));
        
        String mostCommonCompany = companyCounts.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("Alone");
        
        if (mostCommonCompany.toLowerCase().contains("alone")) {
            recommendations.add("Try sharing meals with friends or family when possible");
        }
        
        // Hunger level analysis
        double avgHungerLevel = foodLogs.stream()
            .filter(log -> log.getHungerLevel() != null)
            .mapToInt(FoodLog::getHungerLevel)
            .average()
            .orElse(5.0);
        
        if (avgHungerLevel <= 3) {
            recommendations.add("You often eat when not very hungry - try waiting until you're genuinely hungry");
        }
        
        // Satisfaction-based recommendations
        double avgSatisfaction = foodLogs.stream()
            .filter(log -> log.getSatisfactionLevel() != null)
            .mapToInt(FoodLog::getSatisfactionLevel)
            .average()
            .orElse(5.0);
        
        if (avgSatisfaction < 6.0) {
            recommendations.add("Focus on foods that truly satisfy you rather than eating for emotional reasons");
        }
        
        // Meal type analysis
        Map<String, Long> mealTypeCounts = foodLogs.stream()
            .filter(log -> log.getMealType() != null)
            .collect(Collectors.groupingBy(
                FoodLog::getMealType,
                Collectors.counting()
            ));
        
        long snackCount = mealTypeCounts.getOrDefault("snack", 0L);
        long totalMeals = foodLogs.size();
        
        if (snackCount > totalMeals * 0.4) { // If snacks are more than 40% of meals
            recommendations.add("Consider planning more structured meals instead of frequent snacking");
        }
        
        // If no specific recommendations were generated, provide general ones
        if (recommendations.isEmpty()) {
            recommendations.add("Great job! Keep tracking your meals to discover more patterns");
            recommendations.add("Try to eat mindfully and pay attention to your hunger cues");
        }
        
        return recommendations;
    }
    

    
    /**
     * Get recent food log insights for chatbot context
     */
    public Map<String, Object> getRecentFoodInsights(Student student) {
        Map<String, Object> insights = new HashMap<>();
        
        // Get today's food logs
        List<FoodLog> todayLogs = foodLogRepository.findByStudentAndDate(student, LocalDate.now());
        
        if (!todayLogs.isEmpty()) {
            // Analyze today's patterns
            Map<String, Object> todayPatterns = analyzeEmotionalPatterns(todayLogs);
            insights.put("todayPatterns", todayPatterns);
            
            // Get most recent emotion
            String recentEmotion = todayLogs.stream()
                .filter(log -> log.getEmotionDescription() != null)
                .max(Comparator.comparing(FoodLog::getEatingTime))
                .map(FoodLog::getEmotionDescription)
                .orElse("neutral");
            
            insights.put("recentEmotion", recentEmotion);
            
            // Get average satisfaction today
            double avgSatisfaction = todayLogs.stream()
                .filter(log -> log.getSatisfactionLevel() != null)
                .mapToInt(FoodLog::getSatisfactionLevel)
                .average()
                .orElse(5.0);
            
            insights.put("avgSatisfactionToday", avgSatisfaction);
        }
        
        return insights;
    }
} 