package com.Mood2Food.mood2food.service;

import com.Mood2Food.mood2food.entity.Student;
import com.Mood2Food.mood2food.repository.TriggerLogRepository;
import com.Mood2Food.mood2food.repository.CopingToolUsageRepository;
import com.Mood2Food.mood2food.repository.FoodLogRepository;
import com.Mood2Food.mood2food.repository.ChatMessageRepository;
import com.Mood2Food.mood2food.repository.InsightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {
    @Autowired
    private TriggerLogRepository triggerLogRepository;
    @Autowired
    private CopingToolUsageRepository copingToolUsageRepository;
    @Autowired
    private FoodLogRepository foodLogRepository;
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    @Autowired
    private InsightRepository insightRepository;

    public Map<String, Object> getDashboardData(Student student) {
        Map<String, Object> data = new HashMap<>();
        
        // Get today's date at start of day
        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.LocalDateTime startOfDay = today.atStartOfDay();
        java.time.LocalDateTime endOfDay = today.atTime(23, 59, 59);
        
        // Count today's food logs (using eating time for today's entries)
        long todayFoodLogs = foodLogRepository.countByStudentAndEatingTimeBetween(student, startOfDay, endOfDay);
        
        // Count today's coping tool usage
        long todayCopingTools = copingToolUsageRepository.countByStudentAndCreatedAtBetween(student, startOfDay, endOfDay);
        
        // Calculate current streak (consecutive days with food logs)
        int currentStreak = calculateCurrentStreak(student);
        
        data.put("foodLogsCount", todayFoodLogs);
        data.put("copingToolsUsed", todayCopingTools);
        data.put("currentStreak", currentStreak);
        data.put("chatCount", chatMessageRepository.countByStudent(student));
        data.put("insightsCount", insightRepository.countByStudent(student));
        data.put("triggerLogsCount", triggerLogRepository.countByStudent(student));
        
        return data;
    }
    
    private int calculateCurrentStreak(Student student) {
        java.time.LocalDate today = java.time.LocalDate.now();
        int streak = 0;
        
        for (int i = 0; i < 30; i++) { // Check last 30 days
            java.time.LocalDate checkDate = today.minusDays(i);
            java.time.LocalDateTime startOfDay = checkDate.atStartOfDay();
            java.time.LocalDateTime endOfDay = checkDate.atTime(23, 59, 59);
            
            long foodLogsOnDate = foodLogRepository.countByStudentAndEatingTimeBetween(student, startOfDay, endOfDay);
            
            if (foodLogsOnDate > 0) {
                streak++;
            } else {
                break; // Streak ends when we find a day with no food logs
            }
        }
        
        return streak;
    }

    public Map<String, Object> getFunFactOfTheDay() {
        try {
            // Call ML service to get dynamic fun fact
            String mlBackendUrl = "http://localhost:10000";
            String url = mlBackendUrl + "/fun-facts/daily";
            
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> mlResponse = response.getBody();
                if (Boolean.TRUE.equals(mlResponse.get("success"))) {
                    Map<String, Object> fact = (Map<String, Object>) mlResponse.get("fact");
                    return fact;
                }
            }
        } catch (Exception e) {
            System.err.println("Error fetching fun fact from ML service: " + e.getMessage());
        }
        
        // Fallback to static facts if ML service is unavailable
        return getFallbackFunFact();
    }
    
    private Map<String, Object> getFallbackFunFact() {
        Map<String, Object> result = new HashMap<>();
        result.put("fact", "75% of overeating is caused by emotions, not hunger!");
        result.put("category", "Statistics");
        result.put("tip", "Next time you reach for food, ask yourself: 'Am I really hungry?'");
        result.put("source", "American Psychological Association");
        return result;
    }
}