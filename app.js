import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import multer from "multer";
const upload = multer();
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(upload.none());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
import userRouter from "./src/routers/user.route.js";
import { ApiResponse } from "./src/utils/ApiResponse.js";
import { User } from "./src/models/user.js";
import { ApiError } from "./src/utils/apiError.js";

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (Socket) => {
  console.log(`A user connected ${Socket.id}`);

  Socket.on("joinRoom", async ({ donorId, recipientId }, _, res) => {
    const donor = await User.findById(donorId);
    if (!donor) {
      res
        .status(400)
        .json(400, new ApiError(400, "donor not found of this id."));
    }
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      res
        .status(400)
        .json(400, new ApiError(400, "recipient not found of this id."));
    }
    const roomId = `${donorId}-${recipientId}`;
    Socket.join(roomId);
    console.log(`User joined room: ${roomId},`);
  });

  Socket.on("sendMessage", ({ roomId, senderId, message }, _, res) => {
    const payload = { senderId, message, timestamp: new Date() };
    io.to(roomId).emit("receiveMessage", payload);
    console.log(`Message sent to room ${roomId}: ${message}`);
    res
      .status(200)
      .json(200, new ApiResponse(200, payload, "message sent successfully"));
  });

  Socket.on("receiveMessage", (data) => {
    console.log(`Message from ${data.senderId}: ${data.message}`);
  });

  Socket.on("disconnect", () => {
    console.log(`A user disconnected: ${Socket.id}`);
  });
});

app.use("/api/v2/users", userRouter);

export { app, httpServer };
