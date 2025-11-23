export type DashboardUser = {
  name: string
  currentJob: string
  desiredJob: string
}

export type DashboardNextStep = {
  title: string
  objective: string
  progress: boolean
}

export type Skill = {
  name: string
  level: string
  progress: number
}

export type Trend = {
  title: string
  icon: string
}

export type SuggestedPath = {
  title: string
  match: string
}

export type DashboardResponse = {
  user: DashboardUser
  nextStep: DashboardNextStep | null
  skills: Skill[]
  trends: Trend[]
  suggestedPaths: SuggestedPath[]
}
