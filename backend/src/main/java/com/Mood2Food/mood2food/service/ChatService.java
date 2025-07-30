package com.Mood2Food.mood2food.service;

import com.Mood2Food.mood2food.entity.ChatMessage;
import com.Mood2Food.mood2food.entity.Student;
import com.Mood2Food.mood2food.repository.ChatMessageRepository;
import com.Mood2Food.mood2food.service.FoodInsightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import io.github.cdimascio.dotenv.Dotenv;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@Service
public class ChatService {
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    
    @Autowired
    private FoodInsightService foodInsightService;

    private static final Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

    @Value("${ml.backend.url:http://localhost:10000/classify-emotion}")
    private String mlApiUrl;

    @Value("${openai.api.key:}")
    private String openaiApiKey;

    @Value("${openai.api.url:}")
    private String openaiApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final Map<String, List<String>> emotionReplies = Map.of(
    "joy", List.of(
        "I'm glad you're feeling happy! I noticed you might have celebrated with food - that's totally normal. Let's explore healthier ways to celebrate that don't rely on eating.",
        "That's wonderful that you're feeling good! If this joy led to eating, let's discuss building non-food celebration habits that can be just as rewarding.",
        "I love your positive energy! Sometimes when we're happy, we use food to enhance the feeling. What other activities bring you joy besides eating?"
    ),
    "sadness", List.of(
        "I hear you're feeling down, and emotional eating when sad is very common. You're brave for recognizing this. Let's find healthier ways to comfort yourself.",
        "Sadness can often lead us to seek comfort in food. What's been troubling you? Together, we can identify better coping strategies that truly help.",
        "I'm here to support you. Before reaching for food when sad, try taking 3 deep breaths. What healthy activities usually help lift your spirits?"
    ),
    "fear", List.of(
        "Anxiety often triggers eating as a way to feel in control. You're not alone. Let's identify what's causing this stress and find better ways to manage it.",
        "I understand that fear can make us turn to food for comfort. What's been worrying you? Let's work on some healthy coping strategies together.",
        "Stress eating is a common response to fear. Take a moment to breathe. What's one healthy activity that usually helps calm your nerves?"
    ),
    "anger", List.of(
        "Anger can be a strong trigger for emotional eating. I'm proud of you for recognizing this emotion. Let's channel this energy positively instead of turning to food.",
        "Feeling frustrated often leads to stress eating. Before reaching for food, try a quick walk or some deep breathing. What's been making you angry?",
        "I can sense your frustration. Anger-eating is common, but let's find healthier outlets for these intense emotions that truly help you feel better."
    ),
    "love", List.of(
        "It's beautiful that you're feeling loved! If you celebrated with food, remember that true joy doesn't need food to be complete. How else do you like to express love?",
        "Love and connection are wonderful! Food often brings people together, but let's explore ways to connect that nourish your soul without overeating.",
        "That warm feeling is amazing! If you're tempted to eat to enhance this happiness, try calling someone you love or doing something creative instead."
    ),
    "surprise", List.of(
        "Unexpected events can trigger emotional eating as we seek comfort. How are you processing this surprise? Let's talk through it instead of eating through it.",
        "Surprises can be overwhelming and might make us reach for food to cope. What healthy activities help you when feeling unsettled?",
        "That caught you off guard! Big emotions often trigger eating. Before eating, try journaling about this experience or talking it through with someone."
    ),
    "neutral", List.of(
        "I'm here to support you on your emotional eating journey. How are your eating patterns today? Any triggers or victories you'd like to share?",
        "Thanks for checking in! How are you feeling about your relationship with food today? I'm here to help you identify patterns and build healthier habits.",
        "I'm glad you're here. Whether you're struggling with emotional eating or celebrating progress, I'm here to listen and support you. What's on your mind?"
    )
);

private String getDynamicReply(String emotion) {
    List<String> replies = emotionReplies.getOrDefault(
        emotion.toLowerCase(),
        List.of("I'm here for you. Want to talk more about it?")
    );
    int index = (int) (Math.random() * replies.size());
    return replies.get(index);
}

private String getOpenAIReply(String userMessage, String emotion, double confidence) {
    try {
        String apiKey = dotenv.get("OPENAI_API_KEY", openaiApiKey);
        String apiUrl = dotenv.get("OPENAI_API_URL", openaiApiUrl);
        
        if (apiKey == null || apiKey.isEmpty() || apiUrl == null || apiUrl.isEmpty()) {
            return null; // Fall back to emotion-based replies
        }

        // Create emotion-aware prompt
        String systemPrompt = String.format(
            "You are an emotional eating support specialist for the Mood2Food app. The user is experiencing '%s' emotion with %.1f%% confidence. " +
            "Your role: Help users identify emotional eating patterns, provide healthier coping strategies, and offer encouragement. " +
            "If they mention food/eating: Address the emotional trigger and suggest alternatives. " +
            "If they're celebrating: Suggest non-food ways to celebrate. " +
            "If they're stressed/sad: Offer comfort strategies that don't involve food. " +
            "Always be empathetic, non-judgmental, and focus on building awareness of eating patterns. " +
            "Keep responses under 100 words and actionable.",
            emotion, confidence
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);

        Map<String, Object> message1 = new HashMap<>();
        message1.put("role", "system");
        message1.put("content", systemPrompt);

        Map<String, Object> message2 = new HashMap<>();
        message2.put("role", "user");
        message2.put("content", userMessage);

        List<Map<String, Object>> messages = List.of(message1, message2);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4");
        requestBody.put("messages", messages);
        requestBody.put("max_tokens", 150);
        requestBody.put("temperature", 0.7);

        String jsonBody = objectMapper.writeValueAsString(requestBody);
        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            Map<String, Object> jsonResponse = objectMapper.readValue(response.getBody(), Map.class);
            List<Map<String, Object>> choices = (List<Map<String, Object>>) jsonResponse.get("choices");
            
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> firstChoice = choices.get(0);
                Map<String, Object> message = (Map<String, Object>) firstChoice.get("message");
                String content = (String) message.get("content");
                return content != null ? content.trim() : null;
            }
        }
        
