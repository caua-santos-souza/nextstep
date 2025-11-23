import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const BASE_URL = 'https://nextstep-2tdsb.azurewebsites.net/api'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
})

client.interceptors.request.use(async config => {
  try {
    const token = await AsyncStorage.getItem('@token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (e) {}
  return config
})

client.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    if (
      !originalRequest?._retry &&
      (error.code === 'ENOTFOUND' ||
        error.message?.includes('Network') ||
        error.code === 'ECONNABORTED')
    ) {
      originalRequest._retry = true
      await new Promise(res => setTimeout(res, 3000))
      return client(originalRequest)
    }

    return Promise.reject(error)
  }
)

export async function setAuthToken(token: string | null) {
  if (token) {
    await AsyncStorage.setItem('@token', token)
  } else {
    await AsyncStorage.removeItem('@token')
  }
}

export default client
