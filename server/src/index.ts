import 'dotenv/config'
import { connectToMongo } from './config/db'
import { createApp } from './app'

const envPort = Number(process.env.PORT)
const PORT = Number.isFinite(envPort) && envPort > 0 ? (envPort === 5000 ? 5050 : envPort) : 5050
const MONGODB_URI = process.env.MONGODB_URI ?? ''

async function start() {
  const mongoConnected = await connectToMongo(MONGODB_URI)
  if (!mongoConnected) {
    console.warn('MongoDB is not connected. Session persistence may be unavailable.')
  }

  const app = createApp()
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FinPath AI server listening on port ${PORT}`)
  })
}

void start()
