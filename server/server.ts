import { createServer } from 'http';           // HTTP server to handle requests
import next from 'next';                      // Next.js module
import { Server as SocketIoServer } from 'socket.io'; // Socket.IO server for real-time communication
import cors from 'cors';                      // CORS middleware

const dev = process.env.NODE_ENV !== 'production';  // Check if we are in development mode
const app = next({ dev });                  // Create a Next.js app instance
const handle = app.getRequestHandler();    // Get the Next.js request handler

// Wait for Next.js to be prepared
app.prepare().then(() => {
  // Create HTTP server that will serve Next.js pages
  const server = createServer((req, res) => {
    handle(req, res);  // Forward the request to Next.js handler
  });

  // Create Socket.IO server and attach it to HTTP server
  const io = new SocketIoServer(server, {
    cors: {
      origin: "*",  // Allow all origins (for development, adjust in production)
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true
    }
  });

  // Handle new socket connections
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for an event where the order status is updated
    socket.on('orderStatusUpdated', (data) => {
      console.log('Order status updated:', data);
      // Emit updated order status to all connected clients
      io.emit('orderStatusUpdated', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  // Start server on port 3000
  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
