const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "https://video-conferencing-project.vercel.app", // Frontend URL
    methods: ["GET", "POST"],
  },
  transports: ["websocket"], // WebSocket transport
});

// Middleware
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Join Room
  socket.on("join-room", (roomId, userId) => {
    console.log(`User ${userId} joined room ${roomId}`);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);
  });

  // Toggle Audio
  socket.on("user-toggle-audio", (userId, roomId) => {
    socket.broadcast.to(roomId).emit("user-toggle-audio", userId);
  });

  // Toggle Video
  socket.on("user-toggle-video", (userId, roomId) => {
    socket.broadcast.to(roomId).emit("user-toggle-video", userId);
  });

  // Leave Room
  socket.on("user-leave", (userId, roomId) => {
    socket.broadcast.to(roomId).emit("user-leave", userId);
  });

  // Handle Disconnect
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
