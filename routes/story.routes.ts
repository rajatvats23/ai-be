import { Router } from 'express';
import { createStory, getStory, getUserStories } from '../controllers/story.controller';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.post(
  '/create',
  upload.fields([
    { name: 'mainCharacterImages', maxCount: 10 },
    { name: 'storytellerImages', maxCount: 10 }
  ]),
  createStory
);

router.get('/:requestId', getStory);
router.get('/user/:userId', getUserStories);

export default router;