import { registerAs } from '@nestjs/config';
import * as path from 'path';

export default registerAs('paths', () => ({
  root: path.join(__dirname, '../..')
}))