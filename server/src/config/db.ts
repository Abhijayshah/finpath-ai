import mongoose from 'mongoose'

export async function connectToMongo(mongoUri: string): Promise<void> {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required')
  }

  await mongoose.connect(mongoUri)
}
