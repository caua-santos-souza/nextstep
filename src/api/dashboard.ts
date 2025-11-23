import client from './axiosClient'
import type { DashboardResponse } from '../types/dashboard'

export async function getDashboard(): Promise<DashboardResponse> {
  const response = await client.get<DashboardResponse>('/dashboard')
  return response.data
}
