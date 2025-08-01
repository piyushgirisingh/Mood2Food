package com.Mood2Food.mood2food.controller;

import com.Mood2Food.mood2food.dto.FoodLogRequest;
import com.Mood2Food.mood2food.dto.FoodLogResponse;
import com.Mood2Food.mood2food.service.FoodLogService;
import com.Mood2Food.mood2food.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/food-logs")
@CrossOrigin(origins = "http://localhost:3000")
public class FoodLogController {
    
    @Autowired
    private FoodLogService foodLogService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    // Create a new food log
    @PostMapping
    public ResponseEntity<?> createFoodLog(@RequestHeader("Authorization") String token, 
                                         @RequestBody @Valid FoodLogRequest request) {
        try {
            String jwt = token.substring(7); // Remove "Bearer "
            UUID studentId = jwtUtil.extractUserId(jwt);
            
            FoodLogResponse response = foodLogService.createFoodLog(studentId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Get all food logs for the authenticated user
    @GetMapping
    public ResponseEntity<?> getFoodLogs(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            UUID studentId = jwtUtil.extractUserId(jwt);
            
            List<FoodLogResponse> foodLogs = foodLogService.getFoodLogs(studentId);
            return ResponseEntity.ok(foodLogs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Get today's food logs
    @GetMapping("/today")
    public ResponseEntity<?> getTodayFoodLogs(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            UUID studentId = jwtUtil.extractUserId(jwt);
            
            List<FoodLogResponse> foodLogs = foodLogService.getTodayFoodLogs(studentId);
            return ResponseEntity.ok(foodLogs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Get food logs for a specific date
    @GetMapping("/date/{date}")
    public ResponseEntity<?> getFoodLogsByDate(@RequestHeader("Authorization") String token,
                                             @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            String jwt = token.substring(7);
            UUID studentId = jwtUtil.extractUserId(jwt);
            
            List<FoodLogResponse> foodLogs = foodLogService.getFoodLogsByDate(studentId, date);
            return ResponseEntity.ok(foodLogs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Get food logs by meal type
    @GetMapping("/meal-type/{mealType}")
    public ResponseEntity<?> getFoodLogsByMealType(@RequestHeader("Authorization") String token,
                                                  @PathVariable String mealType) {
        try {
            String jwt = token.substring(7);
            UUID studentId = jwtUtil.extractUserId(jwt);
            
            List<FoodLogResponse> foodLogs = foodLogService.getFoodLogsByMealType(studentId, mealType);
            return ResponseEntity.ok(foodLogs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Get food logs by emotion
    @GetMapping("/emotion/{emotion}")
    public ResponseEntity<?> getFoodLogsByEmotion(@RequestHeader("Authorization") String token,
                                                 @PathVariable String emotion) {
        try {
            String jwt = token.substring(7);
            UUID studentId = jwtUtil.extractUserId(jwt);
            
            List<FoodLogResponse> foodLogs = foodLogService.getFoodLogsByEmotion(studentId, emotion);
            return ResponseEntity.ok(foodLogs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Get recent food logs (last 7 days)
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentFoodLogs(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            UUID studentId = jwtUtil.extractUserId(jwt);
            
            List<FoodLogResponse> foodLogs = foodLogService.getRecentFoodLogs(studentId);
            return ResponseEntity.ok(foodLogs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Get food log statistics
    @GetMapping("/stats")
    public ResponseEntity<?> getFoodLogStats(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            UUID studentId = jwtUtil.extractUserId(jwt);
            
            Map<String, Object> stats = foodLogService.getFoodLogStats(studentId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Update a food log
    @PutMapping("/{foodLogId}")
    public ResponseEntity<?> updateFoodLog(@RequestHeader("Authorization") String token,
                                         @PathVariable UUID foodLogId,
                                         @RequestBody FoodLogRequest request) {
        try {
            String jwt = token.substring(7);
            UUID studentId = jwtUtil.extractUserId(jwt);
            
            FoodLogResponse response = foodLogService.updateFoodLog(studentId, foodLogId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Delete a food log
    @DeleteMapping("/{foodLogId}")
    public ResponseEntity<?> deleteFoodLog(@RequestHeader("Authorization") String token,
                                         @PathVariable UUID foodLogId) {
        try {
            String jwt = token.substring(7);
            UUID studentId = jwtUtil.extractUserId(jwt);
            
            foodLogService.deleteFoodLog(studentId, foodLogId);
            return ResponseEntity.ok(Map.of("message", "Food log deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
} 