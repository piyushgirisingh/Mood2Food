package com.Mood2Food.mood2food.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;

public class DotenvInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext context) {
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        // Set all necessary .env variables as system properties (with null checks)
        setPropertyIfNotNull("DB_URL", dotenv.get("DB_URL"));
        setPropertyIfNotNull("DB_USERNAME", dotenv.get("DB_USERNAME"));
        setPropertyIfNotNull("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
        setPropertyIfNotNull("JWT_SECRET", dotenv.get("JWT_SECRET"));
        setPropertyIfNotNull("JWT_EXPIRATION", dotenv.get("JWT_EXPIRATION"));
        setPropertyIfNotNull("ML_BACKEND_URL", dotenv.get("ML_BACKEND_URL"));
        setPropertyIfNotNull("OPENAI_API_KEY", dotenv.get("OPENAI_API_KEY"));
        setPropertyIfNotNull("OPENAI_API_URL", dotenv.get("OPENAI_API_URL"));
    }

    private void setPropertyIfNotNull(String key, String value) {
        if (value != null) {
            System.setProperty(key, value);
        } else {
            System.out.println("Warning: Environment variable " + key + " is null or missing");
        }

    }
}
