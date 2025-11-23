export type AuthVerifyResponse = {
  hasActiveJourney: boolean
  firebaseUid: string
  email: string
}

export type CompleteProfileRequest = {
  name: string
  currentJob: string
}

export type CompleteProfileResponse = {
  userId: string
  name: string
  currentJob: string
  updatedAt: string
}
