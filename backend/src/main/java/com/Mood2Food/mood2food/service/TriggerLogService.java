package com.Mood2Food.mood2food.service;

import com.Mood2Food.mood2food.repository.TriggerLogRepository;
import com.Mood2Food.mood2food.repository.StudentRepository;
import com.Mood2Food.mood2food.entity.Student;
import com.Mood2Food.mood2food.entity.TriggerLog;
import com.Mood2Food.mood2food.dto.TriggerLogRequest;
import com.Mood2Food.mood2food.dto.TriggerLogResponse;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TriggerLogService {

    private final TriggerLogRepository triggerLogRepository;
    private final StudentRepository studentRepository;

    public TriggerLogService(TriggerLogRepository triggerLogRepository, StudentRepository studentRepository) {
        this.triggerLogRepository = triggerLogRepository;
        this.studentRepository = studentRepository;
    }

    public void saveTriggerLog(UUID studentId, TriggerLogRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        TriggerLog log = new TriggerLog();
        log.setEmotion(request.emotion());
        log.setSituation(request.situation());
        log.setIntensity(request.intensity());
        log.setStudent(student);

        triggerLogRepository.save(log);
    }

    public List<TriggerLogResponse> getLogsByStudent(UUID studentId) {
        return triggerLogRepository.findByStudentId(studentId).stream()
                .map(log -> new TriggerLogResponse(
                        log.getId(),
                        log.getEmotion(),
                        log.getSituation(),
                        log.getIntensity(),
                        log.getTimestamp()))
                .toList();
    }
}
