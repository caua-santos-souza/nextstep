import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { JourneyStep } from '../types/journey'
import { Cores } from '../constants/Cores'

interface Props {
  steps: JourneyStep[]
  isDark?: boolean
  onToggleStep?: (stepId: string, newCompleted: boolean) => Promise<void>
}

export default function ListaEtapas({ steps, isDark, onToggleStep }: Props) {
  if (!steps || steps.length === 0) return null

  const [loadingStep, setLoadingStep] = useState<string | null>(null)

  const getStatusIcon = (status?: string) => {
    if (status === 'completed') return 'checkmark-circle'
    if (status === 'in-progress') return 'time-outline'
    return 'ellipse-outline'
  }

  const getStatusColor = (status?: string) => {
    if (status === 'completed') return '#4CAF50'
    if (status === 'in-progress') return Cores.roxoPrimario
    return '#999'
  }

  return (
    <>
      <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
        Etapas da Jornada
      </Text>
      {steps.map((step, index) => {
        const stepId = step.stepId
        if (!stepId) {
        }
        return (
          <TouchableOpacity
            key={stepId || index}
            onPress={async () => {
              if (!onToggleStep || !stepId) return
              const willComplete = step.status !== 'completed'
              try {
                setLoadingStep(stepId)
                await onToggleStep(stepId, willComplete)
              } catch (e) {
              } finally {
                setLoadingStep(null)
              }
            }}
            activeOpacity={0.8}
            style={[styles.stepCardTouchable]}
          >
            <View style={[styles.stepCard, isDark && styles.stepCardDark]}>
              <View
                style={[styles.stepIcon, { backgroundColor: `${getStatusColor(step.status)}33` }]}
              >
                <Ionicons
                  name={getStatusIcon(step.status) as any}
                  size={20}
                  color={getStatusColor(step.status)}
                />
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, isDark && styles.stepTitleDark]}>{step.title}</Text>
                {step.objective ? (
                  <Text style={[styles.stepObjective, isDark && styles.stepObjectiveDark]}>
                    {step.objective}
                  </Text>
                ) : null}
                {step.resources ? (
                  <Text style={[styles.stepResources, isDark && styles.stepResourcesDark]}>
                    📚 {step.resources}
                  </Text>
                ) : null}
                <View style={styles.stepMeta}>
                  <Text style={[styles.stepTime, isDark && styles.stepTimeDark]}>
                    ⏱️ {(step as any).estimatedTime ?? step.time ?? '—'}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {(() => {
                      const progressPercent =
                        typeof step.progress === 'number'
                          ? step.progress
                          : step.progress === true
                            ? 100
                            : 0
                      return (
                        <Text style={[styles.stepProgress, { color: getStatusColor(step.status) }]}>
                          {progressPercent}%
                        </Text>
                      )
                    })()}
                    {loadingStep === stepId && (
                      <ActivityIndicator size="small" color={getStatusColor(step.status)} />
                    )}
                  </View>
                </View>
                {(() => {
                  const progressPercent =
                    typeof step.progress === 'number'
                      ? step.progress
                      : step.progress === true
                        ? 100
                        : 0
                  return progressPercent > 0 && progressPercent < 100 ? (
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${progressPercent}%`,
                            backgroundColor: getStatusColor(step.status),
                          },
                        ]}
                      />
                    </View>
                  ) : null
                })()}
              </View>
            </View>
          </TouchableOpacity>
        )
      })}
    </>
  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#1C1B29',
    marginBottom: 16,
  },
  sectionTitleDark: { color: '#F8F8FB' },
  stepCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(126, 48, 225, 0.1)',
  },
  stepCardDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(197, 186, 255, 0.1)',
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  stepContent: { flex: 1 },
  stepTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1C1B29',
    marginBottom: 4,
  },
  stepTitleDark: { color: '#F8F8FB' },
  stepObjective: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 8,
  },
  stepObjectiveDark: { color: '#999' },
  stepResources: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#888',
    marginBottom: 8,
  },
  stepResourcesDark: { color: '#888' },
  stepMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTime: { fontSize: 12, fontFamily: 'Poppins_400Regular', color: '#888' },
  stepTimeDark: { color: '#888' },
  stepProgress: { fontSize: 14, fontFamily: 'Poppins_600SemiBold' },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  stepCardTouchable: { borderRadius: 16, overflow: 'hidden' },
})
