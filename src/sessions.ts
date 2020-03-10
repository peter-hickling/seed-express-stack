import cookieSession from 'cookie-session'

// TODO: Set keygrip up for the keys. Also consider increasing the session length to 3 days.
//  https://github.com/expressjs/cookie-session#using-a-custom-signature-algorithm
const cookieSessionConfig = (httpsEnabled: boolean) => cookieSession({
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
  },
  name: 'capacity-session',
  keys: [
    'this-should-be-changed-for-production-version',
    'another-very-secure-key-that-should-be-changed',
  ],
  // Cookie will only be sent over HTTPS
  secure: httpsEnabled,
  // Cookie will be send with JS request as well as HTTP ones
  httpOnly: false,
})

const refreshSessionOnAllRequests = (req, res, next) => {
  req.session.randomInteger = Math.floor(Date.now() / 60e3)
  next()
}

export {
  refreshSessionOnAllRequests,
  cookieSessionConfig,
}
