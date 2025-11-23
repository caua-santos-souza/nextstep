import { useState } from 'react'
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native'
import { Cores } from '../constants/Cores'

interface PropriedadesCampoTexto extends TextInputProps {
  rotulo?: string
  erro?: string
  modoEscuro?: boolean
  estilo?: ViewStyle
  iconeEsquerda?: React.ReactNode
  iconeDireita?: React.ReactNode
  aoClicarIconeDireita?: () => void
}

export default function CampoTexto({
  rotulo,
  erro,
  modoEscuro = false,
  estilo,
  iconeEsquerda,
  iconeDireita,
  aoClicarIconeDireita,
  ...propriedadesInput
}: PropriedadesCampoTexto) {
  const [focado, setFocado] = useState(false)

  return (
    <View style={[estilos.container, estilo]}>
      {rotulo && (
        <Text
          style={[estilos.rotulo, { color: modoEscuro ? Cores.textoClaro : Cores.textoEscuro }]}
        >
          {rotulo}
        </Text>
      )}

      <View
        style={[
          estilos.inputContainer,
          {
            backgroundColor: 'transparent',
            borderColor: erro
              ? Cores.erro
              : focado
                ? Cores.roxoPrimario
                : 'rgba(126, 48, 225, 0.15)',
          },
        ]}
      >
        {iconeEsquerda && <View style={estilos.iconeEsquerda}>{iconeEsquerda}</View>}

        <TextInput
          style={[
            estilos.input,
            {
              color: modoEscuro ? Cores.textoClaro : Cores.textoEscuro,
              flex: 1,
            },
          ]}
          placeholderTextColor={
            modoEscuro ? Cores.textoSecundarioClaro : Cores.textoSecundarioEscuro
          }
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          {...propriedadesInput}
        />

        {iconeDireita && (
          <TouchableOpacity
            onPress={aoClicarIconeDireita}
            style={estilos.iconeDireita}
            disabled={!aoClicarIconeDireita}
          >
            {iconeDireita}
          </TouchableOpacity>
        )}
      </View>

      {erro && <Text style={estilos.textoErro}>{erro}</Text>}
    </View>
  )
}

const estilos = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  rotulo: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    minHeight: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
    fontFamily: 'Poppins_400Regular',
  },
  iconeEsquerda: {
    marginRight: 12,
  },
  iconeDireita: {
    marginLeft: 12,
  },
  textoErro: {
    color: Cores.erro,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontFamily: 'Poppins_400Regular',
  },
})
