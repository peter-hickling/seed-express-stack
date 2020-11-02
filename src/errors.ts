import boom from 'boom'
import { logger } from 'logger'

export const errorHandler = (err, req, res, next) => {
  logger.error(err)

  res
    .status(err?.output?.statusCode || 500)
    .json(err?.output?.payload || 'Internal server error')
}

export const notFoundHandler = (req, res, next) => {
  next(boom.notFound('Not found'))
}

export const internalErrorWrapper = func => async (req, res, next) => {
  try {
    await func(req, res, next)
  } catch (error) {
    next(boom.internal(error))
  }
}
