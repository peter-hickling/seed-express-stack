import cookieSession from 'cookie-session'

export type SessionConfig = {
  secure: boolean,
  name: string,
  domain?: string,
  keys: Array<string>,
}

export const cookieSessionConfig = ({
  secure,
  name,
  keys,
  domain,
}: SessionConfig) =>
  cookieSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // One week
    },
    name,
    keys,
    domain,
    // Cookie will only be sent over HTTPS
    secure,
    // Cookie will be send with JS request as well as HTTP ones
    httpOnly: false,
    sameSite: 'none',
  })

export const refreshSessionOnAllRequests = (req, res, next) => {
  req.session.randomInteger = Math.floor(Date.now() / 60e3)
  next()
}
