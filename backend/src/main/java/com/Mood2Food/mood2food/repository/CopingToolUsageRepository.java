package com.Mood2Food.mood2food.repository;

import com.Mood2Food.mood2food.entity.CopingToolUsage;
import com.Mood2Food.mood2food.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Repository;

@Repository
public interface CopingToolUsageRepository extends JpaRepository<CopingToolUsage, UUID> {
    List<CopingToolUsage> findByStudentOrderByUsedAtDesc(Student student);
    long countByStudent(Student student);
    
    // Count coping tool usage for a student within a date range
    @Query("SELECT COUNT(ctu) FROM CopingToolUsage ctu WHERE ctu.student = :student AND ctu.usedAt BETWEEN :startDate AND :endDate")
    long countByStudentAndCreatedAtBetween(@Param("student") Student student, 
                                         @Param("startDate") LocalDateTime startDate, 
                                         @Param("endDate") LocalDateTime endDate);
}