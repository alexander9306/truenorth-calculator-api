import 'dotenv/config';

export const jwtConstants = {
  secret: process.env.JWT_SECRET ?? 'MySecretKey',
  expiresIn: process.env.JWT_EXPIRATION_TIME ?? '1h',
  ignoreExpiration: process.env.NODE_ENV === 'development',
};
