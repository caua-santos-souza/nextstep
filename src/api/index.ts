import * as authApi from './auth'
import * as profileApi from './profile'
import * as dashboardApi from './dashboard'
import client, { setAuthToken } from './axiosClient'

export { authApi, profileApi, dashboardApi, client as apiClient, setAuthToken }
