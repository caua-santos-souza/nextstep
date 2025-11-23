import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import { Cores } from '../constants/Cores'
import { useTema } from '../contexts/TemaContext'

interface PropriedadesBotaoVoltar {
  aoClicar?: () => void
  estilo?: ViewStyle
}

export default function BotaoVoltar({ aoClicar, estilo }: PropriedadesBotaoVoltar) {
  const router = useRouter()
  const { tema } = useTema()
  const isDark = tema === 'escuro'

  const handlePress = () => {
    if (aoClicar) aoClicar()
    else router.back()
  }

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85} style={[estilos.wrapper, estilo]}>
      <BlurView
        intensity={55}
        tint={isDark ? 'dark' : 'light'}
        style={[
          estilos.blur,
          { borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.4)' },
        ]}
      >
        <Ionicons
          name="arrow-back"
          size={22}
          color={isDark ? Cores.textoClaro : Cores.roxoPrimario}
        />
      </BlurView>
    </TouchableOpacity>
  )
}

const estilos = StyleSheet.create({
  wrapper: {
    width: 50,
    height: 50,
    borderRadius: 16,
    shadowColor: '#5d1fb8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 18,
  },

  blur: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: 'rgba(150, 100, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',

    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
})
