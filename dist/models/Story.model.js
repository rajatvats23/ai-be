"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ChapterSchema = new mongoose_1.Schema({
    number: { type: Number, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, required: true }
}, { _id: false });
const StorySchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    requestId: { type: String, required: true, unique: true },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    questionnaireData: {
        storyAbout: String,
        gender: String,
        name: String,
        age: String,
        relationship: String,
        nickname: String,
        mainCharacterDescription: mongoose_1.Schema.Types.Mixed,
        storytellerDescription: mongoose_1.Schema.Types.Mixed,
        storyteller: String,
        storytellerNames: String,
        storytellerRelationship: String,
        characterDescription: String,
        backgroundInfo: String,
        hobbies: String,
        specialQualities: String,
        admiration: String,
        feelings: String,
        wishes: String,
        specialStory: String,
        additionalInfo: String
    },
    chapters: [ChapterSchema],
    errorMessage: String,
    completedAt: Date
}, { timestamps: true });
exports.default = mongoose_1.default.model('Story', StorySchema);
