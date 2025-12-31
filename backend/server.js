import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/common/errorHandler.js";
import connectDB from "./utils/db.js";
import indexRoute from "./router/index.route.js";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./SocketIO/socket.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
connectDB();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

// Socket initialization
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://bus-tracker-s3sn.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initSocket(io);

app.use("/", indexRoute);

// common error handler
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
