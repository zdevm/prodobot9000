import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  url: process.env.REDIS_URL,
  prefix: process.env.environment === 'development' ? 'dev' : 'prod'
}))
