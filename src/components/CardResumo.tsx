import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import { Cores } from '../constants/Cores'
import type { JourneySummary } from '../types/journey'

interface Props {
  summary: JourneySummary
  isDark?: boolean
}

export default function CardResumo({ summary, isDark }: Props) {
  return (
    <View style={[styles.card, isDark && styles.cardDark]}>
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <MaskedView
            maskElement={
              <Text style={[styles.statValue, isDark && styles.statValueDark]}>
                {summary?.progressPercent ?? 0}%
              </Text>
            }
          >
            <LinearGradient
              colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={[styles.statValue, { opacity: 0 }]}>
                {summary?.progressPercent ?? 0}%
              </Text>
            </LinearGradient>
          </MaskedView>
          <Text style={[styles.statLabel, isDark && styles.statLabelDark]}>Progresso Total</Text>
        </View>
      </View>
      {summary?.nextMilestone ? (
        <View style={styles.nextMilestone}>
          <Ionicons name="trending-up" size={18} color={Cores.roxoPrimario} />
          <Text style={[styles.milestoneText, isDark && styles.milestoneTextDark]}>
            Próximo marco: {summary.nextMilestone}
          </Text>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(126, 48, 225, 0.1)',
  },
  cardDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(197, 186, 255, 0.1)',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 32, fontFamily: 'Poppins_700Bold', color: Cores.roxoPrimario },
  statValueDark: { color: '#F8F8FB' },
  statLabel: { fontSize: 13, fontFamily: 'Poppins_400Regular', color: '#666' },
  statLabelDark: { color: '#999' },
  statDivider: { width: 1, backgroundColor: 'rgba(0,0,0,0.1)' },
  nextMilestone: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  milestoneText: {
    flex: 1,
    flexShrink: 1,
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#1C1B29',
  },
  milestoneTextDark: { color: '#F8F8FB' },
})
