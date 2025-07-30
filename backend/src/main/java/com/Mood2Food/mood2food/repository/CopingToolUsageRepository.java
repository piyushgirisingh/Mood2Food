package com.Mood2Food.mood2food.repository;

import com.Mood2Food.mood2food.entity.CopingToolUsage;
import com.Mood2Food.mood2food.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CopingToolUsageRepository extends JpaRepository<CopingToolUsage, UUID> {
    List<CopingToolUsage> findByStudentOrderByUsedAtDesc(Student student);
    long countByStudent(Student student);
}