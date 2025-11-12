"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callN8nWorkflow = void 0;
const axios_1 = __importDefault(require("axios"));
const callN8nWorkflow = async (payload) => {
    try {
        console.log('📡 Calling n8n workflow...');
        const response = await axios_1.default.post(process.env.N8N_WEBHOOK_URL, {
            requestId: payload.requestId,
            body: payload
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 300000
        });
        console.log('✅ n8n workflow completed');
        return response.data;
    }
    catch (error) {
        console.error('❌ n8n workflow failed:', error.message);
        throw new Error(`n8n workflow failed: ${error.message}`);
    }
};
exports.callN8nWorkflow = callN8nWorkflow;
