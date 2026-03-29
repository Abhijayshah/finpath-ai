import cors from 'cors'
import express from 'express'
import apiRoutes from './routes'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json({ limit: '1mb' }))

  app.get('/health', (_req, res) => {
    res.json({ ok: true })
  })

  app.use('/api', apiRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
