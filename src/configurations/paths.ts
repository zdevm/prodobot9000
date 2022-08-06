import { registerAs } from '@nestjs/config';
import { join } from 'path';

const root = join(__dirname, '../..');

export default registerAs('paths', () => ({
  root,
  uploads: join(root, '/uploads')
}))

