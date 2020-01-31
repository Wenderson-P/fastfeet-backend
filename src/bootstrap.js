import dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE === 'test' ? '.env.test' : '.env',
});
