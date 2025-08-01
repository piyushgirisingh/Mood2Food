const axios = require('axios');

// Test the food log API
async function testFoodLogAPI() {
  try {
    const testData = {
      foodItem: "Test Food",
      quantity: "1 serving",
      mealType: "snack",
      eatingTime: "2025-01-30T10:30",
      emotionEmoji: "😊",
      emotionDescription: "happy",
      hungerLevel: 5,
      satisfactionLevel: 7,
      location: "Home",
      company: "Alone",
      notes: "Test food log"
    };

    console.log("Testing food log API with data:", testData);

    const response = await axios.post('http://localhost:8080/api/food-logs', testData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // You'll need a real token
      }
    });

    console.log("Success:", response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

testFoodLogAPI(); 