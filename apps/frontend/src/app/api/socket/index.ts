import { Server as HttpServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";
import { Socket } from "net"; // important

// No need for global 'io' if you don't use it later
// let io: IOServer | null = null;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket) {
    res.status(500).end("No socket available");
    return;
  }

  const socket = res.socket as Socket & { server: HttpServer & { io?: IOServer } };

  if (!socket.server.io) {
    console.log("New Socket.io server...");
    const ioServer = new IOServer(socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    socket.server.io = ioServer;
  }

  res.end();
}
