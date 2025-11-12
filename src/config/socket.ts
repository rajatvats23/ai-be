import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server;

export const initSocket = (server: HTTPServer): Server => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']  // Add this - fallback support
  });

  io.on('connection', (socket: Socket) => {
    console.log('🔌 Client connected:', socket.id);

    socket.on('join-room', ({ userId }: { userId: string }) => {
      socket.join(userId);
      console.log(`👤 User ${userId} joined room`);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });

    // Add error handler
    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};