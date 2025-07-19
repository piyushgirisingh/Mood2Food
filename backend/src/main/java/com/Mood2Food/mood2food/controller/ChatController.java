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

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    @Autowired
    private ChatService chatService;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private JwtUtil jwtUtil;

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

        // Call ML backend with user message and get bot reply
        String botReply = chatService.getBotReply(request.getMessage());

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
}