package com.Mood2Food.mood2food.controller;

import com.Mood2Food.mood2food.dto.OnboardingRequest;
import com.Mood2Food.mood2food.service.OnboardingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/onboarding")
@CrossOrigin(origins = "*")
public class OnboardingController {

    @Autowired
    private OnboardingService onboardingService;

    @PostMapping("/complete")
    public ResponseEntity<?> completeOnboarding(
            @RequestBody OnboardingRequest request,
            Authentication authentication) {
        try {
            UUID studentId = UUID.fromString(authentication.getName());
            onboardingService.completeOnboarding(studentId, request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Onboarding completed successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> getOnboardingStatus(Authentication authentication) {
        try {
            UUID studentId = UUID.fromString(authentication.getName());
            boolean isCompleted = onboardingService.isOnboardingCompleted(studentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("completed", isCompleted);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/coping-tools")
    public ResponseEntity<?> getPersonalizedCopingTools(Authentication authentication) {
        try {
            UUID studentId = UUID.fromString(authentication.getName());
            List<String> preferredMethods = onboardingService.getPreferredCopingMethods(studentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("preferredMethods", preferredMethods);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/support-contacts")
    public ResponseEntity<?> getSupportContacts(Authentication authentication) {
        try {
            UUID studentId = UUID.fromString(authentication.getName());
            List<OnboardingRequest.SupportContact> contacts = onboardingService.getSupportContacts(studentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("contacts", contacts);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/calming-songs")
    public ResponseEntity<?> getCalmingSongs(Authentication authentication) {
        try {
            UUID studentId = UUID.fromString(authentication.getName());
            List<String> songs = onboardingService.getCalmingSongs(studentId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("songs", songs);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
} 