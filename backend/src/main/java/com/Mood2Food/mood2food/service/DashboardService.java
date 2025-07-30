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
        // TODO: Add logic for trends, frequent triggers, streaks, etc.
        data.put("chatCount", chatMessageRepository.countByStudent(student));
        data.put("copingToolsUsed", copingToolUsageRepository.countByStudent(student));
        data.put("insightsCount", insightRepository.countByStudent(student));
        data.put("triggerLogsCount", triggerLogRepository.countByStudent(student));
        data.put("foodLogsCount", foodLogRepository.countByStudent(student));
        return data;
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