import React, { useRef, useEffect } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { Cores } from '../constants/Cores'

interface ProgressoCarregamentoProps {
  progress: number
  title: string
  subtitle: string
  isDark?: boolean
  messages?: {
    low: string
    medium: string
    high: string
    final: string
  }
}

export default function ProgressoCarregamento({
  progress,
  title,
  subtitle,
  isDark = false,
  messages = {
    low: 'Iniciando processamento...',
    medium: 'Analisando dados...',
    high: 'Quase lá...',
    final: 'Finalizando...',
  },
}: ProgressoCarregamentoProps) {
  const progressAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const opacityAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [progress])

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ])
    )
    pulseAnimation.start()
    return () => pulseAnimation.stop()
  }, [])

  const currentMessage =
    progress < 30
      ? messages.low
      : progress < 60
        ? messages.medium
        : progress < 90
          ? messages.high
          : messages.final

  return (
    <>
      <View style={styles.mentorContainer}>
        <Animated.View
          style={{
            transform: [{ scale: pulseAnim }],
            opacity: opacityAnim,
          }}
        >
          <LinearGradient
            colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mentorGradient}
          >
            <View style={styles.mentorIcon}>
              <Ionicons name="sparkles" size={64} color="white" />
            </View>
          </LinearGradient>
        </Animated.View>
      </View>

      <Text style={[styles.title, isDark && styles.titleDark]}>{title}</Text>
      <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>{subtitle}</Text>

      <View style={[styles.progressCard, isDark && styles.progressCardDark]}>
        <Text style={[styles.progressText, isDark && styles.progressTextDark]}>
          {Math.round(progress)}%
        </Text>

        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressGradient}
            />
          </Animated.View>
        </View>

        <Text style={[styles.messageText, isDark && styles.messageTextDark]}>{currentMessage}</Text>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  mentorContainer: {
    width: 140,
    height: 140,
    marginBottom: 32,
  },
  mentorGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Cores.roxoPrimario,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  mentorIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: '#1C1B29',
    marginBottom: 12,
    textAlign: 'center',
  },
  titleDark: {
    color: '#F8F8FB',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  subtitleDark: {
    color: '#999',
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  progressCardDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.8)',
  },
  progressText: {
    fontSize: 48,
    fontFamily: 'Poppins_700Bold',
    color: Cores.roxoPrimario,
    marginBottom: 20,
  },
  progressTextDark: {
    color: Cores.lilaSecundario,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
  },
  progressGradient: {
    width: '100%',
    height: '100%',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#666',
  },
  messageTextDark: {
    color: '#999',
  },
})
