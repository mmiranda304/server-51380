import dotenv from 'dotenv';
import { Command } from 'commander';

const program = new Command();
program.option('--mode <mode>', 'Modo de trabajo', 'DEVELOPMENT');
program.parse();

dotenv.config({
  path: program.opts().mode === 'DEVELOPMENT' ? './.env.development' : './.env.production',
});

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  adminName: process.env.ADMIN_NAME,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
};