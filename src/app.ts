// We do this in a separate file to ensure that express-ws has wrapped the global express.Router object appending the
// ws function

import express from 'express'
import ws from 'express-ws'

export const app = express()

ws(app, null, { wsOptions: { clientTracking: false } })
