import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { JourneyInsight } from '../types/journey'
import { Cores } from '../constants/Cores'

interface Props {
  insights: JourneyInsight[]
  isDark?: boolean
}

export default function ListaInsights({ insights, isDark }: Props) {
  if (!insights || insights.length === 0) return null

  return (
    <>
      <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Insights Rápidos</Text>
      {insights.map((insight, index) => (
        <View key={index} style={[styles.card, isDark && styles.cardDark]}>
          <View style={styles.iconWrap}>
            <Ionicons name={insight.icon as any} size={20} color={Cores.roxoPrimario} />
          </View>
          <Text style={[styles.text, isDark && styles.textDark]}>{insight.text}</Text>
        </View>
      ))}
    </>
  )
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 18, fontFamily: 'Poppins_700Bold', color: '#1C1B29', marginBottom: 16 },
  sectionTitleDark: { color: '#F8F8FB' },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(126, 48, 225, 0.1)',
  },
  cardDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(197, 186, 255, 0.1)',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Cores.roxoPrimario}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, fontSize: 13, fontFamily: 'Poppins_500Medium', color: '#1C1B29' },
  textDark: { color: '#F8F8FB' },
})
