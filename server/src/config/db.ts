import mongoose from 'mongoose'

mongoose.set('bufferCommands', false)

export async function connectToMongo(mongoUri: string): Promise<boolean> {
  if (!mongoUri) return false

  try {
    await mongoose.connect(mongoUri)
    return true
  } catch {
    return false
  }
}
