"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const story_controller_1 = require("../controllers/story.controller");
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
router.post('/create', story_controller_1.createStory);
router.get('/:requestId', story_controller_1.getStory);
router.get('/user/:userId', story_controller_1.getUserStories);
exports.default = router;
