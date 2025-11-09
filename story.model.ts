import mongoose, { Schema, Document } from 'mongoose';
import { QuestionnaireData, Chapter } from './types';

export interface IStory extends Document {
  userId: mongoose.Types.ObjectId;
  requestId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  questionnaireData: QuestionnaireData;
  chapters?: Chapter[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const ChapterSchema = new Schema({
  number: { type: Number, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true }
}, { _id: false });

const StorySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
      mainCharacterImages: [String],
      storyteller: String,
      storytellerNames: String,
      storytellerRelationship: String,
      characterDescription: String,
      storytellerImages: [String],
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
    completedAt: Date
  },
  { timestamps: true }
);

export default mongoose.model<IStory>('Story', StorySchema);