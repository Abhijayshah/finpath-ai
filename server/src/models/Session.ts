import mongoose, { Schema } from 'mongoose'
import type { ETRecommendation, FinancialScore, SessionMessage, UserProfile } from '../../../shared/types'

export type SessionDocument = mongoose.Document & {
  sessionId: string
  messages: SessionMessage[]
  profile?: UserProfile
  score?: FinancialScore
  recommendations?: ETRecommendation[]
  createdAt: Date
  updatedAt: Date
}

const sessionMessageSchema = new Schema<SessionMessage>(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: String, required: true },
  },
  { _id: false },
)

const sessionSchema = new Schema<SessionDocument>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    messages: { type: [sessionMessageSchema], default: [] },
    profile: { type: Schema.Types.Mixed, required: false },
    score: { type: Schema.Types.Mixed, required: false },
    recommendations: { type: [Schema.Types.Mixed], required: false, default: undefined },
  },
  { timestamps: true },
)

export const SessionModel =
  (mongoose.models.Session as mongoose.Model<SessionDocument> | undefined) ??
  mongoose.model<SessionDocument>('Session', sessionSchema)
