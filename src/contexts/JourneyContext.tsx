import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { ActiveJourneyResponse } from '../types/journey'
import { getActiveJourney } from '../api/journeys'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { auth } from '../../firebaseConfig'

type JourneyContextValue = {
  journey: ActiveJourneyResponse | null
  loading: boolean
  refresh: () => Promise<void>
  completedCount: number
  clearJourney: () => void
}

const JourneyContext = createContext<JourneyContextValue | undefined>(undefined)

export function useJourney() {
  const ctx = useContext(JourneyContext)
  if (!ctx) throw new Error('useJourney must be used within JourneyProvider')
  return ctx
}

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [journey, setJourney] = useState<ActiveJourneyResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [completedCount, setCompletedCount] = useState<number>(0)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const COMPLETED_KEY = '@journeyCompletedCount'

  async function loadCompletedMeta() {
    try {
      const v = await AsyncStorage.getItem(COMPLETED_KEY)
      setCompletedCount(v ? parseInt(v, 10) || 0 : 0)
    } catch (e) {
      setCompletedCount(0)
    }
  }

  async function refresh() {
    try {
      setLoading(true)
      const data = await getActiveJourney()

      const prevJourneyId = journey?.journeyId ?? null
      const prevOverall = journey?.overallProgress ?? 0
      const prevStatus = journey?.status ?? undefined
      const newJourneyId = data?.journeyId ?? null
      const newOverall = data?.overallProgress ?? 0
      const newStatus = data?.status ?? undefined

      const shouldIncrement = (() => {
        try {
          if (newStatus && newStatus.toLowerCase() === 'completed') return true
          if (journey && !data && prevOverall >= 100) return true
          if (prevOverall >= 100 && newOverall === 0) return true
          if (prevJourneyId && newJourneyId && prevJourneyId !== newJourneyId && prevOverall > 0)
            return true
        } catch (e) {
          return false
        }
        return false
      })()

      if (shouldIncrement) {
        const prevCount = (await AsyncStorage.getItem(COMPLETED_KEY))
          ? parseInt((await AsyncStorage.getItem(COMPLETED_KEY)) || '0', 10) || 0
          : 0
        const next = prevCount + 1
        await AsyncStorage.setItem(COMPLETED_KEY, String(next))
        setCompletedCount(next)
      }

      setJourney(data)
    } catch (err) {
      setJourney(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCompletedMeta()
    const userId = auth.currentUser?.uid || null
    setCurrentUserId(userId)
    if (userId) {
      refresh()
    }
  }, [])

  useEffect(() => {
    const userId = auth.currentUser?.uid || null

    if (userId !== currentUserId) {
      setJourney(null)
      setCurrentUserId(userId)

      if (userId) {
        refresh()
      }
    }
  }, [auth.currentUser?.uid])

  function clearJourney() {
    setJourney(null)
  }

  return (
    <JourneyContext.Provider value={{ journey, loading, refresh, completedCount, clearJourney }}>
      {children}
    </JourneyContext.Provider>
  )
}

export default JourneyContext
