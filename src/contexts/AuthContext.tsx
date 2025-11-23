import React, { createContext, PropsWithChildren, useState, useEffect } from 'react'
import { auth } from '../../firebaseConfig'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth'
import { setAuthToken } from '../api'
import { router, usePathname } from 'expo-router'
import { getErrorMessage } from '../utils/firebaseErrors'

type AuthContextProps = {
  loginAccount: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  user?: FirebaseUser
  error?: any
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<FirebaseUser | undefined>()
  const [error, setError] = useState<any>()
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user || undefined)
      ;(async () => {
        try {
          if (user) {
            const token = await user.getIdToken()
            await setAuthToken(token)
          } else {
            await setAuthToken(null)
          }
        } catch (e) {}
      })()
      setLoading(false)
      if (user) {
        if (
          pathname === '/loginPage' ||
          pathname === '/registerPage' ||
          pathname === '/resetPasswordPage'
        ) {
          router.replace('/(tabs)')
        }
      } else {
        if (pathname?.startsWith('/(tabs)')) {
          router.replace('/loginPage')
        }
      }
    })

    return () => unsubscribe()
  }, [pathname])

  const loginAccount = async (email: string, password: string) => {
    setLoading(true)
    setError(undefined)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      setUser(result.user)
      try {
        const token = await result.user.getIdToken()
        await setAuthToken(token)
      } catch (e) {}
      return { success: true }
    } catch (err: any) {
      setError(err)
      return { success: false, error: getErrorMessage(err) }
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string) => {
    setLoading(true)
    setError(undefined)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      setUser(result.user)
      try {
        const token = await result.user.getIdToken()
        await setAuthToken(token)
      } catch (e) {}
      return { success: true }
    } catch (err: any) {
      setError(err)
      return { success: false, error: getErrorMessage(err) }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    setLoading(true)
    setError(undefined)
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (err: any) {
      setError(err)
      return { success: false, error: getErrorMessage(err) }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await signOut(auth)
      setUser(undefined)
      await setAuthToken(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        loginAccount,
        logout,
        register,
        resetPassword,
        user,
        error,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext)

export { AuthProvider, AuthContext }
