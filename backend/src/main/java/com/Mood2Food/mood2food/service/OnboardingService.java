package com.Mood2Food.mood2food.service;

import com.Mood2Food.mood2food.dto.OnboardingRequest;
import com.Mood2Food.mood2food.entity.Student;
import com.Mood2Food.mood2food.repository.StudentRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class OnboardingService {

    @Autowired
    private StudentRepository studentRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public void completeOnboarding(UUID studentId, OnboardingRequest request) throws JsonProcessingException {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Convert lists to JSON strings for storage
        student.setPreferredMealTimes(objectMapper.writeValueAsString(request.getPreferredMealTimes()));
        student.setEmotionalEatingFrequency(request.getEmotionalEatingFrequency());
        student.setStressTriggers(objectMapper.writeValueAsString(request.getStressTriggers()));
        student.setComfortFoods(objectMapper.writeValueAsString(request.getComfortFoods()));
        student.setPreferredCopingMethods(objectMapper.writeValueAsString(request.getPreferredCopingMethods()));
        student.setSupportContacts(objectMapper.writeValueAsString(request.getSupportContacts()));
        student.setCalmingSongs(objectMapper.writeValueAsString(request.getCalmingSongs()));
        student.setPreferredActivities(objectMapper.writeValueAsString(request.getPreferredActivities()));
        student.setOnboardingCompleted(true);

        studentRepository.save(student);
    }

    public boolean isOnboardingCompleted(UUID studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return student.getOnboardingCompleted();
    }

    public List<String> getPreferredCopingMethods(UUID studentId) throws JsonProcessingException {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        if (student.getPreferredCopingMethods() == null) {
            return List.of(); // Return empty list if no preferences set
        }
        
        return objectMapper.readValue(student.getPreferredCopingMethods(), 
                objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
    }

    public List<OnboardingRequest.SupportContact> getSupportContacts(UUID studentId) throws JsonProcessingException {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        if (student.getSupportContacts() == null) {
            return List.of();
        }
        
        return objectMapper.readValue(student.getSupportContacts(), 
                objectMapper.getTypeFactory().constructCollectionType(List.class, OnboardingRequest.SupportContact.class));
    }

    public List<String> getCalmingSongs(UUID studentId) throws JsonProcessingException {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        if (student.getCalmingSongs() == null) {
            return List.of();
        }
        
        return objectMapper.readValue(student.getCalmingSongs(), 
                objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
    }
} 