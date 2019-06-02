import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import Db from './db';
import { User } from '../models';
import { User as IUser, UserInput } from '../types/user';
import { config } from '../common';

class UserAPI extends Db<IUser> {
  model = User;

  constructor() {
    super();
  }

  public createJWT(user: IUser) {
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwtSecret);
    return token;
  }

  public async register({ username, password }: UserInput) {
    const usernameLower = username.toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);

    const userToSave = {
      username: usernameLower,
      password: passwordHash,
      role: 'user',
    };
    const user = await this.create(userToSave);
    return user;
  }

  public async signIn({ username, password }: UserInput) {
    const usernameLower = username.toLowerCase();
    const user = await this.findOne({ username: usernameLower });

    if (!user) {
      throw new Error('User not found.');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new Error('Invalid password.');
    }

    return user;
  }
}

export default UserAPI;
