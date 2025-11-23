import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useTema } from '../contexts/TemaContext'
import { Cores } from '../constants/Cores'
import BotaoVoltar from '../components/BotaoVoltar'
import CardCarreira from '../components/CardCarreira'
import ProgressoCarregamento from '../components/ProgressoCarregamento'
import { getSuggestedCareers } from '../api/resume'
import { generateJourney } from '../api/journeys'
import { useJourney } from '../contexts/JourneyContext'
import type { CareerSuggestion } from '../types/career'

export default function NovaJornadaScreen() {
  const { tema } = useTema()
  const isDark = tema === 'escuro'
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProfession, setSelectedProfession] = useState<CareerSuggestion | null>(null)
  const [suggestedCareers, setSuggestedCareers] = useState<CareerSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const { refresh: refreshJourney } = useJourney()

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const apiDoneRef = useRef(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getSuggestedCareers()
      .then(list => {
        if (!mounted) return
        setSuggestedCareers(list)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const filteredProfessions = suggestedCareers.filter(
    prof =>
      prof.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prof.reason || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleGenerate = async () => {
    if (!selectedProfession) return
    try {
      setGenerating(true)
      setProgress(0)
      apiDoneRef.current = false

      const start = Date.now()
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - start) / 1000
        if (elapsed < 30) {
          const progressValue = Math.min(99, Math.round((elapsed / 30) * 99))
          setProgress(progressValue)
        } else {
          setProgress(99)
          if (apiDoneRef.current && timerRef.current) {
            clearInterval(timerRef.current)
          }
        }
      }, 300)

      await generateJourney(selectedProfession.title)
      apiDoneRef.current = true

      setProgress(100)
      if (timerRef.current) clearInterval(timerRef.current)

      try {
        await refreshJourney()
      } catch (e) {}

      setTimeout(() => {
        router.replace('/(tabs)/jornadas')
      }, 800)
    } catch (err: any) {
      apiDoneRef.current = true
      if (timerRef.current) clearInterval(timerRef.current)
      alert('Não foi possível gerar a jornada. Tente novamente mais tarde.')
      setGenerating(false)
      setProgress(0)
    }
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <LinearGradient
        colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {!generating && <BotaoVoltar />}
        <Text style={styles.headerTitle}>{generating ? 'Gerando Jornada' : 'Nova Jornada'}</Text>
      </LinearGradient>

      {generating ? (
        <View style={styles.loadingContainer}>
          <ProgressoCarregamento
            progress={progress}
            title="Criando sua jornada"
            subtitle={`Gerando plano personalizado para ${selectedProfession?.title}`}
            isDark={isDark}
            messages={{
              low: 'Analisando suas competências...',
              medium: 'Identificando etapas necessárias...',
              high: 'Estruturando o plano de estudos...',
              final: 'Finalizando sua jornada personalizada...',
            }}
          />
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.introSection}>
            <View style={styles.aiIconLarge}>
              <LinearGradient
                colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.aiIconGradient}
              >
                <Ionicons name="sparkles" size={32} color="white" />
              </LinearGradient>
            </View>
            <Text style={[styles.introTitle, isDark && styles.introTitleDark]}>
              Escolha sua Profissão do Futuro
            </Text>
            <Text style={[styles.introSubtitle, isDark && styles.introSubtitleDark]}>
              Selecione a carreira que deseja seguir e criaremos uma jornada personalizada para
              você!
            </Text>
          </View>
          <View style={[styles.searchBox, isDark && styles.searchBoxDark]}>
            <Ionicons name="search" size={20} color={isDark ? '#999' : '#666'} />
            <TextInput
              style={[styles.searchInput, isDark && styles.searchInputDark]}
              placeholder="Buscar profissão..."
              placeholderTextColor={isDark ? '#666' : '#999'}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          <View style={styles.professionsList}>
            {loading ? (
              <ActivityIndicator size="large" color={Cores.roxoPrimario} />
            ) : (
              filteredProfessions.map((profession, idx) => (
                <CardCarreira
                  key={profession.title + idx}
                  career={profession}
                  selected={selectedProfession?.title === profession.title}
                  onPress={() => setSelectedProfession(profession)}
                />
              ))
            )}
          </View>
          {!loading && filteredProfessions.length === 0 && (
            <View style={styles.noResults}>
              <Ionicons name="search-outline" size={48} color="#999" />
              <Text style={[styles.noResultsText, isDark && styles.noResultsTextDark]}>
                Nenhuma profissão encontrada
              </Text>
            </View>
          )}

          <View style={{ height: selectedProfession ? 120 : 40 }} />
        </ScrollView>
      )}
      {selectedProfession && !generating && (
        <View style={[styles.fixedButtonArea, isDark && styles.fixedButtonAreaDark]}>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerate}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.generateButtonGradient}
            >
              {generating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={20} color="white" />
                  <Text style={styles.generateButtonText}>
                    Gerar Jornada para {selectedProfession.title}
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8fb',
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
    marginTop: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  aiIconLarge: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  aiIconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Cores.roxoPrimario,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  introTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#1C1B29',
    marginBottom: 12,
    textAlign: 'center',
  },
  introTitleDark: {
    color: '#F8F8FB',
  },
  introSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  introSubtitleDark: {
    color: '#999',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  searchBoxDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.8)',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: '#1C1B29',
  },
  searchInputDark: {
    color: '#F8F8FB',
  },
  professionsList: {
    gap: 12,
  },
  professionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  professionCardDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.6)',
  },
  professionCardSelected: {
    borderColor: Cores.roxoPrimario,
    backgroundColor: `${Cores.roxoPrimario}10`,
    shadowColor: Cores.roxoPrimario,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 100,
  },
  professionCardSelectedDark: {
    backgroundColor: 'rgba(126, 48, 225, 0.15)',
  },
  professionInfo: {
    marginBottom: 12,
  },
  professionTitle: {
    fontSize: 17,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1C1B29',
    marginBottom: 8,
  },
  professionTitleDark: {
    color: '#F8F8FB',
  },
  professionTitleSelected: {
    color: Cores.roxoPrimario,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: `${Cores.lilaSecundario}30`,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: Cores.roxoPrimario,
  },
  professionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchPercentage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  matchText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#666',
  },
  matchTextDark: {
    color: '#999',
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: '#999',
    marginTop: 16,
  },
  noResultsTextDark: {
    color: '#666',
  },
  fixedButtonArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 32,
    backgroundColor: '#f8f8fb',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  fixedButtonAreaDark: {
    backgroundColor: '#0a0a12',
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  generateButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Cores.roxoPrimario,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  generateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  generateButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: 'white',
  },
})
