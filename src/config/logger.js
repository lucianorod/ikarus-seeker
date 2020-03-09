/* eslint-disable no-shadow */
const { createLogger, format, transports } = require('winston');

const {
  combine, timestamp, label, printf, ms, colorize, splat,
} = format;

const myFormat = printf(({
  level, message, label, timestamp, ms,
}) => `${timestamp} [${label}] ${level}: ${ms} ${message}`);

exports.default = createLogger({
  format: combine(
    label({ label: 'ikarus seeker' }),
    timestamp(),
    colorize(),
    splat(),
    ms(),
    myFormat,
  ),
  transports: [new transports.Console()],
});
