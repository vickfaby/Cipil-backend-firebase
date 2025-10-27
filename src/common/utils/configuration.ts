import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT ?? '5001', 10),
  mongodb: process.env.MONGODB ?? 'mongodb://localhost:27017/cipil',
  jwtsecret: process.env.JWT_SECRET ?? 'secret',
}));
