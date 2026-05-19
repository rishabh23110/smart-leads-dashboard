import mongoose, { Schema, HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/index.js';

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['admin', 'sales'], default: 'sales' },
  },
  { timestamps: true }
);

// Use async function without next — Mongoose 5+ supports returning Promises in hooks
UserSchema.pre(
  'save',
  { document: true, query: false },
  async function (this: HydratedDocument<IUser>) {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
);

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, (this as IUser).password);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
UserSchema.set('toJSON', {
  transform: (_doc: any, ret: any) => {
    Reflect.deleteProperty(ret, 'password');
    return ret;
  },
} as any);

export const User = mongoose.model<IUser>('User', UserSchema);
