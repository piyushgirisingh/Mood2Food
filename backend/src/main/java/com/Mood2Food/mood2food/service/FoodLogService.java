package com.Mood2Food.mood2food.service;

import com.Mood2Food.mood2food.dto.FoodLogRequest;
import com.Mood2Food.mood2food.dto.FoodLogResponse;
import com.Mood2Food.mood2food.entity.FoodLog;
import com.Mood2Food.mood2food.entity.Student;
import com.Mood2Food.mood2food.repository.FoodLogRepository;
import com.Mood2Food.mood2food.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FoodLogService {
    
    @Autowired
    private FoodLogRepository foodLogRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    // Create a new food log
    public FoodLogResponse createFoodLog(UUID studentId, FoodLogRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        FoodLog foodLog = new FoodLog();
        foodLog.setStudent(student);
        foodLog.setFoodItem(request.getFoodItem());
        foodLog.setQuantity(request.getQuantity());
        foodLog.setMealType(request.getMealType());
        foodLog.setEatingTime(request.getEatingTime() != null ? request.getEatingTime() : LocalDateTime.now());
        foodLog.setEmotionEmoji(request.getEmotionEmoji());
        foodLog.setEmotionDescription(request.getEmotionDescription());
        foodLog.setHungerLevel(request.getHungerLevel());
        foodLog.setSatisfactionLevel(request.getSatisfactionLevel());
        foodLog.setLocation(request.getLocation());
        foodLog.setCompany(request.getCompany());
        foodLog.setNotes(request.getNotes());
        
        FoodLog savedFoodLog = foodLogRepository.save(foodLog);
        return convertToResponse(savedFoodLog);
    }
    
    // Get all food logs for a student
    public List<FoodLogResponse> getFoodLogs(UUID studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        List<FoodLog> foodLogs = foodLogRepository.findByStudentOrderByEatingTimeDesc(student);
        return foodLogs.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get food logs for today
    public List<FoodLogResponse> getTodayFoodLogs(UUID studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        LocalDate today = LocalDate.now();
        List<FoodLog> foodLogs = foodLogRepository.findByStudentAndDate(student, today);
        return foodLogs.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get food logs for a specific date
    public List<FoodLogResponse> getFoodLogsByDate(UUID studentId, LocalDate date) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        List<FoodLog> foodLogs = foodLogRepository.findByStudentAndDate(student, date);
        return foodLogs.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get food logs by meal type
    public List<FoodLogResponse> getFoodLogsByMealType(UUID studentId, String mealType) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        List<FoodLog> foodLogs = foodLogRepository.findByStudentAndMealTypeOrderByEatingTimeDesc(student, mealType);
        return foodLogs.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get food logs by emotion
    public List<FoodLogResponse> getFoodLogsByEmotion(UUID studentId, String emotion) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        List<FoodLog> foodLogs = foodLogRepository.findByStudentAndEmotionDescriptionOrderByEatingTimeDesc(student, emotion);
        return foodLogs.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get recent food logs (last 7 days)
    public List<FoodLogResponse> getRecentFoodLogs(UUID studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        List<FoodLog> foodLogs = foodLogRepository.findRecentFoodLogs(student, weekAgo);
        return foodLogs.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get food log statistics
    public Map<String, Object> getFoodLogStats(UUID studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        Map<String, Object> stats = new HashMap<>();
        
        // Total food logs
        long totalLogs = foodLogRepository.countByStudent(student);
        stats.put("totalLogs", totalLogs);
        
        // Today's logs
        long todayLogs = foodLogRepository.countByStudentAndDate(student, LocalDate.now());
        stats.put("todayLogs", todayLogs);
        
        // Most common emotions
        List<Object[]> commonEmotions = foodLogRepository.findMostCommonEmotions(student);
        Map<String, Long> emotionStats = new HashMap<>();
        for (Object[] result : commonEmotions) {
            String emotion = (String) result[0];
            Long count = (Long) result[1];
            if (emotion != null) {
                emotionStats.put(emotion, count);
            }
        }
        stats.put("commonEmotions", emotionStats);
        
        // Most common meal types
        List<Object[]> commonMealTypes = foodLogRepository.findMostCommonMealTypes(student);
        Map<String, Long> mealTypeStats = new HashMap<>();
        for (Object[] result : commonMealTypes) {
            String mealType = (String) result[0];
            Long count = (Long) result[1];
            if (mealType != null) {
                mealTypeStats.put(mealType, count);
            }
        }
        stats.put("commonMealTypes", mealTypeStats);
        
        // Average levels
        Object[] averageLevels = foodLogRepository.findAverageLevels(student);
        if (averageLevels != null && averageLevels.length >= 2) {
            Double avgHunger = (Double) averageLevels[0];
            Double avgSatisfaction = (Double) averageLevels[1];
            stats.put("averageHungerLevel", avgHunger != null ? Math.round(avgHunger * 10.0) / 10.0 : 0);
            stats.put("averageSatisfactionLevel", avgSatisfaction != null ? Math.round(avgSatisfaction * 10.0) / 10.0 : 0);
        } else {
            stats.put("averageHungerLevel", 0);
            stats.put("averageSatisfactionLevel", 0);
        }
        
        // High satisfaction foods
        List<FoodLog> highSatisfactionLogs = foodLogRepository.findHighSatisfactionLogs(student);
        List<FoodLogResponse> highSatisfactionResponses = highSatisfactionLogs.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        stats.put("highSatisfactionFoods", highSatisfactionResponses);
        
        // Low satisfaction foods
        List<FoodLog> lowSatisfactionLogs = foodLogRepository.findLowSatisfactionLogs(student);
        List<FoodLogResponse> lowSatisfactionResponses = lowSatisfactionLogs.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        stats.put("lowSatisfactionFoods", lowSatisfactionResponses);
        
        // Emotional eating patterns
        List<FoodLog> emotionalEatingLogs = foodLogRepository.findEmotionalEatingPatterns(student);
        List<FoodLogResponse> emotionalEatingResponses = emotionalEatingLogs.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        stats.put("emotionalEatingPatterns", emotionalEatingResponses);
        
        return stats;
    }
    
    // Update a food log
    public FoodLogResponse updateFoodLog(UUID studentId, UUID foodLogId, FoodLogRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        FoodLog foodLog = foodLogRepository.findById(foodLogId)
                .orElseThrow(() -> new RuntimeException("Food log not found"));
        
        // Verify the food log belongs to the student
        if (!foodLog.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Unauthorized access to food log");
        }
        
        foodLog.setFoodItem(request.getFoodItem());
        foodLog.setQuantity(request.getQuantity());
        foodLog.setMealType(request.getMealType());
        foodLog.setEatingTime(request.getEatingTime());
        foodLog.setEmotionEmoji(request.getEmotionEmoji());
        foodLog.setEmotionDescription(request.getEmotionDescription());
        foodLog.setHungerLevel(request.getHungerLevel());
        foodLog.setSatisfactionLevel(request.getSatisfactionLevel());
        foodLog.setLocation(request.getLocation());
        foodLog.setCompany(request.getCompany());
        foodLog.setNotes(request.getNotes());
        
        FoodLog updatedFoodLog = foodLogRepository.save(foodLog);
        return convertToResponse(updatedFoodLog);
    }
    
    // Delete a food log
    public void deleteFoodLog(UUID studentId, UUID foodLogId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        FoodLog foodLog = foodLogRepository.findById(foodLogId)
                .orElseThrow(() -> new RuntimeException("Food log not found"));
        
        // Verify the food log belongs to the student
        if (!foodLog.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Unauthorized access to food log");
        }
        
        foodLogRepository.delete(foodLog);
    }
    
    // Convert FoodLog entity to FoodLogResponse DTO
    private FoodLogResponse convertToResponse(FoodLog foodLog) {
        return new FoodLogResponse(
                foodLog.getId(),
                foodLog.getFoodItem(),
                foodLog.getQuantity(),
                foodLog.getMealType(),
                foodLog.getEatingTime(),
                foodLog.getEmotionEmoji(),
                foodLog.getEmotionDescription(),
                foodLog.getHungerLevel(),
                foodLog.getSatisfactionLevel(),
                foodLog.getLocation(),
                foodLog.getCompany(),
                foodLog.getNotes(),
                foodLog.getCreatedAt()
        );
    }
} 