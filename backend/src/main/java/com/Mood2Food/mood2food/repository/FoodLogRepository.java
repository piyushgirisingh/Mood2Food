package com.Mood2Food.mood2food.repository;

import com.Mood2Food.mood2food.entity.FoodLog;
import com.Mood2Food.mood2food.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface FoodLogRepository extends JpaRepository<FoodLog, UUID> {
    
    // Find all food logs for a student
    List<FoodLog> findByStudentOrderByEatingTimeDesc(Student student);
    
    // Find food logs for a student on a specific date
    @Query("SELECT fl FROM FoodLog fl WHERE fl.student = :student AND DATE(fl.eatingTime) = :date ORDER BY fl.eatingTime DESC")
    List<FoodLog> findByStudentAndDate(@Param("student") Student student, @Param("date") LocalDate date);
    
    // Find food logs for a student within a date range
    @Query("SELECT fl FROM FoodLog fl WHERE fl.student = :student AND fl.eatingTime BETWEEN :startDate AND :endDate ORDER BY fl.eatingTime DESC")
    List<FoodLog> findByStudentAndDateRange(@Param("student") Student student, 
                                          @Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);
    
    // Find food logs by meal type for a student
    List<FoodLog> findByStudentAndMealTypeOrderByEatingTimeDesc(Student student, String mealType);
    
    // Find food logs by emotion for a student
    List<FoodLog> findByStudentAndEmotionDescriptionOrderByEatingTimeDesc(Student student, String emotionDescription);
    
    // Find recent food logs (last 7 days)
    @Query("SELECT fl FROM FoodLog fl WHERE fl.student = :student AND fl.eatingTime >= :weekAgo ORDER BY fl.eatingTime DESC")
    List<FoodLog> findRecentFoodLogs(@Param("student") Student student, @Param("weekAgo") LocalDateTime weekAgo);
    
    // Count food logs for a student
    long countByStudent(Student student);
    
    // Count food logs for a student on a specific date
    @Query("SELECT COUNT(fl) FROM FoodLog fl WHERE fl.student = :student AND DATE(fl.eatingTime) = :date")
    long countByStudentAndDate(@Param("student") Student student, @Param("date") LocalDate date);
    
    // Find most common emotions for a student
    @Query("SELECT fl.emotionDescription, COUNT(fl) FROM FoodLog fl WHERE fl.student = :student GROUP BY fl.emotionDescription ORDER BY COUNT(fl) DESC")
    List<Object[]> findMostCommonEmotions(@Param("student") Student student);
    
    // Find most common meal types for a student
    @Query("SELECT fl.mealType, COUNT(fl) FROM FoodLog fl WHERE fl.student = :student GROUP BY fl.mealType ORDER BY COUNT(fl) DESC")
    List<Object[]> findMostCommonMealTypes(@Param("student") Student student);
    
    // Find average hunger and satisfaction levels for a student
    @Query("SELECT AVG(fl.hungerLevel), AVG(fl.satisfactionLevel) FROM FoodLog fl WHERE fl.student = :student")
    Object[] findAverageLevels(@Param("student") Student student);
    
    // Find food logs with high satisfaction (8-10) for a student
    @Query("SELECT fl FROM FoodLog fl WHERE fl.student = :student AND fl.satisfactionLevel >= 8 ORDER BY fl.eatingTime DESC")
    List<FoodLog> findHighSatisfactionLogs(@Param("student") Student student);
    
    // Find food logs with low satisfaction (1-3) for a student
    @Query("SELECT fl FROM FoodLog fl WHERE fl.student = :student AND fl.satisfactionLevel <= 3 ORDER BY fl.eatingTime DESC")
    List<FoodLog> findLowSatisfactionLogs(@Param("student") Student student);
    
    // Find emotional eating patterns (high hunger but low satisfaction)
    @Query("SELECT fl FROM FoodLog fl WHERE fl.student = :student AND fl.hungerLevel >= 7 AND fl.satisfactionLevel <= 5 ORDER BY fl.eatingTime DESC")
    List<FoodLog> findEmotionalEatingPatterns(@Param("student") Student student);
    
    // Count food logs for a student within a date range
    @Query("SELECT COUNT(fl) FROM FoodLog fl WHERE fl.student = :student AND fl.eatingTime BETWEEN :startDate AND :endDate")
    long countByStudentAndCreatedAtBetween(@Param("student") Student student, 
                                         @Param("startDate") LocalDateTime startDate, 
                                         @Param("endDate") LocalDateTime endDate);
} 