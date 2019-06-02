import Db from './db';
import { User } from '../models';
import { User as IUser } from '../types/user';

class UserAPI extends Db<IUser> {
  model = User;

  constructor() {
    super();
  }
}

export default UserAPI;
