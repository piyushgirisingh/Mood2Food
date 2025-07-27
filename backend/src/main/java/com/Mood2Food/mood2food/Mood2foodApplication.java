package com.Mood2Food.mood2food;

import com.Mood2Food.mood2food.config.DotenvInitializer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Mood2foodApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(Mood2foodApplication.class);
		app.addInitializers(new DotenvInitializer()); // ✅ Load .env early
		app.run(args);
	}
}
