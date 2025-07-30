package com.Mood2Food.mood2food.controller;

import com.Mood2Food.mood2food.dto.ChatMessageRequest;
import com.Mood2Food.mood2food.dto.ChatMessageResponse;
import com.Mood2Food.mood2food.entity.ChatMessage;
import com.Mood2Food.mood2food.entity.Student;
import com.Mood2Food.mood2food.repository.StudentRepository;
import com.Mood2Food.mood2food.service.ChatService;
import com.Mood2Food.mood2food.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Map;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    @Autowired
    private ChatService chatService;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private RestTemplate restTemplate;
    private static final String mlBackendUrl = "http://localhost:10000"; // ML backend URL

    @PostMapping("/message")
    public ResponseEntity<ChatMessageResponse> sendMessage(@RequestHeader("Authorization") String token,
            @RequestBody ChatMessageRequest request) {
        UUID userId = jwtUtil.extractUserId(token.substring(7));
        Optional<Student> studentOpt = studentRepository.findById(userId);
        if (studentOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Student student = studentOpt.get();

        // Save user message
        ChatMessage userMsg = new ChatMessage();
        userMsg.setStudent(student);
        userMsg.setSender("USER");
        userMsg.setMessage(request.getMessage());
        chatService.saveMessage(userMsg);

        // Call ML backend with user message, student context, and chat history
        String botReply = chatService.getBotReply(request.getMessage(), student);

        // Save bot message
        ChatMessage botMsg = new ChatMessage();
        botMsg.setStudent(student);
        botMsg.setSender("BOT");
        botMsg.setMessage(botReply);
        chatService.saveMessage(botMsg);

        ChatMessageResponse response = new ChatMessageResponse();
        response.setReply(botReply);
        response.setTimestamp(botMsg.getTimestamp());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatMessageResponse>> getChatHistory(@RequestHeader("Authorization") String token) {
        UUID userId = jwtUtil.extractUserId(token.substring(7));
        Optional<Student> studentOpt = studentRepository.findById(userId);
        if (studentOpt.isEmpty())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Student student = studentOpt.get();
        List<ChatMessage> history = chatService.getChatHistory(student);
        List<ChatMessageResponse> responses = history.stream().map(msg -> {
            ChatMessageResponse r = new ChatMessageResponse();
            r.setReply(msg.getSender() + ": " + msg.getMessage());
            r.setTimestamp(msg.getTimestamp());
            return r;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/patterns")
    public ResponseEntity<?> getUserPatterns(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String userEmail = jwtUtil.extractEmail(jwt);
            Student student = studentRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String patternsUrl = mlBackendUrl + "/user-patterns/" + student.getId();
            ResponseEntity<String> response = restTemplate.getForEntity(patternsUrl, String.class);
            
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching user patterns: " + e.getMessage());
        }
    }

    @PostMapping("/feedback")
    public ResponseEntity<?> collectFeedback(@RequestHeader("Authorization") String token, 
                                          @RequestBody Map<String, Object> feedbackRequest) {
        try {
            String jwt = token.substring(7);
            String userEmail = jwtUtil.extractEmail(jwt);
            Student student = studentRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Add user_id to the request
            feedbackRequest.put("user_id", student.getId().toString());
            
            String feedbackUrl = mlBackendUrl + "/feedback";
            ResponseEntity<String> response = restTemplate.postForEntity(feedbackUrl, feedbackRequest, String.class);
            
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error collecting feedback: " + e.getMessage());
        }
    }

    @GetMapping("/learning-stats")
    public ResponseEntity<?> getLearningStats(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String userEmail = jwtUtil.extractEmail(jwt);
            Student student = studentRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String statsUrl = mlBackendUrl + "/learning-stats/" + student.getId();
            ResponseEntity<String> response = restTemplate.getForEntity(statsUrl, String.class);
            
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching learning stats: " + e.getMessage());
        }
    }
}