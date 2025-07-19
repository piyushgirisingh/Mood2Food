package com.Mood2Food.mood2food.controller;

import com.Mood2Food.mood2food.entity.Insight;
import com.Mood2Food.mood2food.service.InsightService;
import com.Mood2Food.mood2food.repository.StudentRepository;
import com.Mood2Food.mood2food.entity.Student;
import com.Mood2Food.mood2food.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import java.util.Optional;
import com.Mood2Food.mood2food.dto.InsightRequest;
import com.Mood2Food.mood2food.dto.InsightResponse;

@RestController
@RequestMapping("/api/insights")
public class InsightController {
    @Autowired
    private InsightService insightService;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<InsightResponse> addInsight(@RequestHeader("Authorization") String token,
            @RequestBody InsightRequest request) {
        UUID userId = jwtUtil.extractUserId(token.substring(7));
        Optional<Student> studentOpt = studentRepository.findById(userId);
        if (studentOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Insight insight = new Insight();
        insight.setStudent(studentOpt.get());
        insight.setMessage(request.getMessage());
        Insight saved = insightService.saveInsight(insight);
        InsightResponse response = new InsightResponse();
        response.setId(saved.getId());
        response.setMessage(saved.getMessage());
        response.setCreatedAt(saved.getCreatedAt());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/latest")
    public ResponseEntity<InsightResponse> getLatestInsight(@RequestHeader("Authorization") String token) {
        UUID userId = jwtUtil.extractUserId(token.substring(7));
        Optional<Student> studentOpt = studentRepository.findById(userId);
        if (studentOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Insight latest = insightService.getLatestInsightForUser(studentOpt.get());
        if (latest == null)
            return ResponseEntity.notFound().build();
        InsightResponse response = new InsightResponse();
        response.setId(latest.getId());
        response.setMessage(latest.getMessage());
        response.setCreatedAt(latest.getCreatedAt());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<InsightResponse>> getAllInsights(@RequestHeader("Authorization") String token) {
        UUID userId = jwtUtil.extractUserId(token.substring(7));
        Optional<Student> studentOpt = studentRepository.findById(userId);
        if (studentOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        List<Insight> insights = insightService.getAllInsightsForUser(studentOpt.get());
        List<InsightResponse> responses = insights.stream().map(i -> {
            InsightResponse r = new InsightResponse();
            r.setId(i.getId());
            r.setMessage(i.getMessage());
            r.setCreatedAt(i.getCreatedAt());
            return r;
        }).toList();
        return ResponseEntity.ok(responses);
    }
}