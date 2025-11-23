import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View, StyleSheet } from 'react-native'
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'
import { useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { ProvedorTema, useTema } from '../contexts/TemaContext'
import { AuthProvider } from '../contexts/AuthContext'
import { ResumeProvider } from '../contexts/ResumeContext'
import { JourneyProvider } from '../contexts/JourneyContext'

SplashScreen.preventAutoHideAsync()

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
})

function RootLayoutNav() {
  const { tema } = useTema()
  const isDark = tema === 'escuro'

  return (
    <View style={[estilos.container, { backgroundColor: isDark ? '#0a0a12' : '#e8e6f0' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            contentStyle: {
              backgroundColor: 'transparent',
            },
          }}
        />
        <Stack.Screen
          name="cadastro"
          options={{
            contentStyle: {
              backgroundColor: 'transparent',
            },
            animation: 'slide_from_right',
            presentation: 'transparentModal',
          }}
        />
        <Stack.Screen
          name="esqueci-senha"
          options={{
            contentStyle: {
              backgroundColor: 'transparent',
            },
            animation: 'slide_from_right',
            presentation: 'transparentModal',
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            contentStyle: {
              backgroundColor: 'transparent',
            },
          }}
        />
        <Stack.Screen
          name="editar-perfil"
          options={{
            contentStyle: {
              backgroundColor: 'transparent',
            },
            animation: 'slide_from_right',
            presentation: 'transparentModal',
          }}
        />
        <Stack.Screen
          name="upload-curriculo"
          options={{
            contentStyle: {
              backgroundColor: 'transparent',
            },
            animation: 'slide_from_right',
            presentation: 'transparentModal',
          }}
        />
        <Stack.Screen
          name="nova-jornada"
          options={{
            contentStyle: {
              backgroundColor: 'transparent',
            },
            animation: 'slide_from_right',
            presentation: 'transparentModal',
          }}
        />
      </Stack>
    </View>
  )
}

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <ProvedorTema>
      <AuthProvider>
        <ResumeProvider>
          <JourneyProvider>
            <RootLayoutNav />
          </JourneyProvider>
        </ResumeProvider>
      </AuthProvider>
    </ProvedorTema>
  )
}
