import { Injectable } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import LokiTransport from 'winston-loki';
import colors from 'colors';

@Injectable()
export class LoggerService {
  private readonly logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp(),
      format.json(),
      format.printf(({ level, message, timestamp, context }) => {
        const baseMessage = `[${level}] ${message}`;
        const request = context?.request
          ? ` Request: ${JSON.stringify(context.request)}`
          : '';
        const response = context?.response
          ? ` Response: ${JSON.stringify(context.response)}`
          : '';

        let coloredMessage: string;
        switch (level) {
          case 'error':
            coloredMessage = colors.red(baseMessage);
            break;
          case 'warn':
            coloredMessage = colors.yellow(baseMessage);
            break;
          case 'info':
            coloredMessage = colors.green(baseMessage);
            break;
          case 'debug':
            coloredMessage = colors.blue(baseMessage);
            break;
          default:
            coloredMessage = baseMessage;
        }

        const uuidPattern =
          /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g;
        const uuidMatches = coloredMessage.match(uuidPattern);

        if (uuidMatches && uuidMatches.length > 0) {
          const correlationId = uuidMatches[uuidMatches.length - 1];
          coloredMessage = coloredMessage.replace(
            correlationId,
            colors.magenta(correlationId),
          );
        }

        let finalLog = `${coloredMessage}`;
        if (request) {
          finalLog += `\n${colors.gray(request)}`;
        }
        if (response) {
          finalLog += `\n${colors.cyan(response)}`;
        }

        return `${timestamp} ${finalLog}`;
      }),
    ),
    transports: [
      new LokiTransport({
        host: 'http://localhost:3100',
        labels: { job: 'microservice 1', service: 'microservice 1' },
        json: true,
      }),
      new transports.Console({
        // Aggiungi questo trasporto per la console
        format: format.combine(
          format.colorize(), // Abilita il colorization
          format.printf(({ level, message }) => {
            return `${level}: ${message}`; // Personalizza il formato del messaggio
          }),
        ),
      }),
    ],
  });

  info(message: string, context?: any): void {
    this.logger.info(`ℹ️ ${message}`, { context });
  }

  warn(message: string) {
    this.logger.warn(`⚠️ ${message}`);
  }

  error(message: string, trace?: string) {
    this.logger.error(`❌ ${message}`, { trace });
  }
}
