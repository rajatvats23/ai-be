"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const socket_1 = require("./config/socket");
const story_routes_1 = __importDefault(require("./routes/story.routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.use('/api/story', story_routes_1.default);
app.use('/api/story', story_routes_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
const startServer = async () => {
    try {
        await (0, database_1.connectDB)();
        (0, socket_1.initSocket)(httpServer);
        httpServer.listen(PORT, () => {
            console.log(`🚀 Server on port ${PORT}`);
            console.log(`📡 Socket.io initialized`); // Add this line
            console.log(`🌐 CORS: ${process.env.FRONTEND_URL}`);
        });
    }
    catch (error) {
        console.error('❌ Startup failed:', error);
        process.exit(1);
    }
};
startServer();
