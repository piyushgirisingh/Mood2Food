package com.Mood2Food.mood2food.repository;

import com.Mood2Food.mood2food.entity.Insight;
import com.Mood2Food.mood2food.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Repository;

@Repository
public interface InsightRepository extends JpaRepository<Insight, UUID> {
    List<Insight> findByStudentOrderByCreatedAtDesc(Student student);

    Insight findFirstByStudentOrderByCreatedAtDesc(Student student);
    
    long countByStudent(Student student);
}