import { ApolloError, AuthenticationError } from 'apollo-server-core';
import { Context } from '../types/context';
import { UserInput } from '../types/user';

class Resolvers {
  public async register(
    parent: any,
    { input }: { input: UserInput },
    { dataSources, res }: Context,
  ) {
    try {
      const user = await dataSources.user.register(input);
      const token = dataSources.user.createJWT(user);

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });

      return user;
    } catch (error) {
      console.error(error.stack);
      throw new ApolloError(error.message);
    }
  }

  public async signIn(
    parent: any,
    { input }: { input: UserInput },
    { dataSources, res }: Context,
  ) {
    try {
      const user = await dataSources.user.signIn(input);
      const token = dataSources.user.createJWT(user);

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });

      return user;
    } catch (error) {
      console.error(error.stack);
      throw new AuthenticationError(error.message);
    }
  }

  public async getCurrentUser(
    parent: any,
    args: {},
    { user, dataSources }: Context,
  ) {
    if (!user) {
      return null;
    }

    try {
      const currentUser = await dataSources.user.findById(user.userId);
      return currentUser;
    } catch (error) {
      console.error(error.stack);
      throw new ApolloError(error.message);
    }
  }
}

const resolvers = new Resolvers();

export default {
  Query: {
    currentUser: resolvers.getCurrentUser,
  },
  Mutation: {
    register: resolvers.register,
    signIn: resolvers.signIn,
  },
};
