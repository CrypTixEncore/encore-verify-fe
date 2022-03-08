import dotenv from 'dotenv';

// process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  encryptionSecret: process.env.REACT_APP_ENCRYPTION_SECRET_KEY,
};
