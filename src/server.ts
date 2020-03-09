import httpContext from 'express-http-context'
import bodyParser from 'body-parser'
import compression from 'compression'
import helmet from 'helmet'
import passport from 'passport'
import cors from 'cors'

import { app } from 'app'
import { errorHandler, notFoundHandler } from 'errors'
import { initialRequestLog, logger, setRequestContext } from 'logger'
import { cookieSessionConfig, refreshSessionOnAllRequests } from 'sessions'

type Props = {
  port: number,
  publicRoutes: Array<any>,
  protectedRoutes: Array<any>,
  passportStrategies: Array<any>,
  clientUrl: string,
  deserializeUser: (id, done) => void,
  serializeUser: (user, done) => void,
  authenticateUser: (req, res, next) => void,
}

export const setupMicroService = ({
  port,
  publicRoutes,
  protectedRoutes,
  passportStrategies,
  clientUrl,
  deserializeUser,
  serializeUser,
  authenticateUser,
}: Props) => {
  app.listen(port, error => {
    if (error) {
      logger.error(`Error booting up on port ${port}!`)
      throw error
    } else {
      logger.info(`Example app listening on port ${port}!`)
    }
  })

  if (!clientUrl.includes('localhost')) {
    app.set('trust proxy', 1)
  }

  const corsOptions = { origin: clientUrl, credentials: true }
  app.use(cookieSessionConfig)
  app.use(helmet())
  app.use(compression())
  app.use(cors(corsOptions))
  app.use(bodyParser.json())
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(httpContext.middleware)
  app.use(setRequestContext)
  app.use(initialRequestLog)
  app.use(refreshSessionOnAllRequests)
  publicRoutes.forEach(router => {
    app.use(router)
  })

  // All routes below here will authenticate the user by default. Any router that doesn't require default authentication
  // should be above here
  app.use(authenticateUser)

  protectedRoutes.forEach(router => {
    app.use(router)
  })

  app.use(notFoundHandler)
  app.use(errorHandler)

  passportStrategies.forEach(strategy => passport.use(strategy))

  passport.deserializeUser(deserializeUser)
  passport.serializeUser(serializeUser)
}

export { internalErrorWrapper } from 'errors'
