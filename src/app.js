import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3002",
      "https://d5cnvsgq-3001.inc1.devtunnels.ms",
      "https://chat-bot-umber-rho.vercel.app/",
      "https://vinita-ai.vercel.app/",
    ],
    credentials: true,
    expoexposedHeaders: ["x-guest-id"],
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.set("view engine", "ejs");

// Router imports

import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);

app.use("/", (req, res) => {
  res.send({
    success: true,
    message: "Server is running",
  });
});

export { app };
