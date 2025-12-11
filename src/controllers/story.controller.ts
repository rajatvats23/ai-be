import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Story from '../models/Story.model';
import { callN8nWorkflow } from '../services/n8n.service';
import { emitStoryComplete, emitStoryFailed } from '../services/socket.service';

export const createStory = async (req: Request, res: Response) => {
  try {
    console.log('📥 Received story creation request');
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));

    const { userId, questionnaireData } = req.body;
    
    if (!userId) {
      console.log('❌ Missing userId');
      return res.status(400).json({ 
        success: false, 
        message: 'Missing userId' 
      });
    }

    if (!questionnaireData) {
      console.log('❌ Missing questionnaireData');
      return res.status(400).json({ 
        success: false, 
        message: 'Missing questionnaireData' 
      });
    }

    console.log('✅ UserId:', userId);
    console.log('✅ QuestionnaireData keys:', Object.keys(questionnaireData));

    // Validate descriptions exist
    if (!questionnaireData.mainCharacterDescription) {
      console.log('❌ Missing mainCharacterDescription');
      return res.status(400).json({
        success: false,
        message: 'Main character description required'
      });
    }

    if (!questionnaireData.storytellerDescription) {
      console.log('❌ Missing storytellerDescription');
      return res.status(400).json({
        success: false,
        message: 'Storyteller description required'
      });
    }

    const requestId = uuidv4();
    console.log(`📝 Creating story with requestId: ${requestId}`);

    // Save to database
    const story = new Story({
      userId,
      requestId,
      status: 'processing',
      questionnaireData
    });
    
    console.log('💾 Saving to database...');
    await story.save();
    console.log('✅ Saved to database');

    // Respond immediately
    console.log('📤 Sending immediate response to client');
    res.json({
      success: true,
      requestId,
      message: 'Story generation started',
      status: 'processing'
    });

    // Call n8n asynchronously
    console.log('🚀 Starting n8n workflow call (async)');
    callN8nWorkflow({
      requestId,
      ...questionnaireData
    })
      .then(async (n8nResponse) => {
        console.log(`✅ Story complete: ${requestId}`);
        console.log('📦 n8n Response:', JSON.stringify(n8nResponse, null, 2));
        
        story.status = 'completed';
        story.chapters = n8nResponse.chapters;
        story.completedAt = new Date();
        await story.save();
        
        console.log('💾 Updated database with chapters');
        console.log('📤 Emitting story-complete event to user:', userId);
        
        emitStoryComplete(userId, requestId, n8nResponse.chapters);
      })
      .catch(async (error) => {
        console.error(`❌ Story generation failed: ${requestId}`);
        console.error('❌ Error:', error);
        
        story.status = 'failed';
        story.errorMessage = error.message;
        await story.save();
        
        console.log('📤 Emitting story-failed event to user:', userId);
        emitStoryFailed(userId, requestId, error.message);
      });

  } catch (error: any) {
    console.error('❌ Create story error:', error);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to create story',
      error: error.message
    });
  }
};

export const getStory = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const story = await Story.findOne({ requestId });
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    res.json({
      success: true,
      story: {
        requestId: story.requestId,
        status: story.status,
        chapters: story.chapters,
        questionnaireData: story.questionnaireData,
        createdAt: story.createdAt,
        completedAt: story.completedAt,
        errorMessage: story.errorMessage
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch story',
      error: error.message
    });
  }
};

export const getUserStories = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const stories = await Story.find({ userId })
      .sort({ createdAt: -1 })
      .select('requestId status createdAt completedAt questionnaireData.name');

    res.json({ 
      success: true, 
      stories: stories.map(s => ({
        requestId: s.requestId,
        status: s.status,
        characterName: s.questionnaireData?.name || 'Unknown',
        createdAt: s.createdAt,
        completedAt: s.completedAt
      }))
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stories',
      error: error.message
    });
  }
};