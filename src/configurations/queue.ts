import { registerAs } from '@nestjs/config';

export default registerAs('queue', () => ({
  prefix: process.env.environment === 'development' ? 'dev' : 'prod',
}))
