import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Cores } from '../constants/Cores'
import type { CareerSuggestion } from '../types/career'
import { useTema } from '../contexts/TemaContext'

type Props = {
  career: CareerSuggestion
  selected?: boolean
  onPress?: () => void
}

export default function CardCarreira({ career, selected, onPress }: Props) {
  const { tema } = useTema()
  const isDark = tema === 'escuro'
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isDark && styles.cardDark,
        selected && (isDark ? styles.cardSelectedDark : styles.cardSelected),
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.left}>
        <Text
          style={[styles.title, isDark && styles.titleDark, selected && styles.titleSelected]}
          numberOfLines={2}
        >
          {career.title}
        </Text>
        {career.reason ? (
          <Text style={[styles.reason, isDark && styles.reasonDark]} numberOfLines={2}>
            {career.reason}
          </Text>
        ) : null}
      </View>
      <View style={styles.right}>
        <Ionicons name="sparkles" size={20} color={Cores.roxoPrimario} />
        {career.match ? (
          <Text style={[styles.match, isDark && styles.matchDark]}>{career.match}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(126, 48, 225, 0.1)',
  },
  cardDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(197, 186, 255, 0.1)',
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: Cores.roxoPrimario,
    backgroundColor: `${Cores.roxoPrimario}10`,
  },
  cardSelectedDark: {
    backgroundColor: 'rgba(126, 48, 225, 0.15)',
    borderWidth: 2,
    borderColor: Cores.roxoPrimario,
  },
  left: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1C1B29',
    marginBottom: 6,
  },
  titleDark: {
    color: '#F8F8FB',
  },
  titleSelected: {
    color: Cores.roxoPrimario,
  },
  reason: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  reasonDark: {
    color: '#999',
  },
  right: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
  },
  match: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: Cores.roxoPrimario,
  },
  matchDark: {
    color: Cores.roxoPrimario,
  },
})
