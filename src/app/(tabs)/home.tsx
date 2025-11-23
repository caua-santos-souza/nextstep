import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useTema } from '../../contexts/TemaContext'
import { useRouter } from 'expo-router'
import { Cores } from '../../constants/Cores'
import { useState, useCallback } from 'react'
import { getDashboard } from '../../api/dashboard'
import { getProfile } from '../../api/profile'
import type { DashboardResponse } from '../../types/dashboard'
import type { UserProfile } from '../../types/profile'
import { useFocusEffect } from '@react-navigation/native'
import { useJourney } from '../../contexts/JourneyContext'

const { width } = Dimensions.get('window')

export default function HomeScreen() {
  const { tema } = useTema()
  const isDark = tema === 'escuro'
  const router = useRouter()
  const { journey } = useJourney()

  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAllSkills, setShowAllSkills] = useState(false)

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [profileData, dashboardData] = await Promise.allSettled([getProfile(), getDashboard()])
      if (profileData.status === 'fulfilled') {
        setProfile(profileData.value)
      }
      if (dashboardData.status === 'fulfilled') {
        setDashboard(dashboardData.value)
      } else if (
        dashboardData.status === 'rejected' &&
        dashboardData.reason?.response?.status === 400
      ) {
        setDashboard(null)
      }
    } catch (err: any) {
      setError('Erro ao carregar dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadDashboard()
    }, [loadDashboard])
  )

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadDashboard()
    setRefreshing(false)
  }, [loadDashboard])

  const topSuggestedPaths =
    dashboard?.suggestedPaths
      ?.sort((a, b) => {
        const matchA = parseInt(a.match.replace('%', ''))
        const matchB = parseInt(b.match.replace('%', ''))
        return matchB - matchA
      })
      .slice(0, 3) || []

  const hasData = dashboard !== null

  const displayedSkills = showAllSkills
    ? dashboard?.skills || []
    : dashboard?.skills?.slice(0, 5) || []
  const hasMoreSkills = (dashboard?.skills?.length || 0) > 5

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <LinearGradient
        colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerOverlay} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Bem-vindo(a), {profile?.name || 'Usuário'}!</Text>
          {dashboard?.user?.desiredJob && (
            <Text style={styles.headerSubtitle}>
              Profissão desejada:{' '}
              <Text style={styles.headerSubtitleBold}>{dashboard.user.desiredJob}</Text>
            </Text>
          )}
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Cores.roxoPrimario} />
          <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
            Carregando dashboard...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
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
          {!hasData ? (
            <View style={[styles.emptyState, isDark && styles.emptyStateDark]}>
              <LinearGradient
                colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.emptyIcon}
              >
                <Ionicons name="sparkles" size={36} color="white" />
              </LinearGradient>
              <Text style={[styles.emptyTitle, isDark && styles.emptyTitleDark]}>
                Sua Journey+ ainda não foi criada
              </Text>
              <Text style={[styles.emptySubtitle, isDark && styles.emptySubtitleDark]}>
                Envie seu currículo para começar a ver recomendações e trilhas personalizadas.
              </Text>
              <View style={styles.emptyActions}>
                <TouchableOpacity
                  onPress={() => router.push('/upload-curriculo')}
                  style={styles.emptyButton}
                >
                  <LinearGradient
                    colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
                    style={styles.emptyButtonGradient}
                  >
                    <Text style={styles.emptyButtonText}>Enviar Currículo</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <View style={[styles.nextStepCard, isDark && styles.nextStepCardDark]}>
                <LinearGradient
                  colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardIcon}
                >
                  <Ionicons name="flag-outline" size={24} color="white" />
                </LinearGradient>
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>
                    {dashboard?.nextStep ? 'Seu Próximo Passo' : 'Comece sua Journey+'}
                  </Text>
                  {dashboard?.nextStep ? (
                    <>
                      <Text style={[styles.cardText, isDark && styles.cardTextDark]}>
                        {dashboard.nextStep.title}
                      </Text>
                      <View style={styles.progressBar}>
                        <LinearGradient
                          colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[
                            styles.progressFill,
                            { width: `${journey?.overallProgress || 0}%` },
                          ]}
                        />
                      </View>
                      <Text style={[styles.progressText, isDark && styles.progressTextDark]}>
                        Progresso geral: {journey?.overallProgress || 0}%
                      </Text>
                    </>
                  ) : (
                    <Text style={[styles.cardText, isDark && styles.cardTextDark]}>
                      Crie uma jornada personalizada e alcance seus objetivos profissionais
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.btnViewJourney}
                  onPress={() =>
                    dashboard?.nextStep
                      ? router.push('/(tabs)/jornadas')
                      : router.push('/nova-jornada')
                  }
                >
                  <LinearGradient
                    colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.btnGradient}
                  >
                    <Text style={styles.btnText}>
                      {dashboard?.nextStep ? 'Ver Journey+' : 'Criar Jornada'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {dashboard?.skills && dashboard.skills.length > 0 && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
                    Suas Habilidades
                  </Text>
                  <View style={styles.skillsList}>
                    {displayedSkills.map((skill, index) => (
                      <View key={index} style={[styles.skillItem, isDark && styles.skillItemDark]}>
                        <View style={styles.skillHeader}>
                          <Text style={[styles.skillName, isDark && styles.skillNameDark]}>
                            {skill.name}
                          </Text>
                          <Text
                            style={[styles.skillPercentage, isDark && styles.skillPercentageDark]}
                          >
                            {skill.progress}%
                          </Text>
                        </View>
                        <View style={styles.skillBar}>
                          <LinearGradient
                            colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.skillFill, { width: `${skill.progress}%` }]}
                          />
                        </View>
                      </View>
                    ))}
                  </View>
                  {hasMoreSkills && !showAllSkills && (
                    <TouchableOpacity
                      style={[styles.loadMoreButton, isDark && styles.loadMoreButtonDark]}
                      onPress={() => setShowAllSkills(true)}
                    >
                      <Text style={[styles.loadMoreText, isDark && styles.loadMoreTextDark]}>
                        Carregar mais ({dashboard.skills.length - 5} habilidades)
                      </Text>
                      <Ionicons
                        name="chevron-down"
                        size={16}
                        color={isDark ? Cores.lilaSecundario : Cores.roxoPrimario}
                      />
                    </TouchableOpacity>
                  )}
                  {showAllSkills && hasMoreSkills && (
                    <TouchableOpacity
                      style={[styles.loadMoreButton, isDark && styles.loadMoreButtonDark]}
                      onPress={() => setShowAllSkills(false)}
                    >
                      <Text style={[styles.loadMoreText, isDark && styles.loadMoreTextDark]}>
                        Mostrar menos
                      </Text>
                      <Ionicons
                        name="chevron-up"
                        size={16}
                        color={isDark ? Cores.lilaSecundario : Cores.roxoPrimario}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {dashboard?.trends && dashboard.trends.length > 0 && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
                    Tendências do Futuro
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.trendsGrid}
                  >
                    {dashboard.trends.map((trend, index) => (
                      <View key={index} style={[styles.trendCard, isDark && styles.trendCardDark]}>
                        <View style={styles.trendIcon}>
                          <Ionicons
                            name="sparkles-outline"
                            size={28}
                            color={index % 2 === 0 ? Cores.roxoPrimario : Cores.lilaSecundario}
                          />
                        </View>
                        <Text style={[styles.trendTitle, isDark && styles.trendTitleDark]}>
                          {trend.title}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {topSuggestedPaths.length > 0 && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
                    Trilhas Sugeridas pela IA
                  </Text>
                  <View style={styles.pathsList}>
                    {topSuggestedPaths.map((path, index) => (
                      <View key={index} style={[styles.pathItem, isDark && styles.pathItemDark]}>
                        <View style={styles.pathInfo}>
                          <Text style={[styles.pathTitle, isDark && styles.pathTitleDark]}>
                            {path.title}
                          </Text>
                          <Text style={[styles.matchBadge, isDark && styles.matchBadgeDark]}>
                            {path.match} compatível
                          </Text>
                        </View>
                        <Ionicons
                          name="trending-up"
                          size={20}
                          color={isDark ? Cores.lilaSecundario : Cores.roxoPrimario}
                          style={{ opacity: 0.6 }}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}
              <View style={{ height: 100 }} />
            </>
          )}
        </ScrollView>
      )}
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
    paddingBottom: 32,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: Cores.roxoPrimario,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 10,
    position: 'relative',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    position: 'relative',
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'Poppins_700Bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  headerSubtitleBold: {
    fontFamily: 'Poppins_600SemiBold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  nextStepCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    elevation: 120,
  },
  nextStepCardDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.5)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardContent: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1C1B29',
    marginBottom: 8,
  },
  cardTitleDark: {
    color: '#F8F8FB',
  },
  cardText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 12,
  },
  cardTextDark: {
    color: '#999',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(126, 48, 225, 0.1)',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Cores.roxoPrimario,
    borderRadius: 10,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: Cores.roxoPrimario,
  },
  progressTextDark: {
    color: Cores.lilaSecundario,
  },
  btnViewJourney: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  btnGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: 'white',
  },
  section: {
    marginBottom: 32,
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
  skillsList: {
    gap: 16,
  },
  skillItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(126, 48, 225, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  skillItemDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.3)',
    borderColor: 'rgba(197, 186, 255, 0.1)',
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillName: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1C1B29',
  },
  skillNameDark: {
    color: '#F8F8FB',
  },
  skillPercentage: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: Cores.roxoPrimario,
  },
  skillPercentageDark: {
    color: Cores.lilaSecundario,
  },
  skillBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(126, 48, 225, 0.1)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  skillFill: {
    height: '100%',
    borderRadius: 10,
  },
  trendsGrid: {
    paddingBottom: 8,
    gap: 12,
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
  trendCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(126, 48, 225, 0.1)',
    borderRadius: 16,
    padding: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 110,
  },
  trendCardDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.3)',
    borderColor: 'rgba(197, 186, 255, 0.1)',
  },
  trendIcon: {
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendTitle: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1C1B29',
    textAlign: 'center',
  },
  trendTitleDark: {
    color: '#F8F8FB',
  },
  pathsList: {
    gap: 12,
  },
  pathItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(126, 48, 225, 0.1)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pathItemDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.3)',
    borderColor: 'rgba(197, 186, 255, 0.1)',
  },
  pathInfo: {
    flex: 1,
  },
  pathTitle: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1C1B29',
    marginBottom: 4,
  },
  pathTitleDark: {
    color: '#F8F8FB',
  },
  matchBadge: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: Cores.roxoPrimario,
  },
  matchBadgeDark: {
    color: Cores.lilaSecundario,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  loadingTextDark: {
    color: '#999',
  },
  cardObjective: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#999',
    marginTop: 4,
  },
  cardObjectiveDark: {
    color: '#666',
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(126, 48, 225, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(126, 48, 225, 0.2)',
  },
  loadMoreButtonDark: {
    backgroundColor: 'rgba(197, 186, 255, 0.1)',
    borderColor: 'rgba(197, 186, 255, 0.2)',
  },
  loadMoreText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: Cores.roxoPrimario,
  },
  loadMoreTextDark: {
    color: Cores.lilaSecundario,
  },
})
