import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FitFusion API",
      version: "1.0.0",
      description: "AI-Powered Adaptive Fitness Coach API Documentation",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        // ============================================
        // USER SCHEMA
        // ============================================
        User: {
          type: "object",
          required: ["name", "email", "password", "fitnessGoal"],
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            name: {
              type: "string",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            age: {
              type: "number",
              minimum: 13,
              maximum: 120,
              example: 28,
            },
            gender: {
              type: "string",
              enum: ["male", "female", "other", "prefer-not-to-say"],
              example: "male",
            },
            height: {
              type: "object",
              properties: {
                value: { type: "number", example: 175 },
                unit: { type: "string", enum: ["cm", "inches"], example: "cm" },
              },
            },
            currentWeight: {
              type: "object",
              properties: {
                value: { type: "number", example: 80 },
                unit: { type: "string", enum: ["kg", "lbs"], example: "kg" },
              },
            },
            targetWeight: {
              type: "object",
              properties: {
                value: { type: "number", example: 75 },
                unit: { type: "string", enum: ["kg", "lbs"], example: "kg" },
              },
            },
            fitnessGoal: {
              type: "string",
              enum: [
                "fat-loss",
                "muscle-gain",
                "endurance",
                "general-fitness",
                "athletic-performance",
              ],
              example: "muscle-gain",
            },
            activityLevel: {
              type: "string",
              enum: [
                "sedentary",
                "lightly-active",
                "moderately-active",
                "very-active",
                "extremely-active",
              ],
              example: "moderately-active",
            },
            availableEquipment: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "dumbbells",
                  "barbell",
                  "kettlebell",
                  "resistance-bands",
                  "pull-up-bar",
                  "bench",
                  "cardio-machine",
                  "bodyweight-only",
                ],
              },
              example: ["dumbbells", "barbell", "bench"],
            },
            dietaryPreference: {
              type: "string",
              enum: [
                "balanced",
                "vegan",
                "vegetarian",
                "keto",
                "paleo",
                "low-carb",
                "high-protein",
              ],
              example: "balanced",
            },
            profilePicture: {
              type: "string",
              nullable: true,
              example:
                "https://res.cloudinary.com/fitfusion/image/upload/v1234567890/profile.jpg",
            },
            currentStreak: {
              type: "number",
              example: 7,
            },
            longestStreak: {
              type: "number",
              example: 30,
            },
            badges: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", example: "7-Day Streak" },
                  earnedAt: { type: "string", format: "date-time" },
                  icon: { type: "string", example: "🔥" },
                },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // ============================================
        // WORKOUT SCHEMA
        // ============================================
        Exercise: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Barbell Bench Press",
            },
            sets: {
              type: "number",
              example: 4,
            },
            reps: {
              type: "number",
              example: 10,
            },
            duration: {
              type: "number",
              description: "Duration in seconds",
              example: 120,
            },
            weight: {
              type: "object",
              properties: {
                value: { type: "number", example: 60 },
                unit: { type: "string", example: "kg" },
              },
            },
            restTime: {
              type: "number",
              description: "Rest time in seconds",
              example: 90,
            },
            notes: {
              type: "string",
              example: "Focus on form",
            },
            difficulty: {
              type: "string",
              enum: ["easy", "medium", "hard"],
              example: "medium",
            },
          },
        },

        Workout: {
          type: "object",
          required: ["userId", "type", "title", "totalDuration"],
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            userId: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            date: {
              type: "string",
              format: "date-time",
            },
            type: {
              type: "string",
              enum: [
                "strength",
                "cardio",
                "hiit",
                "flexibility",
                "sports",
                "mixed",
              ],
              example: "strength",
            },
            title: {
              type: "string",
              example: "Upper Body Strength Training",
            },
            exercises: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Exercise",
              },
            },
            totalDuration: {
              type: "number",
              description: "Duration in minutes",
              example: 60,
            },
            caloriesBurned: {
              type: "number",
              example: 450,
            },
            intensity: {
              type: "string",
              enum: ["low", "moderate", "high", "extreme"],
              example: "moderate",
            },
            mood: {
              type: "string",
              enum: ["excellent", "good", "okay", "tired", "exhausted"],
              example: "good",
            },
            notes: {
              type: "string",
              example: "Great workout today!",
            },
            isCompleted: {
              type: "boolean",
              example: true,
            },
            aiGenerated: {
              type: "boolean",
              example: true,
            },
            performanceScore: {
              type: "number",
              minimum: 0,
              maximum: 100,
              example: 85,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // ============================================
        // MEAL SCHEMA
        // ============================================
        Food: {
          type: "object",
          properties: {
            name: { type: "string", example: "Chicken Breast" },
            quantity: { type: "number", example: 200 },
            unit: { type: "string", example: "grams" },
          },
        },

        Meal: {
          type: "object",
          required: ["userId", "mealType", "name", "calories"],
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            userId: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            date: {
              type: "string",
              format: "date-time",
            },
            mealType: {
              type: "string",
              enum: ["breakfast", "lunch", "dinner", "snack"],
              example: "lunch",
            },
            name: {
              type: "string",
              example: "Grilled Chicken Salad",
            },
            foods: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Food",
              },
            },
            calories: {
              type: "number",
              example: 450,
            },
            macros: {
              type: "object",
              properties: {
                protein: { type: "number", example: 45 },
                carbs: { type: "number", example: 30 },
                fats: { type: "number", example: 15 },
              },
            },
            micronutrients: {
              type: "object",
              properties: {
                fiber: { type: "number", example: 8 },
                sugar: { type: "number", example: 5 },
                sodium: { type: "number", example: 400 },
                cholesterol: { type: "number", example: 75 },
              },
            },
            imageUrl: {
              type: "string",
              nullable: true,
              example:
                "https://res.cloudinary.com/fitfusion/image/upload/v1234567890/meal.jpg",
            },
            recipeUrl: {
              type: "string",
              nullable: true,
              example: "https://spoonacular.com/recipe/12345",
            },
            aiGenerated: {
              type: "boolean",
              example: true,
            },
            notes: {
              type: "string",
              example: "Delicious and healthy!",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // ============================================
        // PROGRESS SCHEMA
        // ============================================
        Progress: {
          type: "object",
          required: ["userId"],
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            userId: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            date: {
              type: "string",
              format: "date-time",
            },
            weight: {
              type: "object",
              properties: {
                value: { type: "number", example: 78.5 },
                unit: { type: "string", enum: ["kg", "lbs"], example: "kg" },
              },
            },
            bodyFatPercentage: {
              type: "number",
              example: 15.5,
            },
            measurements: {
              type: "object",
              properties: {
                chest: { type: "number", example: 100 },
                waist: { type: "number", example: 85 },
                hips: { type: "number", example: 95 },
                thighs: { type: "number", example: 60 },
                arms: { type: "number", example: 38 },
                unit: { type: "string", enum: ["cm", "inches"], example: "cm" },
              },
            },
            photos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  url: { type: "string" },
                  type: { type: "string", enum: ["front", "side", "back"] },
                  uploadedAt: { type: "string", format: "date-time" },
                },
              },
            },
            strengthBenchmarks: {
              type: "object",
              properties: {
                benchPress: { type: "number", example: 80 },
                squat: { type: "number", example: 100 },
                deadlift: { type: "number", example: 120 },
                pullUps: { type: "number", example: 12 },
                pushUps: { type: "number", example: 40 },
              },
            },
            cardioMetrics: {
              type: "object",
              properties: {
                restingHeartRate: { type: "number", example: 60 },
                vo2Max: { type: "number", example: 45 },
                runningPace: { type: "number", example: 5.5 },
              },
            },
            notes: {
              type: "string",
              example: "Feeling stronger this week",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // ============================================
        // AI INSIGHT SCHEMA
        // ============================================
        AIInsight: {
          type: "object",
          required: ["userId", "insightType", "title", "summary"],
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            userId: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            date: {
              type: "string",
              format: "date-time",
            },
            insightType: {
              type: "string",
              enum: [
                "daily-summary",
                "weekly-summary",
                "monthly-summary",
                "performance-analysis",
                "nutrition-feedback",
                "recommendation",
              ],
              example: "weekly-summary",
            },
            title: {
              type: "string",
              example: "Weekly Performance Summary",
            },
            summary: {
              type: "string",
              example:
                "Great progress this week! Your endurance improved by 12%.",
            },
            details: {
              type: "object",
              description: "Flexible structure for various insights",
            },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string", example: "workout" },
                  text: {
                    type: "string",
                    example: "Consider adding more cardio sessions",
                  },
                  priority: {
                    type: "string",
                    enum: ["low", "medium", "high"],
                    example: "medium",
                  },
                },
              },
            },
            dataSnapshot: {
              type: "object",
              properties: {
                totalWorkouts: { type: "number", example: 5 },
                totalCaloriesBurned: { type: "number", example: 2500 },
                totalCaloriesConsumed: { type: "number", example: 12000 },
                averageReadinessScore: { type: "number", example: 78 },
                performanceChange: { type: "number", example: 12 },
              },
            },
            aiModel: {
              type: "string",
              example: "gpt-4",
            },
            isRead: {
              type: "boolean",
              example: false,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // ============================================
        // READINESS SCORE SCHEMA
        // ============================================
        ReadinessScore: {
          type: "object",
          required: ["userId", "overallScore", "recommendation"],
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            userId: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            date: {
              type: "string",
              format: "date-time",
            },
            overallScore: {
              type: "number",
              minimum: 0,
              maximum: 100,
              example: 78,
            },
            factors: {
              type: "object",
              properties: {
                sleepQuality: {
                  type: "object",
                  properties: {
                    score: {
                      type: "number",
                      minimum: 0,
                      maximum: 100,
                      example: 85,
                    },
                    hoursSlept: { type: "number", example: 7.5 },
                    notes: { type: "string", example: "Good quality sleep" },
                  },
                },
                muscleRecovery: {
                  type: "object",
                  properties: {
                    score: {
                      type: "number",
                      minimum: 0,
                      maximum: 100,
                      example: 70,
                    },
                    soreness: {
                      type: "string",
                      enum: ["none", "mild", "moderate", "severe"],
                      example: "mild",
                    },
                  },
                },
                nutritionBalance: {
                  type: "object",
                  properties: {
                    score: {
                      type: "number",
                      minimum: 0,
                      maximum: 100,
                      example: 80,
                    },
                    calorieDeficitSurplus: { type: "number", example: -200 },
                    hydrationLevel: {
                      type: "string",
                      enum: ["poor", "fair", "good", "excellent"],
                      example: "good",
                    },
                  },
                },
                stressLevel: {
                  type: "object",
                  properties: {
                    score: {
                      type: "number",
                      minimum: 0,
                      maximum: 100,
                      example: 75,
                    },
                    rating: {
                      type: "string",
                      enum: ["low", "moderate", "high", "very-high"],
                      example: "moderate",
                    },
                  },
                },
                recentWorkloadIntensity: {
                  type: "object",
                  properties: {
                    score: {
                      type: "number",
                      minimum: 0,
                      maximum: 100,
                      example: 72,
                    },
                    lastSevenDaysVolume: { type: "number", example: 300 },
                  },
                },
              },
            },
            recommendation: {
              type: "string",
              enum: [
                "full-intensity",
                "moderate-intensity",
                "light-activity",
                "rest-day",
              ],
              example: "moderate-intensity",
            },
            injuryRiskLevel: {
              type: "string",
              enum: ["low", "moderate", "high"],
              example: "low",
            },
            mlPrediction: {
              type: "object",
              properties: {
                fatigueLevel: { type: "number", example: 35 },
                performancePotential: { type: "number", example: 78 },
                modelVersion: { type: "string", example: "v1.0" },
              },
            },
            userFeedback: {
              type: "object",
              properties: {
                feltAccurate: { type: "boolean", example: true },
                actualPerformance: { type: "string", example: "Good workout" },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        // ============================================
        // COMMON RESPONSE SCHEMAS
        // ============================================
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "An error occurred",
            },
            error: {
              type: "string",
              example: "Detailed error message",
            },
          },
        },

        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation successful",
            },
            data: {
              type: "object",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/routes/*.js", // for CommonJS
    "./src/routes/**/*.js", // catches all nested routes
    "./src/controllers/*.js",
  ], // Path to API docs
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;