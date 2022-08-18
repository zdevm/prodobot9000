import { registerAs } from '@nestjs/config';

export default registerAs('queue', () => ({
  prefix: 'queue',
}))
