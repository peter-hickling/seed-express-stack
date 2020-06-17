import { createLogger, format, transports } from 'winston'
import httpContext from 'express-http-context'
import uniqid from 'uniqid'

const errorStackTraceFormat = format(info => {
  if (info instanceof Error) {
    info.message = `${info.output?.statusCode || 500} ${info.stack}`
  }
  return info
})

export const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.splat(),
    format.colorize(),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    errorStackTraceFormat(),
    format.printf(
      info =>
        `${info.timestamp} ${info.level} ${httpContext.get('reqId') || ''}: ${
          info.message
        }`,
    ),
  ),
  transports: [new transports.Console()],
})

export const setRequestContext = (req, res, next) => {
  httpContext.set('reqId', uniqid())
  next()
}

export const initialRequestLog = (req, res, next) => {
  logger.info(
    `Endpoint=${req.originalUrl} User=${req.user?.logId || 'unknown'}`,
  )
  next()
}
