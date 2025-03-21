import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: "https://blooddonationdib.netlify.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
import userRouter from "./routers/user.route.js";

app.use("/api/v2/users", userRouter);

export { app };
