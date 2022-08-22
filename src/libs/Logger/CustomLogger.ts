import winston from 'winston';
import { ICustomLogger } from './ICustomLogger';

export class CustomLogger implements ICustomLogger {
  private customLogger;

  constructor() {
    this.customLogger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { service: 'user-service' },
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    });
    if (process.env.NODE_ENV !== 'production') {
      this.customLogger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        })
      );
    }
  }

  info(message: string) {
    this.customLogger.log('info', message);
  }

  error(message: string) {
    this.customLogger.log('error', message);
  }

  warn(message: string) {
    this.customLogger.log('error', message);
  }
}
