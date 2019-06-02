import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

class Config {
  public readonly nodeEnv = process.env.NODE_ENV;
  public readonly port = this.normalizePort(process.env.PORT);
  public readonly mongodbUri = process.env.MONGODB_URI;
  public readonly jwtSecret = process.env.JWT_SECRET;

  constructor() {
    this.ensureRequiredVariables();
  }

  private ensureRequiredVariables() {
    // required environment variables
    ['NODE_ENV', 'PORT', 'MONGODB_URI', 'JWT_SECRET'].forEach(name => {
      if (!process.env[name]) {
        throw new Error(`Environment variable ${name} is missing`);
      }
    });
  }

  private normalizePort(val: string) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      throw new Error('port is not a number');
    }

    if (port >= 0) {
      // port number
      return port;
    }

    throw new Error('port is less than 0');
  }
}

const config = new Config();

export default config;
