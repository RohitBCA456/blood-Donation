import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: "https://blooddonationdib.netlify.app", // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow the HTTP methods you use
    credentials: true, // Allow cookies and credentials
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
import userRouter from "./routers/user.route.js";

app.use("/api/v2/users", userRouter);

export { app };
