package com.Mood2Food.mood2food.service;

import com.Mood2Food.mood2food.entity.Student;
import com.Mood2Food.mood2food.repository.TriggerLogRepository;
import com.Mood2Food.mood2food.repository.CopingToolUsageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {
    @Autowired
    private TriggerLogRepository triggerLogRepository;
    @Autowired
    private CopingToolUsageRepository copingToolUsageRepository;

    public Map<String, Object> getDashboardData(Student student) {
        Map<String, Object> data = new HashMap<>();
        // TODO: Add logic for trends, frequent triggers, streaks, etc.
        data.put("totalLogs", triggerLogRepository.count());
        data.put("totalToolUsages", copingToolUsageRepository.count());
        return data;
    }
}