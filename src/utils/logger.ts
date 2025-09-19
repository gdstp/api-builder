import winston from "winston";

const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const TIMESTAMP_FORMAT = { format: "YYYY-MM-DD hh:mm:ss A" };

const logFormatter = winston.format.printf(function ({
  timestamp,
  level,
  message,
  ...meta
}) {
  const metaStr = Object.keys(meta).length
    ? `\n${JSON.stringify(meta, null, 2)}`
    : "";
  return `[${level}][ ${timestamp} ]: ${message} ${metaStr}`;
});

const fileFormat = winston.format.combine(
  winston.format.timestamp(TIMESTAMP_FORMAT),
  logFormatter,
);

const consoleFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.timestamp(TIMESTAMP_FORMAT),
  logFormatter,
);

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  level: LOG_LEVEL,
  format: fileFormat,
  transports: [new winston.transports.Console({ format: consoleFormat })],
});

export default logger;
