import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Story from '../models/Story.model';
import { uploadCharacterImages } from '../services/s3.service';
import { callN8nWorkflow } from '../services/n8n.service';
import { emitStoryComplete, emitStoryFailed } from '../services/socket.service';

export const createStory = async (req: Request, res: Response) => {
  try {
    const { userId, questionnaireData } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if (!userId || !questionnaireData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    const requestId = uuidv4();
    console.log(`📝 Creating story: ${requestId}`);

    const mainCharacterImageUrls = await uploadCharacterImages(
      files.mainCharacterImages || [],
      requestId,
      'main'
    );
    
    const storytellerImageUrls = await uploadCharacterImages(
      files.storytellerImages || [],
      requestId,
      'storyteller'
    );

    console.log(`✅ Uploaded ${mainCharacterImageUrls.length + storytellerImageUrls.length} images`);

    const story = new Story({
      userId,
      requestId,
      status: 'processing',
      questionnaireData: {
        ...JSON.parse(questionnaireData),
        mainCharacterImages: mainCharacterImageUrls,
        storytellerImages: storytellerImageUrls
      }
    });
    await story.save();

    res.json({
      success: true,
      requestId,
      message: 'Story generation started',
      status: 'processing'
    });

    callN8nWorkflow({
      requestId,
      ...JSON.parse(questionnaireData),
      mainCharacterImages: mainCharacterImageUrls,
      storytellerImages: storytellerImageUrls
    })
      .then(async (n8nResponse) => {
        story.status = 'completed';
        story.chapters = n8nResponse.chapters;
        story.completedAt = new Date();
        await story.save();
        emitStoryComplete(userId, requestId, n8nResponse.chapters);
      })
      .catch(async (error) => {
        story.status = 'failed';
        await story.save();
        emitStoryFailed(userId, requestId, error.message);
      });

  } catch (error: any) {
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
        createdAt: story.createdAt,
        completedAt: story.completedAt
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
      .select('requestId status createdAt completedAt');

    res.json({ success: true, stories });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stories',
      error: error.message
    });
  }
};