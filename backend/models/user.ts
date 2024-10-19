// backend/models/user.ts

import { Schema, model } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  surname: string;
  email: string;
}

const userSchema = new Schema<IUser>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

export const User = model<IUser>('User', userSchema);