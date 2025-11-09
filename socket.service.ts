import { getIO } from '../config/socket';
import { Chapter } from '../types';

export const emitStoryComplete = (
  userId: string,
  requestId: string,
  chapters: Chapter[]
): void => {
  try {
    const io = getIO();
    io.to(userId).emit('story-complete', {
      requestId,
      chapters
    });
    console.log(`📤 Emitted story-complete event to user ${userId}`);
  } catch (error) {
    console.error('❌ Failed to emit socket event:', error);
  }
};

export const emitStoryFailed = (
  userId: string,
  requestId: string,
  error: string
): void => {
  try {
    const io = getIO();
    io.to(userId).emit('story-failed', {
      requestId,
      error
    });
    console.log(`📤 Emitted story-failed event to user ${userId}`);
  } catch (err) {
    console.error('❌ Failed to emit socket event:', err);
  }
};