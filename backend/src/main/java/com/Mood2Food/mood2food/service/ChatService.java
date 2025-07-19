package com.Mood2Food.mood2food.service;

import com.Mood2Food.mood2food.entity.ChatMessage;
import com.Mood2Food.mood2food.entity.Student;
import com.Mood2Food.mood2food.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import io.github.cdimascio.dotenv.Dotenv;

@Service
public class ChatService {
    @Autowired
    private ChatMessageRepository chatMessageRepository;

    private static final Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

    @Value("${ml.backend.url:http://localhost:5000/predict}")
    private String mlApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ChatMessage saveMessage(ChatMessage message) {
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getChatHistory(Student student) {
        return chatMessageRepository.findByStudentOrderByTimestampAsc(student);
    }

    public String getBotReply(String userMessage) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        java.util.Map<String, String> body = new java.util.HashMap<>();
        body.put("message", userMessage);

        try {
            String jsonBody = objectMapper.writeValueAsString(body);
            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

            String url = dotenv.get("ML_BACKEND_URL", mlApiUrl);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                java.util.Map<String, Object> jsonResponse = objectMapper.readValue(response.getBody(),
                        java.util.Map.class);
                return jsonResponse.getOrDefault("reply", "Sorry, I didn't understand that.").toString();
            } else {
                return "Sorry, I'm having trouble processing that right now.";
            }
        } catch (Exception e) {
            return "Oops! Something went wrong while talking to my brain (ML server).";
        }
    }
}