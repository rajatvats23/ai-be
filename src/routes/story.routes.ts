import { Router } from 'express';
import { createStory, getStory, getUserStories } from '../controllers/story.controller';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

/**
 * @swagger
 * /api/story/create:
 *   post:
 *     summary: Create a new story
 *     tags: [Story]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - questionnaireData
 *               - mainCharacterImages
 *               - storytellerImages
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               questionnaireData:
 *                 type: string
 *                 description: JSON stringified questionnaire data
 *               mainCharacterImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               storytellerImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Story generation started
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 requestId:
 *                   type: string
 *                 message:
 *                   type: string
 *                 status:
 *                   type: string
 */
router.post(
  '/create',
  upload.fields([
    { name: 'mainCharacterImages', maxCount: 10 },
    { name: 'storytellerImages', maxCount: 10 }
  ]),
  createStory
);

/**
 * @swagger
 * /api/story/{requestId}:
 *   get:
 *     summary: Get story by requestId
 *     tags: [Story]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story details
 *       404:
 *         description: Story not found
 */
router.get('/:requestId', getStory);

/**
 * @swagger
 * /api/story/user/{userId}:
 *   get:
 *     summary: Get all stories for a user
 *     tags: [Story]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user stories
 */
router.get('/user/:userId', getUserStories);

export default router;