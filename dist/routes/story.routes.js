"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const story_controller_1 = require("../controllers/story.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
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
router.post('/create', upload_middleware_1.upload.fields([
    { name: 'mainCharacterImages', maxCount: 10 },
    { name: 'storytellerImages', maxCount: 10 }
]), story_controller_1.createStory);
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
router.get('/:requestId', story_controller_1.getStory);
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
router.get('/user/:userId', story_controller_1.getUserStories);
exports.default = router;
