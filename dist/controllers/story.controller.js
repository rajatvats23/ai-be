"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserStories = exports.getStory = exports.createStory = void 0;
const uuid_1 = require("uuid");
const Story_model_1 = __importDefault(require("../models/Story.model"));
const s3_service_1 = require("../services/s3.service");
const n8n_service_1 = require("../services/n8n.service");
const socket_service_1 = require("../services/socket.service");
const createStory = async (req, res) => {
    try {
        const { userId, questionnaireData } = req.body;
        const files = req.files;
        if (!userId || !questionnaireData) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }
        const requestId = (0, uuid_1.v4)();
        console.log(`📝 Creating story: ${requestId}`);
        const mainCharacterImageUrls = await (0, s3_service_1.uploadCharacterImages)(files.mainCharacterImages || [], requestId, 'main');
        const storytellerImageUrls = await (0, s3_service_1.uploadCharacterImages)(files.storytellerImages || [], requestId, 'storyteller');
        console.log(`✅ Uploaded ${mainCharacterImageUrls.length + storytellerImageUrls.length} images`);
        const story = new Story_model_1.default({
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
        (0, n8n_service_1.callN8nWorkflow)({
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
            (0, socket_service_1.emitStoryComplete)(userId, requestId, n8nResponse.chapters);
        })
            .catch(async (error) => {
            story.status = 'failed';
            await story.save();
            (0, socket_service_1.emitStoryFailed)(userId, requestId, error.message);
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create story',
            error: error.message
        });
    }
};
exports.createStory = createStory;
const getStory = async (req, res) => {
    try {
        const { requestId } = req.params;
        const story = await Story_model_1.default.findOne({ requestId });
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch story',
            error: error.message
        });
    }
};
exports.getStory = getStory;
const getUserStories = async (req, res) => {
    try {
        const { userId } = req.params;
        const stories = await Story_model_1.default.find({ userId })
            .sort({ createdAt: -1 })
            .select('requestId status createdAt completedAt');
        res.json({ success: true, stories });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stories',
            error: error.message
        });
    }
};
exports.getUserStories = getUserStories;
