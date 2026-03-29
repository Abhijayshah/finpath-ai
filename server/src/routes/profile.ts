import { Router } from 'express'
import type { UserProfile } from '../../../shared/types'

type GetProfileResponse = {
  profile: UserProfile | null
}

type UpdateProfileRequest = {
  profile: UserProfile
}

type UpdateProfileResponse = {
  profile: UserProfile
}

const router = Router()

let inMemoryProfile: UserProfile | null = null

router.get<{}, GetProfileResponse>('/', (_req, res) => {
  res.json({ profile: inMemoryProfile })
})

router.post<{}, UpdateProfileResponse, UpdateProfileRequest>('/', (req, res) => {
  const { profile } = req.body

  if (!profile || typeof profile !== 'object') {
    return res.status(400).json({
      profile: {
        name: '',
        age: 0,
        income: 0,
        expenses: 0,
        goals: [],
        investments: [],
        riskAppetite: 'moderate',
        insurance: [],
        hasEmergencyFund: false,
      },
    })
  }

  inMemoryProfile = profile
  return res.json({ profile })
})

export default router
