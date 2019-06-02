import * as mongoose from 'mongoose';

export interface User extends mongoose.Document {
  username: string;
  role: string;
  created: Date;
  permissions: string[];
  id: string;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  role: String,
  created: { type: Date, index: true },
  permissions: [String],
});

const User = mongoose.model<User>('users', userSchema);

export default User;
