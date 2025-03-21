import express from "express";
import cookieParser from "cookie-parser";

const app = express();

// CORS Configuration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://blooddonationdib.netlify.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
import userRouter from "./routers/user.route.js";
app.use("/api/v2/users", userRouter);

export { app };
