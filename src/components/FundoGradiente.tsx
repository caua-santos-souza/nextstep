import { ReactNode } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useTema } from '../contexts/TemaContext'

interface Props {
  children: ReactNode
  estilo?: ViewStyle
}

export default function FundoGradiente({ children, estilo }: Props) {
  const { tema } = useTema()
  const modoEscuro = tema === 'escuro'
  if (!modoEscuro) {
    return (
      <LinearGradient
        colors={['#d4c5f0', '#e8dff5', '#f8f8fb', '#e8dff5', '#d4c5f0']}
        locations={[0, 0.2, 0.5, 0.8, 1]}
        style={[estilos.container, estilo]}
      >
        {children}
      </LinearGradient>
    )
  }
  return (
    <View style={[estilos.container, estilo]}>
      <View style={estilos.fundoBase} />
      <LinearGradient
        colors={['rgba(126,48,225,0.65)', 'rgba(126,48,225,0.25)', 'transparent']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.2, y: 0.7 }}
        style={[estilos.glow, estilos.topRightGlow]}
      />
      <LinearGradient
        colors={['rgba(197,186,255,0.32)', 'rgba(197,186,255,0.08)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
        style={[estilos.glow, estilos.topLeftGlow]}
      />
      <View style={estilos.conteudo}>{children}</View>
    </View>
  )
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },

  fundoBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0B0B17',
  },

  glow: {
    position: 'absolute',
    width: 900,
    height: 900,
    borderRadius: 900,
  },

  topRightGlow: {
    top: -0,
    right: -200,
    transform: [{ scaleX: 1.6 }, { scaleY: 1.1 }, { rotate: '20deg' }],
    opacity: 1,
  },

  topLeftGlow: {
    top: -400,
    left: -350,
    transform: [{ scaleX: 1.0 }, { scaleY: 0.7 }, { rotate: '-15deg' }],
  },

  conteudo: {
    flex: 1,
  },
})
