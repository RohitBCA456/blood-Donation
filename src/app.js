import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express(); 

const allowedOrigins = ["https://blooddonationdib.netlify.app"];
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) { // Allow requests from allowed origins or Postman (no origin)
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specific HTTP methods
  allowedHeaders: ["Content-Type", "Accept"], // Allow these headers
  credentials: true // Allow cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
import userRouter from "./routers/user.route.js";

app.use("/api/v2/users", userRouter);

export { app };
