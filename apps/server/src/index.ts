import http from "http";
import socketService from "./services/socket";

async function startServer() {

  const httpServer = http.createServer();


  socketService.io.attach(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const PORT = process.env.PORT ? process.env.PORT : 8000;

  httpServer.listen(PORT, () => {
    console.log(`HTTP server started at PORT;${PORT}`);
  });
}

startServer();
