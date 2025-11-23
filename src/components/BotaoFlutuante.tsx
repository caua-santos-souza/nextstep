import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Cores } from '../constants/Cores'

interface Props {
  to: string
}

export default function BotaoFlutuante({ to }: Props) {
  const router = useRouter()
  return (
    <TouchableOpacity style={styles.fab} activeOpacity={0.9} onPress={() => router.push(to)}>
      <LinearGradient
        colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.fabGradient}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.fabText}>Gerar nova jornada</Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  fab: { position: 'absolute', bottom: 100, right: 20, borderRadius: 30 },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  fabText: { fontSize: 15, fontFamily: 'Poppins_600SemiBold', color: 'white' },
})
