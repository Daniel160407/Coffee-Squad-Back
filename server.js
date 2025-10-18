import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerSpec from "./src/config/swagger.js";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import geminiRouter from "./src/routes/gemini.routes.js";
import authRouter from "./src/routes/auth.routes.js"
import usersRouter from "./src/routes/users.routes.js"
import { connectDB } from "./src/config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/gemini", geminiRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "FitFusion API Docs",
  })
);

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  connectDB();
});
