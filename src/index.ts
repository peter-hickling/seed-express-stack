import httpContext from 'express-http-context'
import bodyParser from 'body-parser'
import compression from 'compression'
import helmet from 'helmet'
import passport from 'passport'
import cors from 'cors'

import { app } from 'app'
import { errorHandler, notFoundHandler } from 'errors'
import { initialRequestLog, logger, setRequestContext } from 'logger'
import {
  cookieSessionConfig,
  refreshSessionOnAllRequests,
  SessionConfig,
} from 'sessions'

type Props = {
  port: number,
  routers: Array<any>,
  noBodyParserRouters: Array<any>,
  clientUrl: string,
  passportConfig?: {
    passportStrategies: Array<{ strategy: any, name: string }>,
    deserializeUser: (id, done) => void,
    serializeUser: (user, done) => void,
  },
  sessionConfig: SessionConfig,
  trustProxies?: boolean,
  noCors: boolean,
}

export const setupMicroService = ({
  port,
  routers,
  noBodyParserRouters,
  clientUrl,
  passportConfig,
  trustProxies = false,
  sessionConfig,
  noCors = false,
}: Props) => {
  app.listen(port, error => {
    if (error) {
      logger.error(`Error booting up on port ${port}!`)
      throw error
    } else {
      logger.info(`Example app listening on port ${port}!`)
    }
  })

  if (trustProxies) {
    app.enable('trust proxy')
  }

  const corsOptions = { origin: clientUrl, credentials: !!passportConfig }
  app.use(cookieSessionConfig(sessionConfig))
  app.use(helmet())
  app.use(compression())
  if (!noCors) {
    app.use(cors(corsOptions))
  }
  noBodyParserRouters.forEach(router => {
    app.use(router)
  })
  app.use(bodyParser.json())
  if (passportConfig) {
    app.use(passport.initialize())
    app.use(passport.session())
  }
  app.use(httpContext.middleware)
  app.use(setRequestContext)
  app.use(initialRequestLog)
  app.use(refreshSessionOnAllRequests)
  routers.forEach(router => {
    app.use(router)
  })
  app.use(notFoundHandler)
  app.use(errorHandler)

  if (passportConfig) {
    passportConfig.passportStrategies.forEach(({ name, strategy }) =>
      passport.use(name, strategy),
    )
    passport.deserializeUser(passportConfig.deserializeUser)
    passport.serializeUser(passportConfig.serializeUser)
  }
}

export { internalErrorWrapper } from 'errors'
export { logger } from 'logger'
