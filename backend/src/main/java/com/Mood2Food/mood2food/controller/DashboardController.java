package com.Mood2Food.mood2food.controller;

import com.Mood2Food.mood2food.service.DashboardService;
import com.Mood2Food.mood2food.repository.StudentRepository;
import com.Mood2Food.mood2food.entity.Student;
import com.Mood2Food.mood2food.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import java.util.HashMap;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    @Autowired
    private DashboardService dashboardService;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboard(@RequestHeader("Authorization") String token) {
        UUID userId = jwtUtil.extractUserId(token.substring(7));
        Optional<Student> studentOpt = studentRepository.findById(userId);
        if (studentOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(dashboardService.getDashboardData(studentOpt.get()));
    }

    @GetMapping("/fun-fact")
    public ResponseEntity<Map<String, Object>> getFunFact() {
        Map<String, Object> funFact = dashboardService.getFunFactOfTheDay();
        return ResponseEntity.ok(funFact);
    }
}