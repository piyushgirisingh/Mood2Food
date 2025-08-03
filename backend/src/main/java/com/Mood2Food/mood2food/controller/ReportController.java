package com.Mood2Food.mood2food.controller;

import com.Mood2Food.mood2food.entity.Student;
import com.Mood2Food.mood2food.repository.StudentRepository;
import com.Mood2Food.mood2food.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/download/csv")
    public ResponseEntity<String> downloadCSVReport(Authentication authentication) {
        try {
            UUID studentId = UUID.fromString(authentication.getName());
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            String csvContent = reportService.generateCSVReport(student);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", "mood2food_report.csv");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(csvContent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error generating report: " + e.getMessage());
        }
    }

    @GetMapping("/download/pdf")
    public ResponseEntity<byte[]> downloadPDFReport(Authentication authentication) {
        try {
            UUID studentId = UUID.fromString(authentication.getName());
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            byte[] pdfContent = reportService.generatePDFReport(student);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "mood2food_report.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfContent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(("Error generating report: " + e.getMessage()).getBytes());
        }
    }
} 