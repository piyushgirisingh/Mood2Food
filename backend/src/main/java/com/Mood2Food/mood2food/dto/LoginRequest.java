package com.Mood2Food.mood2food.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}