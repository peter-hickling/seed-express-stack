import cookieSession from 'cookie-session'

export const cookieSessionConfig = ({
  secure,
  name,
  keys,
}: {
  secure: boolean,
  name: string,
  keys: Array<string>,
}) =>
  cookieSession({
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
    },
    name,
    keys,
    // Cookie will only be sent over HTTPS
    secure,
    // Cookie will be send with JS request as well as HTTP ones
    httpOnly: false,
  })

export const refreshSessionOnAllRequests = (req, res, next) => {
  req.session.randomInteger = Math.floor(Date.now() / 60e3)
  next()
}
