import { Router } from 'express'
import { SessionModel } from '../models/Session'

const router = Router()

router.get('/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId
  if (!sessionId) {
    return res.status(400).json({ message: 'sessionId is required' })
  }

  try {
    const session = await SessionModel.findOne({ sessionId }).lean()
    if (!session) {
      return res.status(404).json({ message: 'Session not found' })
    }

    return res.json({
      sessionId: session.sessionId,
      messages: session.messages ?? [],
      profile: session.profile,
      score: session.score,
      recommendations: session.recommendations ?? [],
      createdAt:
        session.createdAt instanceof Date ? session.createdAt.toISOString() : String(session.createdAt),
      updatedAt:
        session.updatedAt instanceof Date ? session.updatedAt.toISOString() : String(session.updatedAt),
    })
  } catch {
    return res.status(503).json({ message: 'Session store unavailable' })
  }
})

export default router
