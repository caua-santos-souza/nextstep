import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTema } from '../../contexts/TemaContext'

export default function TabsLayout() {
  const { tema } = useTema()
  const cores =
    tema === 'escuro'
      ? {
          tabBarBackground: 'rgba(20, 20, 31, 0.98)',
          tabBarBorder: 'rgba(126, 48, 225, 0.2)',
          tabBarInactive: '#8E8E93',
          tabBarActive: '#C5BAFF',
        }
      : {
          tabBarBackground: 'rgba(255, 255, 255, 0.98)',
          tabBarBorder: 'rgba(126, 48, 225, 0.15)',
          tabBarInactive: '#8E8E93',
          tabBarActive: '#7E30E1',
        }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'none',
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          backgroundColor: cores.tabBarBackground,
          borderTopWidth: 1,
          borderTopColor: cores.tabBarBorder,
          paddingBottom: 20,
          paddingTop: 8,
          shadowColor: tema === 'escuro' ? '#7E30E1' : '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: tema === 'escuro' ? 0.15 : 0.08,
          shadowRadius: 16,
        },
        tabBarActiveTintColor: cores.tabBarActive,
        tabBarInactiveTintColor: cores.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Poppins_500Medium',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        sceneStyle: {
          backgroundColor: tema === 'escuro' ? '#0a0a12' : '#f8f8fb',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
              style={{ transform: [{ translateY: focused ? -2 : 0 }] }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="jornadas"
        options={{
          title: 'Journey+',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'trending-up' : 'trending-up-outline'}
              size={size}
              color={color}
              style={{ transform: [{ translateY: focused ? -2 : 0 }] }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'chatbubble' : 'chatbubble-outline'}
              size={size}
              color={color}
              style={{ transform: [{ translateY: focused ? -2 : 0 }] }}
            />
          ),
          tabBarHideOnKeyboard: true,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size}
              color={color}
              style={{ transform: [{ translateY: focused ? -2 : 0 }] }}
            />
          ),
        }}
      />
    </Tabs>
  )
}
