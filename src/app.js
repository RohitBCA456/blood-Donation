import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS Configuration
app.use(cors({
  origin: "https://blooddonationdib.netlify.app", // Your frontend URL
  credentials: true, // Allow cookies to be sent with requests
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Accept", "Authorization"], // Allowed headers
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
import userRouter from "./routers/user.route.js";
app.use("/api/v2/users", userRouter);

// Handle OPTIONS requests
app.options("*", cors());

export { app };
