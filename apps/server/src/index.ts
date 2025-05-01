// Import HTTP module and initSocket function from the socket service
import http from "http";
import { initSocket } from "./services/socket";

// Start the HTTP + WebSocket server
async function startServer() {
  // Create a basic HTTP server
  const httpServer = http.createServer();

  // Initialize socket server on top of the HTTP server
  initSocket(httpServer);

  // Define the port (from .env or default to 8000)
  const PORT = process.env.NEXT_PUBLIC_WS_URL || 8000;

  // Start listening on the port
  httpServer.listen(PORT, () => {
    console.log(`HTTP server started at PORT: ${PORT}`);
  });
}

// Invoke the function to start the server
startServer();
