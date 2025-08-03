package com.Mood2Food.mood2food.service;

import com.Mood2Food.mood2food.entity.*;
import com.Mood2Food.mood2food.repository.*;
import com.Mood2Food.mood2food.dto.OnboardingRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private FoodLogRepository foodLogRepository;

    @Autowired
    private CopingToolUsageRepository copingToolUsageRepository;


    @Autowired
    private InsightRepository insightRepository;

    @Autowired
    private TriggerLogRepository triggerLogRepository;

    @Autowired
    private OnboardingService onboardingService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public byte[] generatePDFReport(Student student) throws IOException {
        // For now, return a simple text-based PDF
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        String csvContent = generateCSVReport(student);
        baos.write(csvContent.getBytes());
        return baos.toByteArray();
    }

    public String generateCSVReport(Student student) throws IOException {
        StringWriter writer = new StringWriter();
        CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT);

        // Header
        csvPrinter.printRecord("Mood2Food - Personal Report");
        csvPrinter.printRecord("Generated for:", student.getName(), student.getEmail());
        csvPrinter.printRecord("Generated on:", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        csvPrinter.printRecord();

        // Food Logs
        csvPrinter.printRecord("=== FOOD LOGS ===");
        csvPrinter.printRecord("Date", "Time", "Food", "Meal Type", "Emotion", "Hunger Level", "Satisfaction Level", "Notes");
        
        List<FoodLog> foodLogs = foodLogRepository.findByStudentOrderByEatingTimeDesc(student);
        for (FoodLog log : foodLogs) {
            csvPrinter.printRecord(
                log.getEatingTime().toLocalDate().toString(),
                log.getEatingTime().toLocalTime().toString(),
                log.getFoodItem(),
                log.getMealType(),
                log.getEmotionDescription(),
                log.getHungerLevel(),
                log.getSatisfactionLevel(),
                log.getNotes()
            );
        }
        csvPrinter.printRecord();

        // Coping Tools Usage
        csvPrinter.printRecord("=== COPING TOOLS USAGE ===");
        csvPrinter.printRecord("Date", "Time", "Tool Name", "Duration (minutes)");
        
        List<CopingToolUsage> toolUsage = copingToolUsageRepository.findByStudentOrderByUsedAtDesc(student);
        for (CopingToolUsage usage : toolUsage) {
            csvPrinter.printRecord(
                usage.getUsedAt().toLocalDate().toString(),
                usage.getUsedAt().toLocalTime().toString(),
                usage.getToolName(),
                "N/A"
            );
        }
        csvPrinter.printRecord();

        // Insights
        csvPrinter.printRecord("=== INSIGHTS ===");
        csvPrinter.printRecord("Date", "Time", "Message");
        
        List<Insight> insights = insightRepository.findByStudentOrderByCreatedAtDesc(student);
        for (Insight insight : insights) {
            csvPrinter.printRecord(
                insight.getCreatedAt().toLocalDate().toString(),
                insight.getCreatedAt().toLocalTime().toString(),
                insight.getMessage()
            );
        }
        csvPrinter.printRecord();



        // User Preferences
        csvPrinter.printRecord("=== USER PREFERENCES ===");
        try {
            List<String> preferredMethods = onboardingService.getPreferredCopingMethods(student.getId());
            List<OnboardingRequest.SupportContact> contacts = onboardingService.getSupportContacts(student.getId());
            List<String> songs = onboardingService.getCalmingSongs(student.getId());

            csvPrinter.printRecord("Preferred Coping Methods:", String.join(", ", preferredMethods));
            csvPrinter.printRecord("Support Contacts:", contacts.size() + " contacts");
            csvPrinter.printRecord("Calming Songs:", songs.size() + " songs");
            
            if (!songs.isEmpty()) {
                csvPrinter.printRecord("Songs:", String.join(", ", songs));
            }
        } catch (Exception e) {
            csvPrinter.printRecord("Preferences:", "Not available");
        }

        csvPrinter.close();
        return writer.toString();
    }
} 