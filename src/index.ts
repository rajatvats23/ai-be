import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { initSocket } from './config/socket';
import storyRoutes from './routes/story.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import healthRoutes from './routes/health.routes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/health', healthRoutes);
app.use('/api/story', storyRoutes);  // Only once!

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const startServer = async () => {
  try {
    await connectDB();
    initSocket(httpServer);
    
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Socket.io initialized`);
      console.log(`🌐 CORS: ${process.env.FRONTEND_URL || '*'}`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Startup failed:', error);
    process.exit(1);
  }
};

startServer();