import client from './axiosClient'
import type { ResumeUploadResponse } from '../types'
import type { CareerSuggestion } from '../types/career'
import { buildApiUrl, getAuthToken } from '../utils/apiHelpers'

export async function uploadResume(
  fileUri: string,
  fileName: string,
  mimeType: string,
  onProgress?: (percent: number) => void
): Promise<ResumeUploadResponse> {
  const form = new FormData()

  //@ts-ignore
  form.append('file', {
    uri: fileUri,
    name: fileName,
    type: mimeType,
  })

  const res = await client.post<ResumeUploadResponse>('/resume/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent: any) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(percent)
      }
    },
  })
  return res.data
}

export async function uploadResumeFetch(
  fileUri: string,
  fileName: string,
  mimeType: string
): Promise<ResumeUploadResponse> {
  const url = buildApiUrl('/resume/upload')

  const form = new FormData()
  //@ts-ignore
  form.append('file', { uri: fileUri, name: fileName, type: mimeType })

  const token = await getAuthToken()

  const headers: any = {}
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: form,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`upload_failed: ${res.status} ${res.statusText} ${text}`)
  }

  const data = await res.json()
  return data as ResumeUploadResponse
}

export async function hasResumeOnServer(): Promise<boolean> {
  try {
    const profileRes = await client.get('/profile')
    const data = profileRes?.data || {}
    const userId = data.userId || data.id || data.uid || data.userIdString
    if (!userId) {
      return false
    }

    const res = await client.get(`/resume/analysis/${encodeURIComponent(userId)}`)
    if (res?.status === 200) return true
    return false
  } catch (err: any) {
    const status = err?.response?.status
    if (status === 404) return false
    return false
  }
}

export async function getSuggestedCareers(): Promise<CareerSuggestion[]> {
  try {
    const profileRes = await client.get('/profile')
    const profileData = profileRes?.data || {}
    const userId =
      profileData.userId || profileData.id || profileData.uid || profileData.userIdString
    if (!userId) {
      return []
    }

    const res = await client.get(`/resume/analysis/${encodeURIComponent(userId)}`)
    const analysisData = res?.data
    if (!analysisData) return []

    const summary = analysisData.resumeAnalysis?.summary || analysisData.summary || analysisData
    const suggested = summary?.suggestedCareers || []

    return Array.isArray(suggested)
      ? suggested.map((s: any) => ({
          title: s.title,
          match: s.match,
          reason: s.reason,
        }))
      : []
  } catch (err: any) {
    return []
  }
}
