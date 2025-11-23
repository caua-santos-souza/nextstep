import client from './axiosClient'
import type { ActiveJourneyResponse } from '../types/journey'
import { buildApiUrl, buildAuthHeaders } from '../utils/apiHelpers'

export async function getActiveJourney(): Promise<ActiveJourneyResponse | null> {
  try {
    const res = await client.get('/journeys/active')
    return res.data as ActiveJourneyResponse
  } catch (err: any) {
    if (err?.response?.status === 404) return null
    throw err
  }
}

// Tentamos usar o axios neste endpoint, mas estava dando erro no próprio axios, então testamos com fetch e funcionou normalmente.
export async function generateJourney(desiredJob: string): Promise<any> {
  const payload = { desiredJob }
  const url = buildApiUrl('/journeys/generate')
  const headers = await buildAuthHeaders()

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`generateJourney failed: ${res.status} ${res.statusText} ${text}`)
  }

  return await res.json()
}

export async function updateStepProgress(stepId: string, progress: boolean): Promise<any> {
  const url = buildApiUrl(`/journeys/steps/${stepId}/progress`)
  const headers = await buildAuthHeaders()

  const res = await fetch(url, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ progress }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`updateStepProgress failed: ${res.status} ${res.statusText} ${text}`)
  }

  return await res.json()
}
