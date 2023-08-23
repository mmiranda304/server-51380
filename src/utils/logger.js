import winston from "winston";
import path from "path";
import { __dirname } from "../utils.js";

// const myCustomLevels = {
const logsLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: 'redBG grey',
    error: 'whiteBG red',
    warn: 'yellow',
    info: 'gray',
    http: 'italic cyan',
    debug: 'bold blue',
  },
};

let logger;

switch (process.env.NODE_ENV) {
  case 'DEVELOPMENT':
    logger = winston.createLogger({
      levels: logsLevels.levels, // Niveles personalizados
      transports: [
        new winston.transports.Console({
          level: 'debug',
          format: winston.format.colorize({ all: true }),
        }),

        new winston.transports.File({
          filename: path.join(__dirname, 'logs/dev.errors.log'),
          level: 'error',
          format: winston.format.simple(),
        }),
      ],
    });
    break;
  case 'PRODUCTION':
    logger = winston.createLogger({
      levels: logsLevels.levels, // Niveles personalizados
      transports: [
        new winston.transports.Console({
          level: 'info',
          format: winston.format.colorize({ all: true }),
        }),

        new winston.transports.File({
          filename: path.join(__dirname, 'logs/prod.errors.log'),
          level: 'error',
          format: winston.format.simple(),
        }),
      ],
    });
    break;
  default:
    break;
}

export const addLogger = (req, res, next) => {
  req.logger = logger;
  /* req.logger.info(
    `${req.method} on ${req.url} - ${new Date().toLocaleTimeString()}`
  ); */
  next();
};

/* req.logger.info(
    `${req.method} on ${req.url} - ${new Date().toLocaleTimeString()}`
  ); */
