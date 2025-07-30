package com.Mood2Food.mood2food.repository;

import com.Mood2Food.mood2food.entity.TriggerLog;
import com.Mood2Food.mood2food.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TriggerLogRepository extends JpaRepository<TriggerLog, UUID> {
    List<TriggerLog> findByStudentId(UUID studentId);
    long countByStudent(Student student);
}
