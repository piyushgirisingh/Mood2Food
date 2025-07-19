package com.Mood2Food.mood2food.entity;

import jakarta.persistence.*;
import java.util.UUID;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Entity
public class CopingToolUsage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private Student student;

    @Column(nullable = false)
    private String toolName;

    @Column(nullable = false)
    private LocalDateTime usedAt = LocalDateTime.now();

    public void setStudent(Student student) {
        this.student = student;
    }
}