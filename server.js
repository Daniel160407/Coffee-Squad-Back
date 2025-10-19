import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerSpec from "./src/config/swagger.js";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import geminiRouter from "./src/routes/gemini.routes.js";
import authRouter from "./src/routes/auth.routes.js";
import usersRouter from "./src/routes/users.routes.js";
import workoutRouter from "./src/routes/workout.routes.js";
import foodRouter from "./src/routes/food.routes.js";
import { connectDB } from "./src/config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://localhost:4173",
        "https://coffee-squad-back.onrender.com",
      ];

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/gemini", geminiRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/workouts", workoutRouter);
app.use("/api/food", foodRouter);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "FitFusion API Docs",
  })
);

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
  console.log(
    `API Documentation available at http://localhost:${PORT}/api-docs`
  );
  connectDB();
});
