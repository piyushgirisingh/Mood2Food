package com.Mood2Food.mood2food.repository;

import com.Mood2Food.mood2food.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface StudentRepository extends JpaRepository<Student, UUID> {
    Optional<Student> findByEmail(String email);

    boolean existsByEmail(String email);
}