import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { Env } from "./config/env.config";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

let io: Server;

export const initSocket = async (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: Env.FRONTEND_ORIGIN,
      credentials: true,
    },
  });

  if (Env.REDIS_URL) {
    console.log("Connecting Socket.io to Redis:", Env.REDIS_URL);
    const pubClient = createClient({ url: Env.REDIS_URL });
    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) => console.log('Redis Pub Client Error', err));
    subClient.on('error', (err) => console.log('Redis Sub Client Error', err));

    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
  } else {
    console.log("No REDIS_URL provided, falling back to local memory adapter for Socket.io");
  }

  io.on("connection", (socket) => {
    console.log(`User connected to WS: ${socket.id}`);

    // If you implement a specific room per user:
    socket.on("join_user_room", (userId: string) => {
      socket.join(`user_${userId}`);
      console.log(`User ${socket.id} joined room user_${userId}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected from WS: ${socket.id}`);
    });
  });

  return io;
};

export const getSocketIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
};
