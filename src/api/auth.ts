import type { CompleteProfileRequest, CompleteProfileResponse } from '../types'
import { buildApiUrl, getAuthToken } from '../utils/apiHelpers'

export async function completeProfile(
  token: string | null,
  payload: CompleteProfileRequest
): Promise<CompleteProfileResponse> {
  const trimmed = {
    name: (payload.name || '').trim(),
    currentJob: (payload.currentJob || '').trim(),
  }

  const url = buildApiUrl('/auth/complete-profile')
  const storedToken = await getAuthToken()
  const authHeader = token || storedToken

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authHeader ? { Authorization: `Bearer ${authHeader}` } : {}),
    },
    body: JSON.stringify(trimmed),
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => '')
    throw new Error(`completeProfile failed: ${res.status} ${errorText}`)
  }

  return (await res.json()) as CompleteProfileResponse
}
