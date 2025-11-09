import axios from 'axios';
import { QuestionnaireData, N8nResponse } from '../types';

export const callN8nWorkflow = async (
  payload: QuestionnaireData & { requestId: string }
): Promise<N8nResponse> => {
  try {
    console.log('📡 Calling n8n workflow...');
    
    const response = await axios.post(
      process.env.N8N_WEBHOOK_URL!,
      {
        requestId: payload.requestId,
        body: payload
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 300000
      }
    );

    console.log('✅ n8n workflow completed');
    return response.data;
  } catch (error: any) {
    console.error('❌ n8n workflow failed:', error.message);
    throw new Error(`n8n workflow failed: ${error.message}`);
  }
};