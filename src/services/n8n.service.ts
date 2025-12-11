import axios from 'axios';
import { QuestionnaireData, N8nResponse } from '../types';

export const callN8nWorkflow = async (
  payload: QuestionnaireData & { requestId: string }
): Promise<N8nResponse> => {
  try {
    console.log('📡 Calling n8n workflow...');
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));
    
    const response = await axios.post(
      process.env.N8N_WEBHOOK_URL!,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 600000 // 10 minutes for image generation
      }
    );

    console.log('✅ n8n workflow completed');
    console.log('📦 Response:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error: any) {
    console.error('❌ n8n workflow failed:', error.message);
    if (error.response) {
      console.error('📦 Error response:', JSON.stringify(error.response.data, null, 2));
    }
    throw new Error(`n8n workflow failed: ${error.message}`);
  }
};