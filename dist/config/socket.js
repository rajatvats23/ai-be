"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || '*',
            methods: ['GET', 'POST'],
            credentials: true
        },
        transports: ['websocket', 'polling'] // Add this - fallback support
    });
    io.on('connection', (socket) => {
        console.log('🔌 Client connected:', socket.id);
        socket.on('join-room', ({ userId }) => {
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
exports.initSocket = initSocket;
const getIO = () => {
    if (!io)
        throw new Error('Socket.io not initialized');
    return io;
};
exports.getIO = getIO;
