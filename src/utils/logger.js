import winston, { format, addColors } from "winston";
const { printf } = format;

import path from "path";
import { __dirname } from "../utils.js";

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
    error: 'bold red',
    warning: 'yellow',
    info: 'gray',
    http: 'italic cyan',
    debug: 'bold blue',
  },
};

let logger;

const consoleFormat = printf(({ level, message }) => {
  return `[${new Date()}] [${level}]: ${message}`;
});

const fileFormat = printf(({ level, message }) => {
  return `[${new Date()}] [${level.toLocaleUpperCase()}]: ${message}`;
});

addColors(logsLevels.colors); // Agrega los colores personalizados

switch (process.env.NODE_ENV) {
  case 'DEVELOPMENT':
    logger = winston.createLogger({
      levels: logsLevels.levels, // Niveles personalizados
      transports: [
        new winston.transports.Console({
          level: 'debug',
          format: winston.format.colorize({ all: true }, consoleFormat),
        }),

        new winston.transports.File({
          filename: path.join(__dirname, 'logs/dev.errors.log'),
          level: 'error',
          format: fileFormat,
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
          format: winston.format.colorize({ all: true }, consoleFormat),
        }),

        new winston.transports.File({
          filename: path.join(__dirname, 'logs/prod.errors.log'),
          level: 'error',
          format: fileFormat,
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
