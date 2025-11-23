export type ResumeAnalysis = {
  id: string
  userId: string
  textExtract?: string
  skills?: string[]
  gaps?: string[]
  insights?: any
  createdAt: string
}

export type ResumeUploadResponse = {
  analysisId?: string
  message?: string
  resumeAnalysis?: ResumeAnalysis
}
