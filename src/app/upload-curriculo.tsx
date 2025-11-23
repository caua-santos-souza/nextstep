import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native'
import { useRef, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useTema } from '../contexts/TemaContext'
import { useResume } from '../contexts/ResumeContext'
import { Cores } from '../constants/Cores'
import BotaoPrimario from '../components/BotaoPrimario'
import BotaoVoltar from '../components/BotaoVoltar'
import { useResumeUpload } from '../hooks/useResumeUpload'

export default function UploadCurriculoScreen() {
  const { tema } = useTema()
  const isDark = tema === 'escuro'
  const router = useRouter()
  const { refresh } = useResume()

  const { stage, fileName, resumeAnalysis, progress, progressAnim, handleSelectFile } =
    useResumeUpload(refresh)
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (stage === 'select') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start()
    }
  }, [stage])

  const handleSkip = () => {
    Alert.alert('Pular por enquanto?', 'Você pode enviar seu currículo depois nas configurações.', [
      { text: 'Continuar enviando', style: 'cancel' },
      { text: 'Pular', onPress: () => router.replace('/(tabs)/home') },
    ])
  }

  const handleViewJourney = () => {
    router.replace('/(tabs)/jornadas')
  }

  const renderSelectStage = () => (
    <>
      <Animated.View style={[styles.uploadIcon, { transform: [{ scale: pulseAnim }] }]}>
        <LinearGradient
          colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconGradient}
        >
          <Ionicons name="cloud-upload-outline" size={64} color="white" />
        </LinearGradient>
      </Animated.View>

      <Text style={[styles.title, isDark && styles.titleDark]}>Envie seu currículo</Text>
      <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
        Nossa IA irá analisar suas competências e criar uma jornada personalizada para você
      </Text>

      <View style={[styles.formatsCard, isDark && styles.formatsCardDark]}>
        <Text style={[styles.formatsTitle, isDark && styles.formatsTitleDark]}>
          Formatos aceitos:
        </Text>
        <View style={styles.formatsList}>
          <View style={styles.formatItem}>
            <Ionicons name="document-text" size={18} color={Cores.roxoPrimario} />
            <Text style={[styles.formatText, isDark && styles.formatTextDark]}>PDF</Text>
          </View>
          <View style={styles.formatItem}>
            <Ionicons name="document-text" size={18} color={Cores.roxoPrimario} />
            <Text style={[styles.formatText, isDark && styles.formatTextDark]}>DOC</Text>
          </View>
          <View style={styles.formatItem}>
            <Ionicons name="document-text" size={18} color={Cores.roxoPrimario} />
            <Text style={[styles.formatText, isDark && styles.formatTextDark]}>DOCX</Text>
          </View>
        </View>
      </View>
      <BotaoPrimario titulo="Escolher arquivo" aoClicar={handleSelectFile} />
      <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
        <Text style={[styles.skipText, isDark && styles.skipTextDark]}>Pular por enquanto</Text>
      </TouchableOpacity>
    </>
  )

  const renderAnalyzingStage = () => (
    <>
      <View style={styles.mentorContainer}>
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
      </View>
      <Text style={[styles.title, isDark && styles.titleDark]}>Analisando currículo</Text>
      <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
        Nossa IA está processando {fileName}
      </Text>
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
        <Text style={[styles.analyzingText, isDark && styles.analyzingTextDark]}>
          {progress < 30
            ? 'Extraindo informações...'
            : progress < 60
              ? 'Identificando competências...'
              : progress < 90
                ? 'Detectando lacunas...'
                : 'Finalizando análise...'}
        </Text>
      </View>
    </>
  )

  const renderResultsStage = () => (
    <>
      <View style={[styles.uploadIcon, styles.successIcon]}>
        <LinearGradient
          colors={['#4CAF50', '#66BB6A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconGradient}
        >
          <Ionicons name="checkmark-circle" size={64} color="white" />
        </LinearGradient>
      </View>
      <Text style={[styles.title, isDark && styles.titleDark]}>Análise concluída!</Text>
      <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
        {resumeAnalysis
          ? 'Veja os dados extraídos do seu currículo!'
          : 'Identificamos suas principais competências e áreas de desenvolvimento'}
      </Text>
      <View style={[styles.resultsCard, isDark && styles.resultsCardDark]}>
        {(() => {
          const summary = resumeAnalysis?.summary || resumeAnalysis || null
          return (
            <>
              <View style={styles.resultItem}>
                <View style={[styles.resultIcon, { backgroundColor: '#4CAF5020' }]}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                </View>
                <View style={styles.resultContent}>
                  <Text style={[styles.resultLabel, isDark && styles.resultLabelDark]}>
                    Competências identificadas
                  </Text>
                  <Text style={styles.resultValue}>
                    {summary?.currentSkills?.length
                      ? (() => {
                          const skills = summary.currentSkills.map((s: any) =>
                            typeof s === 'object' && s !== null
                              ? s.name || s.titulo || JSON.stringify(s)
                              : String(s)
                          )
                          const visible = skills.slice(0, 5)
                          const remaining = Math.max(0, skills.length - visible.length)
                          return `${visible.join(', ')}${remaining > 0 ? `, ... e ${remaining} a mais` : ''}`
                        })()
                      : 'Nenhuma competência identificada'}
                  </Text>
                </View>
              </View>
              <View style={styles.resultItem}>
                <View style={[styles.resultIcon, { backgroundColor: '#FF9F0020' }]}>
                  <Ionicons name="bulb" size={24} color="#FF9F00" />
                </View>
                <View style={styles.resultContent}>
                  <Text style={[styles.resultLabel, isDark && styles.resultLabelDark]}>
                    Lacunas detectadas
                  </Text>
                  <Text style={styles.resultValue}>
                    {summary?.gaps?.length
                      ? (() => {
                          const gaps = summary.gaps.map((g: any) =>
                            typeof g === 'object' && g !== null
                              ? g.name || g.titulo || JSON.stringify(g)
                              : String(g)
                          )
                          return `${gaps[0]}${gaps.length > 1 ? '...' : ''}`
                        })()
                      : 'Nenhuma lacuna detectada'}
                  </Text>
                </View>
              </View>
              <View style={styles.resultItem}>
                <View style={[styles.resultIcon, { backgroundColor: `${Cores.roxoPrimario}20` }]}>
                  <Ionicons name="trophy" size={24} color={Cores.roxoPrimario} />
                </View>
                <View style={styles.resultContent}>
                  <Text style={[styles.resultLabel, isDark && styles.resultLabelDark]}>
                    Pontos fortes
                  </Text>
                  <Text style={styles.resultValue}>
                    {summary?.currentJob || summary?.experienceLevel
                      ? `${summary.currentJob || ''}${summary.experienceLevel ? ' (' + summary.experienceLevel + ')' : ''}`
                      : 'Não identificado'}
                  </Text>
                </View>
              </View>
            </>
          )
        })()}
      </View>
      <BotaoPrimario titulo="Ver minha Journey+" aoClicar={handleViewJourney} />
      <TouchableOpacity onPress={() => router.replace('/(tabs)/home')} style={styles.skipButton}>
        <Text style={[styles.skipText, isDark && styles.skipTextDark]}>Ir para Home</Text>
      </TouchableOpacity>
    </>
  )

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <LinearGradient
        colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {stage === 'select' && <BotaoVoltar />}
        <Text style={styles.headerTitle}>
          {stage === 'results' ? 'Sucesso!' : 'Upload de Currículo'}
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {stage === 'select' && renderSelectStage()}
        {stage === 'analyzing' && renderAnalyzingStage()}
        {stage === 'results' && renderResultsStage()}
      </View>
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
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    width: 140,
    height: 140,
    marginBottom: 32,
  },
  analyzingIcon: {},
  successIcon: {},
  iconGradient: {
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
  formatsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  formatsCardDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.8)',
  },
  formatsTitle: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: '#666',
    marginBottom: 12,
  },
  formatsTitleDark: {
    color: '#999',
  },
  formatsList: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  formatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: `${Cores.roxoPrimario}10`,
    borderRadius: 8,
  },
  formatText: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: Cores.roxoPrimario,
  },
  formatTextDark: {
    color: Cores.lilaSecundario,
  },
  skipButton: {
    marginTop: 16,
    padding: 12,
  },
  skipText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#666',
  },
  skipTextDark: {
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
  analyzingText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#666',
  },
  analyzingTextDark: {
    color: '#999',
  },
  resultsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    gap: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  resultsCardDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.8)',
  },
  resultItem: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultContent: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginBottom: 2,
  },
  resultLabelDark: {
    color: '#999',
  },
  resultValue: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: Cores.roxoPrimario,
  },
})
