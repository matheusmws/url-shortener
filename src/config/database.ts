import { Sequelize } from 'sequelize';
import { logger } from './observability';

const {
  DB_HOST = 'postgres',
  DB_PORT = '5432',
  DB_NAME = 'url_shortener',
  DB_USER = 'postgres',
  DB_PASS = 'postgres'
} = process.env;

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASS,
  logging: (msg) => logger.debug(msg)
});

export default sequelize;