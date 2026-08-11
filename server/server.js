import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import vivaRoutes from "./routes/vivaRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import usageRoutes from "./routes/usageRoute.js";

dotenv.config();

console.log(
  "GEMINI_API_KEY loaded:",
  Boolean(process.env.GEMINI_API_KEY)
);

console.log(
  "GEMINI_API_KEY length:",
  process.env.GEMINI_API_KEY
    ? process.env.GEMINI_API_KEY.length
    : 0
);

const app = express();

/* =========================================================
   CORS
========================================================= */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ai-defense-simulator.vercel.app",
    ],
    credentials: true,
  })
);

/* =========================================================
   BODY PARSING
========================================================= */

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "VivaAI server is running.",
  });
});

/* =========================================================
   VIVA ROUTES
========================================================= */

app.use("/api/viva", vivaRoutes);

/* =========================================================
   UPLOAD ROUTES
========================================================= */

app.use("/api/upload", uploadRoutes);

/* =========================================================
   TOKEN USAGE ROUTES
========================================================= */

app.use("/api/usage", usageRoutes);

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use((error, req, res, next) => {
  console.error("Server Error:", error);

  res.status(500).json({
    success: false,
    message:
      error?.message ||
      "Internal server error.",
  });
});

/* =========================================================
   START SERVER
========================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("");
  console.log("========================================");
  console.log("       VivaAI Backend Server");
  console.log("========================================");
  console.log(`Server: http://localhost:${PORT}`);
  console.log(
    `Health: http://localhost:${PORT}/api/health`
  );
  console.log(
    `Usage:  http://localhost:${PORT}/api/usage`
  );
  console.log("Token usage tracking enabled.");
  console.log("Monthly token limit: 100000");
  console.log("========================================");
  console.log("");
});