        return null; // Fall back to emotion-based replies
        
    } catch (Exception e) {
        System.err.println("OpenAI API error: " + e.getMessage());
        return null; // Fall back to emotion-based replies
    }
}

    public ChatMessage saveMessage(ChatMessage message) {
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getChatHistory(Student student) {
        return chatMessageRepository.findByStudentOrderByTimestampAsc(student);
    }

    public String getBotReply(String userMessage, Student student) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Get recent chat history for context
        List<ChatMessage> recentHistory = chatMessageRepository
            .findTop10ByStudentOrderByTimestampDesc(student);
        
        // Get food log insights for personalized context
        Map<String, Object> foodInsights = foodInsightService.getRecentFoodInsights(student);
        
        // Build conversation context
        List<Map<String, String>> conversationHistory = new ArrayList<>();
        for (ChatMessage msg : recentHistory) {
            Map<String, String> historyItem = new HashMap<>();
            historyItem.put("sender", msg.getSender());
            historyItem.put("message", msg.getMessage());
            historyItem.put("timestamp", msg.getTimestamp().toString());
            conversationHistory.add(historyItem);
        }

        java.util.Map<String, Object> body = new java.util.HashMap<>();
        body.put("reason", userMessage);
        body.put("user_id", student.getId().toString());
        body.put("conversation_history", conversationHistory);
        body.put("food_insights", foodInsights);

        try {
            String jsonBody = objectMapper.writeValueAsString(body);
            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

            String url = dotenv.get("ML_BACKEND_URL", mlApiUrl);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                java.util.Map<String, Object> jsonResponse = objectMapper.readValue(
                        response.getBody(), java.util.Map.class);

                String emotion = jsonResponse.getOrDefault("emotion", "unknown").toString();
                String insight = jsonResponse.getOrDefault("insight", "").toString();
                double confidence = Double.parseDouble(jsonResponse.getOrDefault("confidence", "0").toString());

                // Use the GPT-4 response from ML service (insight field)
                if (insight != null && !insight.isEmpty()) {
                    return insight;  // ✅ Return the context-aware GPT-4 response!
                }
                
                // Fallback to hardcoded responses only if ML service insight is empty
                String smartReply = getDynamicReply(emotion);
                return smartReply;

            } else {
                return "Sorry, I'm having trouble processing that right now.";
            }

        } catch (Exception e) {
            return "Oops! Something went wrong while talking to my brain (ML server).";
        }
    }

    public Map<String, Object> getUserPatterns(Student student) {
        try {
            String url = dotenv.get("ML_BACKEND_URL", mlApiUrl).replace("/classify-emotion", 
                "/user-patterns/" + student.getId().toString());
            
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                return objectMapper.readValue(response.getBody(), Map.class);
            } else {
                Map<String, Object> fallback = new HashMap<>();
                fallback.put("error", "Unable to retrieve patterns at this time");
                return fallback;
            }
            
        } catch (Exception e) {
            System.err.println("Error getting user patterns: " + e.getMessage());
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("error", "Pattern analysis unavailable");
            return fallback;
        }
    }
}