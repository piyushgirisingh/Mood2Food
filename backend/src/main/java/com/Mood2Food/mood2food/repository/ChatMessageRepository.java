package com.Mood2Food.mood2food.repository;

import com.Mood2Food.mood2food.entity.ChatMessage;
import com.Mood2Food.mood2food.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    List<ChatMessage> findByStudentOrderByTimestampAsc(Student student);
    List<ChatMessage> findTop10ByStudentOrderByTimestampDesc(Student student);
    long countByStudent(Student student);
}