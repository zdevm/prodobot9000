import { registerAs } from '@nestjs/config';


export default registerAs('demo', () => ({
  email: process.env.DEMO_EMAIL,
  code: process.env.DEMO_MAGIC_CODE
}))
