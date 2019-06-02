import * as express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { DocumentNode } from 'graphql';
import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import schemas from './schemas';
import resolvers from './resolvers';
import { UserAPI } from './data-sources';
import { config } from './common';

class Server {
  public app: express.Application = express();

  constructor() {
    const isDev = process.env.NODE_ENV === 'development';
    const typeDefs: DocumentNode = gql(schemas);

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: this.buildContext,
      dataSources: this.buildDataSources,
      introspection: isDev,
      playground: isDev,
    });

    server.applyMiddleware({
      app: this.app,
      cors: isDev,
    });
  }

  private buildContext({
    req,
    res,
  }: {
    req: express.Request;
    res: express.Response;
  }) {
    let user = null;
    const header = req.headers['authorization'];
    if (header) {
      const token = header.replace('Bearer ', '');

      try {
        user = jwt.verify(token, config.jwtSecret);
      } catch (error) {
        // ignore
      }
    }

    return { req, res, user };
  }

  private buildDataSources() {
    return {
      user: new UserAPI(),
    };
  }

  private listen() {
    this.app.listen({ port: config.port }, () =>
      console.log(`🚀 Server ready at http://localhost:${config.port}`),
    );
  }

  private connectToMongo() {
    return new Promise((resolve, reject) => {
      // Suppress deprecation warning
      mongoose.set('useCreateIndex', true);
      mongoose.set('useFindAndModify', false);

      mongoose.connect(config.mongodbUri, { useNewUrlParser: true });

      mongoose.connection.once('open', () => {
        console.log(`Connected to mongoDb`);
        resolve();
      });

      mongoose.connection.on('error', error => {
        console.log('mongo error');
        reject(error);
      });
    });
  }

  public async initialize() {
    try {
      await this.connectToMongo();
      this.listen();
    } catch (error) {
      throw error;
    }
  }
}

export default new Server();
