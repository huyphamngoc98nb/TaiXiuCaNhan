import { ENV } from '@/shared/config/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private log(level: LogLevel, message: string, ...optionalParams: any[]) {
    if (ENV.isProd && level === 'debug') {
      return; // Skip debug logs in production
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'info':
        console.info(prefix, message, ...optionalParams);
        break;
      case 'warn':
        console.warn(prefix, message, ...optionalParams);
        break;
      case 'error':
        console.error(prefix, message, ...optionalParams);
        break;
      case 'debug':
        console.debug(prefix, message, ...optionalParams);
        break;
    }
  }

  info(message: string, ...optionalParams: any[]) {
    this.log('info', message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: any[]) {
    this.log('warn', message, ...optionalParams);
  }

  error(message: string, ...optionalParams: any[]) {
    this.log('error', message, ...optionalParams);
  }

  debug(message: string, ...optionalParams: any[]) {
    this.log('debug', message, ...optionalParams);
  }
}

export const logger = new Logger();
