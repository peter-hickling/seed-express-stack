import httpContext from 'express-http-context'
import bodyParser from 'body-parser'
import compression from 'compression'
import helmet from 'helmet'
import passport from 'passport'
import cors from 'cors'

import { app } from 'app'
import { errorHandler, notFoundHandler } from 'errors'
import { createInitialRequestLog, logger, setRequestContext } from 'logger'
import {
  cookieSessionConfig,
  refreshSessionOnAllRequests,
  SessionConfig,
} from 'sessions'

type Props = {
  port: number,
  routers: Array<any>,
  noLogRoutes?: Array<string>,
  noBodyParserRouters: Array<any>,
  clientUrl: string,
  passportConfig?: {
    passportStrategies: Array<{ strategy: any, name: string }>,
    deserializeUser: (id, done) => void,
    serializeUser: (user, done) => void,
  },
  sessionConfig: SessionConfig,
  trustProxies?: boolean,
  corsConfig?: { noCors?: boolean, origin: Array<any>, credentials?: boolean },
}

export const setupMicroService = ({
  port,
  routers,
  noBodyParserRouters,
  noLogRoutes = [],
  clientUrl,
  passportConfig,
  trustProxies = false,
  sessionConfig,
  corsConfig,
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

  const corsWithDefault = corsConfig || {
    origin: clientUrl,
    credentials: !!passportConfig,
    noCors: false,
  }
  app.use(cookieSessionConfig(sessionConfig))
  app.use(helmet())
  app.use(compression())
  if (!corsWithDefault.noCors) {
    app.use(cors(corsWithDefault))
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
  app.use(createInitialRequestLog(noLogRoutes))
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
