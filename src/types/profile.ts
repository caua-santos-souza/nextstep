export type Stats = {
  totalJourneys: number
  completedJourneys: number
  totalSkills: number
  averageProgress: number
}

export type UserProfile = {
  userId: string
  name: string
  email: string
  currentJob: string | null
  profilePicture: string | null
  createdAt: string
  stats: Stats
}

export type ProfileUpdateRequest = {
  name: string
  email: string
  currentJob: string
}

export type DeleteProfileResponse = {
  message: string
  success: boolean
}
