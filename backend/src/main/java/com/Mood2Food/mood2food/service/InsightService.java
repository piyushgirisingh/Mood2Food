package com.Mood2Food.mood2food.service;

import com.Mood2Food.mood2food.entity.Insight;
import com.Mood2Food.mood2food.entity.Student;
import com.Mood2Food.mood2food.repository.InsightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InsightService {
    @Autowired
    private InsightRepository insightRepository;

    public Insight saveInsight(Insight insight) {
        return insightRepository.save(insight);
    }

    public Insight getLatestInsightForUser(Student student) {
        return insightRepository.findFirstByStudentOrderByCreatedAtDesc(student);
    }

    public List<Insight> getAllInsightsForUser(Student student) {
        return insightRepository.findByStudentOrderByCreatedAtDesc(student);
    }
}