import { registerAs } from '@nestjs/config';

export default registerAs('upload', () => ({
  maxFileSize: parseInt(process.env.UPLOAD_MAX_SIZE || '0'),
  filesPath: process.env.UPLOAD_PATH
}))
