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
 *     summary: Create a new personalized storybook
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
 *                 description: MongoDB User ID
 *                 example: "507f1f77bcf86cd799439011"
 *               questionnaireData:
 *                 type: string
 *                 description: |
 *                   JSON stringified object with the following structure:
 *                   {
 *                     "storyAbout": "Who the story is about",
 *                     "name": "Character's name",
 *                     "age": "Character's age",
 *                     "gender": "male/female/other",
 *                     "relationship": "daughter/son/friend etc",
 *                     "nickname": "Optional nickname",
 *                     "characterDescription": "Physical and personality traits",
 *                     "storyteller": "Who is narrating",
 *                     "storytellerNames": "Storyteller's name",
 *                     "storytellerRelationship": "father/mother/friend etc",
 *                     "backgroundInfo": "Optional background context",
 *                     "hobbies": "Optional hobbies/interests",
 *                     "specialQualities": "Optional special traits",
 *                     "admiration": "Optional what you admire",
 *                     "feelings": "Optional feelings to express",
 *                     "wishes": "Optional wishes for them",
 *                     "specialStory": "Optional specific story to include",
 *                     "additionalInfo": "Optional extra details"
 *                   }
 *                 example: '{"name":"Emma","age":"3","gender":"female","relationship":"daughter"}'
 *               mainCharacterImages:
 *                 type: string
 *                 format: binary
 *                 description: Single image of main character (max 10MB, jpg/png)
 *               storytellerImages:
 *                 type: string
 *                 format: binary
 *                 description: Single image of storyteller (max 10MB, jpg/png)
 *     responses:
 *       200:
 *         description: Story generation started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 requestId:
 *                   type: string
 *                   description: Unique ID to track story generation
 *                 message:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [processing]
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post('/create', upload_middleware_1.upload.fields([
    { name: 'mainCharacterImages', maxCount: 1 }, // Changed to 1
    { name: 'storytellerImages', maxCount: 1 } // Changed to 1
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
