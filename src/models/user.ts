import * as mongoose from 'mongoose';

export interface User extends mongoose.Document {
  username: string;
  password: string;
  role: string;
  created: Date;
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
  password: String,
  role: String,
  created: { type: Date, default: new Date(), index: true },
});

const User = mongoose.model<User>('users', userSchema);

export default User;
