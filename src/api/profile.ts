import client from './axiosClient'
import type { UserProfile, ProfileUpdateRequest, DeleteProfileResponse } from '../types/profile'

export async function getProfile(): Promise<UserProfile> {
  const response = await client.get<UserProfile>('/profile')
  return response.data
}

export async function updateProfile(data: ProfileUpdateRequest): Promise<UserProfile> {
  const response = await client.put<UserProfile>('/profile', data)
  return response.data
}

export async function deleteProfile(): Promise<DeleteProfileResponse> {
  const response = await client.delete<DeleteProfileResponse>('/profile')
  return response.data
}
