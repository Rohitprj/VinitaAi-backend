import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "https://chat-bot-umber-rho.vercel.app",
      "https://www.askvinitasri.com",
    ],
    credentials: true,
    exposedHeaders: ["x-guest-id"],
  })
);

app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.set("view engine", "ejs");

app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});

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
