import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useTema } from '../../contexts/TemaContext'
import { Cores } from '../../constants/Cores'
import { useEffect, useState } from 'react'
import CardResumo from '../../components/CardResumo'
import ListaEtapas from '../../components/ListaEtapas'
import ListaInsights from '../../components/ListaInsights'
import BotaoFlutuante from '../../components/BotaoFlutuante'
import ModalConclusaoJornada from '../../components/ModalConclusaoJornada'
import { getActiveJourney } from '../../api/journeys'
import { updateStepProgress } from '../../api/journeys'
import { useJourney } from '../../contexts/JourneyContext'
import type { ActiveJourneyResponse } from '../../types'
import { useResume } from '../../contexts/ResumeContext'
import { auth } from '../../../firebaseConfig'

export default function JornadasScreen() {
  const { tema } = useTema()
  const isDark = tema === 'escuro'
  const router = useRouter()

  const { journey, loading, refresh, completedCount } = useJourney()
  const { resumeExists, loading: resumeLoading } = useResume()
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [completionShown, setCompletionShown] = useState(false)

  const hasJourney = !!journey

  useEffect(() => {
    refresh()
  }, [])

  useEffect(() => {
    if (!journey || !journey.steps) return

    const totalSteps = journey.steps.length
    const completedSteps = journey.steps.filter(s => s.status === 'completed').length
    const isComplete = totalSteps > 0 && completedSteps === totalSteps

    if (isComplete && !completionShown) {
      setTimeout(() => {
        setShowCompletionModal(true)
        setCompletionShown(true)
      }, 1000)
    }
  }, [journey, completionShown])

  const derivedSummary = (() => {
    if (!journey) return null
    if (journey.summary) return journey.summary

    const progressPercent =
      typeof journey.overallProgress === 'number' ? journey.overallProgress : 0

    const nextMilestone = journey.nextStep?.title || journey.nextStep?.objective || undefined
    return { progressPercent, nextMilestone }
  })()

  const [refreshing, setRefreshing] = useState(false)

  async function onRefresh() {
    setRefreshing(true)
    try {
      await refresh()
    } catch (e) {
    } finally {
      setRefreshing(false)
    }
  }

  async function handleToggleStep(stepId: string, complete: boolean) {
    try {
      if (journey && complete) {
        const totalSteps = journey.steps?.length || 0
        const currentCompleted = journey.steps?.filter(s => s.status === 'completed').length || 0
        const willBeCompleted = currentCompleted + 1

        if (willBeCompleted === totalSteps && !completionShown) {
          setTimeout(() => {
            setShowCompletionModal(true)
            setCompletionShown(true)
          }, 1000)
        }
      }

      await updateStepProgress(stepId, complete)
      await refresh()
    } catch (e) {
      throw e
    }
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ModalConclusaoJornada
        visible={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        isDark={isDark}
        journeyTitle={journey?.desiredJob || 'sua jornada'}
      />
      <LinearGradient
        colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Sua Journey+</Text>
        <Text style={styles.headerSubtitle}>Acompanhe cada etapa da sua evolução profissional</Text>
      </LinearGradient>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Cores.roxoPrimario]}
            tintColor={Cores.roxoPrimario}
            progressBackgroundColor={isDark ? '#1C1B29' : '#ffffff'}
          />
        }
      >
        {!hasJourney ? (
          <View style={[styles.emptyState, isDark && styles.emptyStateDark]}>
            <LinearGradient
              colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
              style={styles.emptyIcon}
            >
              <Ionicons name="flag-outline" size={36} color="white" />
            </LinearGradient>
            <Text style={[styles.emptyTitle, isDark && styles.emptyTitleDark]}>
              Nenhuma Journey+ ativa
            </Text>
            <Text style={[styles.emptySubtitle, isDark && styles.emptySubtitleDark]}>
              Crie uma jornada personalizada — envie seu currículo primeiro.
            </Text>

            <View style={styles.centerActions}>
              {resumeLoading ? (
                <Text style={[styles.helperText, isDark && styles.helperTextDark]}>
                  Verificando currículo...
                </Text>
              ) : resumeExists ? (
                <TouchableOpacity
                  onPress={() => router.push('/nova-jornada')}
                  style={styles.generateButton}
                >
                  <LinearGradient
                    colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
                    style={styles.generateGradient}
                  >
                    <Text style={styles.generateText}>Gerar Jornada</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => router.push('/upload-curriculo')}
                  style={styles.bigUploadButton}
                >
                  <LinearGradient
                    colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
                    style={styles.bigUploadGradient}
                  >
                    <Ionicons name="cloud-upload-outline" size={20} color="white" />
                    <Text style={styles.bigUploadText}>Enviar Currículo</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <>
            {derivedSummary ? <CardResumo summary={derivedSummary} isDark={isDark} /> : null}
            <ListaEtapas
              steps={journey?.steps ?? []}
              isDark={isDark}
              onToggleStep={handleToggleStep}
            />
            <ListaInsights insights={journey?.insights ?? []} isDark={isDark} />
            <View style={{ height: 150 }} />
          </>
        )}
      </ScrollView>
      {hasJourney && <BotaoFlutuante to="/nova-jornada" />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8e6f0',
  },
  containerDark: {
    backgroundColor: '#0a0a12',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 24,
    shadowColor: Cores.roxoPrimario,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'Poppins_700Bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  summaryCardDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.8)',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
    color: Cores.roxoPrimario,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  statLabelDark: {
    color: '#999',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  nextMilestone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
  },
  milestoneText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#1C1B29',
  },
  milestoneTextDark: {
    color: '#F8F8FB',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#1C1B29',
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: '#F8F8FB',
  },
  stepCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  stepCardDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.6)',
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1C1B29',
    marginBottom: 4,
  },
  stepTitleDark: {
    color: '#F8F8FB',
  },
  stepObjective: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 8,
  },
  stepObjectiveDark: {
    color: '#999',
  },
  stepResources: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#888',
    marginBottom: 8,
  },
  stepResourcesDark: {
    color: '#888',
  },
  stepMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTime: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#888',
  },
  stepTimeDark: {
    color: '#888',
  },
  stepProgress: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  insightCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(126, 48, 225, 0.1)',
  },
  insightCardDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(197, 186, 255, 0.1)',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyStateDark: {},
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1C1B29',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyTitleDark: {
    color: '#F8F8FB',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptySubtitleDark: {
    color: '#999',
  },
  emptyActions: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  emptyButton: {
    width: '80%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  emptyButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  emptyButtonText: {
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
  },
  emptyButtonOutline: {
    backgroundColor: 'transparent',
  },
  emptyButtonTextOutline: {
    color: '#666',
    fontFamily: 'Poppins_600SemiBold',
  },
  emptyButtonTextOutlineDark: {
    color: '#999',
  },
  centerActions: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  bigUploadButton: {
    width: '70%',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  bigUploadGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  bigUploadText: {
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
    marginLeft: 6,
  },
  helperText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  helperTextDark: {
    color: '#999',
  },
  generateButton: {
    width: '60%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  generateGradient: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  generateText: {
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Cores.roxoPrimario}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#1C1B29',
  },
  insightTextDark: {
    color: '#F8F8FB',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    borderRadius: 30,
    shadowColor: Cores.roxoPrimario,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  fabText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: 'white',
  },
})
