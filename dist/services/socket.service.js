"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitStoryFailed = exports.emitStoryComplete = void 0;
const socket_1 = require("../config/socket");
const emitStoryComplete = (userId, requestId, chapters) => {
    try {
        const io = (0, socket_1.getIO)();
        io.to(userId).emit('story-complete', {
            requestId,
            chapters
        });
        console.log(`📤 Story complete event → user ${userId}`);
    }
    catch (error) {
        console.error('❌ Socket emit failed:', error);
    }
};
exports.emitStoryComplete = emitStoryComplete;
const emitStoryFailed = (userId, requestId, error) => {
    try {
        const io = (0, socket_1.getIO)();
        io.to(userId).emit('story-failed', {
            requestId,
            error
        });
        console.log(`📤 Story failed event → user ${userId}`);
    }
    catch (err) {
        console.error('❌ Socket emit failed:', err);
    }
};
exports.emitStoryFailed = emitStoryFailed;
