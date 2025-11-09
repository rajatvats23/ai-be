import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  provider: 'google' | 'facebook' | 'twitter' | 'dummy';
  providerId: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    provider: { 
      type: String, 
      enum: ['google', 'facebook', 'twitter', 'dummy'],
      required: true 
    },
    providerId: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);