import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'

type ResumeContextValue = {
  resumeExists: boolean | null
  loading: boolean
  refresh: () => Promise<void>
}

const ResumeContext = createContext<ResumeContextValue | undefined>(undefined)

export function useResume() {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be used within ResumeProvider')
  return ctx
}

import { hasResumeOnServer } from '../api/resume'

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeExists, setResumeExists] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const auth = useAuth()

  async function refresh() {
    try {
      setLoading(true)
      const ok = await hasResumeOnServer()
      setResumeExists(ok)
    } catch (err) {
      setResumeExists(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (auth.loading) return
    if (auth.isAuthenticated) {
      refresh()
    } else {
      setResumeExists(null)
      setLoading(false)
    }
  }, [auth.isAuthenticated, auth.loading])

  return (
    <ResumeContext.Provider value={{ resumeExists, loading, refresh }}>
      {children}
    </ResumeContext.Provider>
  )
}
