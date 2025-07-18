package com.Mood2Food.mood2food.controller;

import com.Mood2Food.mood2food.service.TriggerLogService;
import com.Mood2Food.mood2food.util.JwtUtil;
import com.Mood2Food.mood2food.dto.TriggerLogRequest;
import com.Mood2Food.mood2food.dto.TriggerLogResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/logs")
public class TriggerLogController {

    private final TriggerLogService triggerLogService;
    private final JwtUtil jwtUtil;

    public TriggerLogController(TriggerLogService triggerLogService, JwtUtil jwtUtil) {
        this.triggerLogService = triggerLogService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/trigger")
    public ResponseEntity<?> saveLog(@RequestHeader("Authorization") String token,
            @RequestBody TriggerLogRequest request) {
        UUID studentId = jwtUtil.extractUserId(token.substring(7));
        triggerLogService.saveTriggerLog(studentId, request);
        return ResponseEntity.ok("Log saved successfully.");
    }

    @GetMapping
    public ResponseEntity<List<TriggerLogResponse>> getLogs(@RequestHeader("Authorization") String token) {
        UUID studentId = jwtUtil.extractUserId(token.substring(7));
        return ResponseEntity.ok(triggerLogService.getLogsByStudent(studentId));
    }
}
