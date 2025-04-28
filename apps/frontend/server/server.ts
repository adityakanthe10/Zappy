import { Server } from "socket.io";

let io: Server;

import { Server as HttpServer } from "http";

export function initSocket(server: HttpServer) {
  if (!io) {
    io = new Server(server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
  }
  return io;
}

export function getSocket() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}
