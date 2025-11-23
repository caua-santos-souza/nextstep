export interface JourneyStep {
  stepId?: string
  title: string
  objective?: string
  resources?: string
  time?: string
  estimatedTime?: string
  progress?: number | boolean
  status?: 'completed' | 'in-progress' | 'pending'
}

export interface JourneyInsight {
  icon: string
  text: string
}

export interface JourneySummary {
  progressPercent: number
  nextMilestone?: string
}

export interface ActiveJourneyResponse {
  journeyId?: string
  desiredJob?: string
  totalSteps?: number
  completedSteps?: number
  estimatedTime?: string
  overallProgress?: number
  status?: string
  nextStep?: JourneyStep
  steps?: JourneyStep[]
  insights?: JourneyInsight[]
  createdAt?: string
  updatedAt?: string
  summary?: JourneySummary
  level?: string
  experienceLevel?: string
}
