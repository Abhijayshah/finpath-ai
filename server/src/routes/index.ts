import { Router } from 'express'
import chatRouter from './chat'
import profileRouter from './profile'
import scoreRouter from './score'
import sessionRouter from './session'

const router = Router()

router.use('/chat', chatRouter)
router.use('/profile', profileRouter)
router.use('/score', scoreRouter)
router.use('/session', sessionRouter)

export default router
