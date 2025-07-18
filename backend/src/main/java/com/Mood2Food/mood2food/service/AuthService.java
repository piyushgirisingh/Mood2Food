package com.Mood2Food.mood2food.service;

import com.Mood2Food.mood2food.dto.AuthResponse;
import com.Mood2Food.mood2food.dto.LoginRequest;
import com.Mood2Food.mood2food.dto.SignupRequest;
import com.Mood2Food.mood2food.entity.Student;
import com.Mood2Food.mood2food.exception.AuthException;
import com.Mood2Food.mood2food.repository.StudentRepository;
import com.Mood2Food.mood2food.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse signup(SignupRequest request) {
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new AuthException("Email already exists");
        }

        Student student = new Student();
        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setPassword(passwordEncoder.encode(request.getPassword()));

        Student savedStudent = studentRepository.save(student);
        String token = jwtUtil.generateToken(savedStudent.getId(), savedStudent.getEmail());

        return new AuthResponse(token, "User registered successfully");
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        Student student = studentRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthException("User not found"));

        String token = jwtUtil.generateToken(student.getId(), student.getEmail());

        return new AuthResponse(token, "Login successful");
    }
}