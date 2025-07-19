package com.Mood2Food.mood2food.controller;

import com.Mood2Food.mood2food.entity.CopingToolUsage;
import com.Mood2Food.mood2food.service.CopingToolService;
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
import com.Mood2Food.mood2food.dto.CopingToolUsageRequest;
import com.Mood2Food.mood2food.dto.CopingToolUsageResponse;

@RestController
@RequestMapping("/api/tools")
public class CopingToolController {
    @Autowired
    private CopingToolService copingToolService;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/usage")
    public ResponseEntity<CopingToolUsageResponse> logUsage(@RequestHeader("Authorization") String token,
            @RequestBody CopingToolUsageRequest request) {
        UUID userId = jwtUtil.extractUserId(token.substring(7));
        Optional<Student> studentOpt = studentRepository.findById(userId);
        if (studentOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        CopingToolUsage usage = new CopingToolUsage();
        usage.setStudent(studentOpt.get());
        usage.setToolName(request.getToolName());
        CopingToolUsage saved = copingToolService.logUsage(usage);
        CopingToolUsageResponse response = new CopingToolUsageResponse();
        response.setId(saved.getId());
        response.setToolName(saved.getToolName());
        response.setUsedAt(saved.getUsedAt());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/usage")
    public ResponseEntity<List<CopingToolUsageResponse>> getUsageHistory(@RequestHeader("Authorization") String token) {
        UUID userId = jwtUtil.extractUserId(token.substring(7));
        Optional<Student> studentOpt = studentRepository.findById(userId);
        if (studentOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        List<CopingToolUsage> usages = copingToolService.getUsageHistoryForUser(studentOpt.get());
        List<CopingToolUsageResponse> responses = usages.stream().map(u -> {
            CopingToolUsageResponse r = new CopingToolUsageResponse();
            r.setId(u.getId());
            r.setToolName(u.getToolName());
            r.setUsedAt(u.getUsedAt());
            return r;
        }).toList();
        return ResponseEntity.ok(responses);
    }
}