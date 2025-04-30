import { Server } from "socket.io";
import http from "http";

class SocketService {
  private _io: Server;

  constructor(server: http.Server) {
    console.log("Init socket service");

    this._io = new Server(server, {
      cors: {
        origin: "*", // Replace with frontend URL in production
        methods: ["GET", "POST"],
      },
    });

    this._io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("joinUserRoom", (userId: string) => {
        socket.join(userId);
        console.log(`Socket ${socket.id} joined user room: ${userId}`);
      });

      socket.on("orderStatusUpdated", ({ orderId, status, customerId }) => {
        this._io.to(customerId).emit("orderStatusUpdated", { orderId, status });
      });

      // socket.on("disconnect", () => {
      //   console.log("Client disconnected:", socket.id);
      // });
    });
  }

  get io() {
    return this._io;
  }
}

let socketService: SocketService;

export const initSocket = (server: http.Server) => {
  socketService = new SocketService(server);
  return socketService;
};

export const getSocket = () => {
  if (!socketService) {
    throw new Error("SocketService not initialized");
  }
  return socketService.io;
};
