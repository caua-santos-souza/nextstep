import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Cores } from '../constants/Cores'

interface PropriedadesBotaoPrimario {
  titulo: string
  aoClicar: () => void
  carregando?: boolean
  desabilitado?: boolean
  estilo?: ViewStyle
  variante?: 'primario' | 'secundario' | 'outline'
}

export default function BotaoPrimario({
  titulo,
  aoClicar,
  carregando = false,
  desabilitado = false,
  estilo,
  variante = 'primario',
}: PropriedadesBotaoPrimario) {
  if (variante === 'primario') {
    return (
      <TouchableOpacity
        onPress={aoClicar}
        disabled={desabilitado || carregando}
        style={[estilos.container, estilo]}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[estilos.gradiente, (desabilitado || carregando) && estilos.desabilitado]}
        >
          {carregando ? (
            <ActivityIndicator color={Cores.textoClaro} />
          ) : (
            <Text style={estilos.texto}>{titulo}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  if (variante === 'secundario') {
    return (
      <TouchableOpacity
        onPress={aoClicar}
        disabled={desabilitado || carregando}
        style={[estilos.container, estilo]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[Cores.lilaSecundario, Cores.gradienteRoxo3]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[estilos.gradiente, (desabilitado || carregando) && estilos.desabilitado]}
        >
          {carregando ? (
            <ActivityIndicator color={Cores.roxoPrimario} />
          ) : (
            <Text style={[estilos.texto, { color: Cores.roxoPrimario }]}>{titulo}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      onPress={aoClicar}
      disabled={desabilitado || carregando}
      style={[estilos.container, estilos.outline, estilo]}
      activeOpacity={0.8}
    >
      {carregando ? (
        <ActivityIndicator color={Cores.roxoPrimario} />
      ) : (
        <Text style={[estilos.texto, { color: Cores.roxoPrimario }]}>{titulo}</Text>
      )}
    </TouchableOpacity>
  )
}

const estilos = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Cores.sobraEscura,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  gradiente: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  texto: {
    color: Cores.textoClaro,
    fontSize: 17,
    fontFamily: 'Poppins_600SemiBold',
  },
  desabilitado: {
    opacity: 0.5,
  },
  outline: {
    backgroundColor: Cores.transparente,
    borderWidth: 1,
    borderColor: Cores.roxoPrimario,
    shadowOpacity: 0,
    elevation: 0,
  },
})
