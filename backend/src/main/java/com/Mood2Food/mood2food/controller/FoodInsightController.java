package com.Mood2Food.mood2food.controller;

import com.Mood2Food.mood2food.service.FoodInsightService;
import com.Mood2Food.mood2food.entity.Student;
import com.Mood2Food.mood2food.repository.StudentRepository;
import com.Mood2Food.mood2food.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/food-insights")
@CrossOrigin(origins = "http://localhost:3000")
public class FoodInsightController {
    
    @Autowired
    private FoodInsightService foodInsightService;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    /**
     * Get comprehensive emotional eating pattern analysis
     */
    @GetMapping("/patterns")
    public ResponseEntity<?> getEmotionalEatingPatterns(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            UUID studentId = jwtUtil.extractUserId(jwt);
            
            Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
            
            Map<String, Object> patterns = foodInsightService.analyzeEmotionalEatingPatterns(student);
            return ResponseEntity.ok(patterns);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Get recent food insights for chatbot context
     */
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentFoodInsights(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            UUID studentId = jwtUtil.extractUserId(jwt);
            
            Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
            
            Map<String, Object> insights = foodInsightService.getRecentFoodInsights(student);
            return ResponseEntity.ok(insights);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
} 