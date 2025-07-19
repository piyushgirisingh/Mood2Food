package com.Mood2Food.mood2food.service;

import com.Mood2Food.mood2food.entity.CopingToolUsage;
import com.Mood2Food.mood2food.entity.Student;
import com.Mood2Food.mood2food.repository.CopingToolUsageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CopingToolService {
    @Autowired
    private CopingToolUsageRepository copingToolUsageRepository;

    public CopingToolUsage logUsage(CopingToolUsage usage) {
        return copingToolUsageRepository.save(usage);
    }

    public List<CopingToolUsage> getUsageHistoryForUser(Student student) {
        return copingToolUsageRepository.findByStudentOrderByUsedAtDesc(student);
    }
}