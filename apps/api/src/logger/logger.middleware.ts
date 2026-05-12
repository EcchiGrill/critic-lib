import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logsDir: string;

  constructor() {
    this.logsDir = path.join(process.cwd(), 'logs');
    this.ensureLogsDirExists();
  }

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, ip } = req;

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;
      const timestamp = new Date().toISOString();

      const logEntry = `[${timestamp}] ${method} ${originalUrl} ${statusCode} - ${duration}ms - IP: ${ip}\n`;

      this.writeLog(logEntry);

      if (statusCode >= 400) {
        this.writeErrorLog(logEntry);
      }
    });

    next();
  }

  private ensureLogsDirExists() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  private getLogFileName(): string {
    const date = new Date().toISOString().split('T')[0];
    return path.join(this.logsDir, `access-${date}.log`);
  }

  private getErrorLogFileName(): string {
    const date = new Date().toISOString().split('T')[0];
    return path.join(this.logsDir, `error-${date}.log`);
  }

  private writeLog(entry: string) {
    fs.appendFile(this.getLogFileName(), entry, (err) => {
      if (err) {
        console.error('Failed to write log:', err);
      }
    });
  }

  private writeErrorLog(entry: string) {
    fs.appendFile(this.getErrorLogFileName(), entry, (err) => {
      if (err) {
        console.error('Failed to write error log:', err);
      }
    });
  }
}
