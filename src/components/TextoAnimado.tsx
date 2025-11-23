import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, TextStyle, View } from 'react-native'
import { Cores } from '../constants/Cores'

interface PropriedadesTextoAnimado {
  texto: string
  estilo?: TextStyle
}

export default function TextoAnimado({ texto, estilo }: PropriedadesTextoAnimado) {
  const animacaoRef = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(animacaoRef, {
        toValue: texto.length + 3,
        duration: 1200,
        useNativeDriver: false,
      })
    ).start()
  }, [texto.length])

  const getLetraColor = (index: number) => {
    return animacaoRef.interpolate({
      inputRange: [index - 2, index - 1, index, index + 1, index + 2],
      outputRange: [
        Cores.roxoPrimario,
        Cores.roxoPrimario,
        Cores.lilaSecundario,
        Cores.roxoPrimario,
        Cores.roxoPrimario,
      ],
      extrapolate: 'clamp',
    })
  }

  return (
    <View style={estilos.container}>
      {texto.split('').map((letra, index) => (
        <Animated.Text
          key={index}
          style={[
            estilos.texto,
            estilo,
            {
              color: getLetraColor(index),
            },
          ]}
        >
          {letra}
        </Animated.Text>
      ))}
    </View>
  )
}

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  texto: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
  },
})
