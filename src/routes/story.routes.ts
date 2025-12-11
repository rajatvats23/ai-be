import { Router } from 'express';
import { createStory, getStory, getUserStories } from '../controllers/story.controller';

const router = Router();

/**
 * @swagger
 * /api/story/create:
 *   post:
 *     summary: Create a new personalized storybook
 *     tags: [Story]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - questionnaireData
 *             properties:
 *               userId:
 *                 type: string
 *               questionnaireData:
 *                 type: object
 *                 properties:
 *                   storyAbout:
 *                     type: string
 *                   name:
 *                     type: string
 *                   age:
 *                     type: string
 *                   gender:
 *                     type: string
 *                   mainCharacterDescription:
 *                     type: object
 *                   storytellerDescription:
 *                     type: object
 *     responses:
 *       200:
 *         description: Story generation started
 */
router.post('/create', createStory);

router.get('/:requestId', getStory);
router.get('/user/:userId', getUserStories);

export default router;