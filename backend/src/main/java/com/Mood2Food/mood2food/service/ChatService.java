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
import java.util.Map;
import java.util.HashMap;

@Service
public class ChatService {
    @Autowired
    private ChatMessageRepository chatMessageRepository;

    private static final Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

    @Value("${ml.backend.url:http://localhost:10000/classify-emotion}")
    private String mlApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final Map<String, List<String>> emotionReplies = Map.of(
    "joy", List.of(
        "You're glowing today! Let’s log your win 🌟",
        "Feeling good? That’s worth celebrating with a smile (not just snacks 😄)",
        "Happiness suits you. Want to share what made you smile?"
    ),
    "sadness", List.of(
        "It’s okay to feel this way. Want to reflect on what triggered it?",
        "Feeling down is valid — would journaling help?",
        "Let's talk it out. I'm here for you. 💙"
    ),
    "fear", List.of(
        "Anxious? Want to try a grounding technique together?",
        "You’re safe here. Let’s slow things down. 🌿",
        "Let’s breathe through this moment — one step at a time."
    ),
    "anger", List.of(
        "Want to vent it here or try a quick stretch to ease it out?",
        "Anger is powerful — let’s channel it into something helpful.",
        "Take a breath. I'm listening if you need to talk."
    ),
    "love", List.of(
        "Feeling loved? Amazing — want to write a gratitude note?",
        "Let’s keep that warm feeling going ✨",
        "Relationships matter. Want to reflect on a happy memory?"
    ),
    "surprise", List.of(
        "Unexpected things can stir big feelings. Want to reflect?",
        "Was that a good surprise or a stressful one?",
        "Let’s pause and unpack that together."
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
        body.put("reason", userMessage); // Your Flask model expects this key

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

                // Smart chatbot reply logic based on emotion
                String smartReply = getDynamicReply(emotion);

                // Return the reply, optionally including the insight if present
                return smartReply + (insight.isEmpty() ? "" : "\n\n" + insight);


            } else {
                return "Sorry, I'm having trouble processing that right now.";
            }

        } catch (Exception e) {
            return "Oops! Something went wrong while talking to my brain (ML server).";
        }

    }
}