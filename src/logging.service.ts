import { createLogger, format, transports } from 'winston';
const { combine, printf } = format;
import safeJsonStringify from 'safe-json-stringify';

export const logger = createLogger({
    level: 'debug',
    format: combine(printf(({ level, message }) => safeJsonStringify({ severity: level, ...message }))),
    transports: [new transports.Console()],
});
