export interface QuestionnaireData {
  storyAbout: string;
  gender: string;
  name: string;
  age: string;
  relationship: string;
  nickname?: string;
  mainCharacterImages: string[];
  storyteller: string;
  storytellerNames: string;
  storytellerRelationship: string;
  characterDescription: string;
  storytellerImages: string[];
  backgroundInfo?: string;
  hobbies?: string;
  specialQualities?: string;
  admiration?: string;
  feelings?: string;
  wishes?: string;
  specialStory?: string;
  additionalInfo?: string;
}

export interface Chapter {
  number: number;
  content: string;
  imageUrl: string;
}

export interface N8nResponse {
  requestId: string;
  status: 'completed' | 'failed';
  chapters: Chapter[];
}