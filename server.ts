// server.ts - Next.js Standalone + Socket.IO
import { setupSocket } from '@/lib/socket';
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || (dev ? '127.0.0.1' : '0.0.0.0');

// Custom server with Socket.IO integration
async function createCustomServer() {
  try {
    // Create Next.js app
    const nextApp = next({ 
      dev,
      dir: process.cwd(),
      hostname,
      port: typeof port === 'string' ? parseInt(port, 10) : port,
      // In production, use the current directory where .next is located
      conf: dev ? undefined : { distDir: './.next' }
    });

    await nextApp.prepare();
    const handle = nextApp.getRequestHandler();

    // Create HTTP server that will handle both Next.js and Socket.IO
    const server = createServer((req, res) => {
      // Skip socket.io requests from Next.js handler
      if (req.url?.startsWith('/api/socketio')) {
        return;
      }
      handle(req, res);
    });

    // Setup Socket.IO
    const io = new Server(server, {
      path: '/api/socketio',
      cors: {
        origin: dev ? "*" : process.env.ALLOWED_ORIGINS?.split(',') || false,
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    setupSocket(io);

    // Start the server
    const serverPort = typeof port === 'string' ? parseInt(port, 10) : port;
    server.listen(serverPort, hostname, () => {
      console.log(`> Ready on http://${hostname}:${serverPort}`);
      console.log(`> Socket.IO server running at ws://${hostname}:${serverPort}/api/socketio`);
      console.log(`> Environment: ${dev ? 'development' : 'production'}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
}

// Start the server
createCustomServer();
