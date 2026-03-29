import 'dotenv/config'
import { connectToMongo } from './config/db'
import { createApp } from './app'

const PORT = Number(process.env.PORT ?? 5000)
const MONGODB_URI = process.env.MONGODB_URI ?? ''

async function start() {
  try {
    await connectToMongo(MONGODB_URI)

    const app = createApp()
    app.listen(PORT, () => {
      console.log(`FinPath AI server listening on port ${PORT}`)
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`Failed to start server: ${message}`)
    process.exit(1)
  }
}

void start()
