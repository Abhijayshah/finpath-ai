import cors from 'cors'
import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
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

  if (process.env.NODE_ENV === 'production') {
    const candidateDistPaths = [
      path.resolve(process.cwd(), 'client/dist'),
      path.resolve(process.cwd(), '../client/dist'),
    ]

    const clientDistPath = candidateDistPaths.find((p) => fs.existsSync(path.join(p, 'index.html')))

    if (clientDistPath) {
      app.use(express.static(clientDistPath))
      app.get(/^(?!\/api).*/, (_req, res) => {
        res.sendFile(path.join(clientDistPath, 'index.html'))
      })
    }
  }

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
