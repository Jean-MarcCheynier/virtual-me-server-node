/* eslint-disable @typescript-eslint/no-unsafe-call */
import { createLogger , format, transports } from 'winston'
import * as Winston from 'winston'

const { combine, prettyPrint } = format

const customlevels = {
  levels: {
    trace: 9,
    input: 8,
    verbose: 7,
    prompt: 6,
    debug: 5,
    info: 4,
    data: 3,
    help: 2,
    warn: 1,
    error: 0
  },
  colors: {
    trace: 'magenta',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    debug: 'blue',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    error: 'red'
  }
}
Winston.addColors(customlevels.colors);

const loggerFormat = combine(
  prettyPrint(),
  format.colorize(),
  format.splat(),
  format.simple()
);

const logger = createLogger({
  level: 'debug',
  format: loggerFormat,
  transports: [
    new transports.Console(),
    new transports.File({ filename: './error.log', level: 'error' }),
    new transports.File({ filename: './info.log', level: 'info' })
  ],
  levels: customlevels.levels,
  exitOnError: false
})

export default logger