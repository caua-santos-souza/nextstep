import AsyncStorage from '@react-native-async-storage/async-storage'
import client from '../api/axiosClient'

export async function getAuthToken(): Promise<string | null> {
  return await AsyncStorage.getItem('@token')
}

export function getBaseUrl(): string {
  return (client.defaults && (client.defaults as any).baseURL) || ''
}

export function buildApiUrl(endpoint: string): string {
  const baseUrl = getBaseUrl()
  return `${baseUrl.replace(/\/$/, '')}${endpoint}`
}

export async function buildAuthHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken()
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}
