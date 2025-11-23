import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useTema } from '../../contexts/TemaContext'
import { useAuth } from '../../contexts/AuthContext'
import { Cores } from '../../constants/Cores'
import TextoAnimado from '../../components/TextoAnimado'
import { useState, useEffect, useCallback } from 'react'
import { getProfile } from '../../api/profile'
import type { UserProfile } from '../../types/profile'
import { useFocusEffect } from '@react-navigation/native'

export default function PerfilScreen() {
  const { tema, alternarTema } = useTema()
  const { logout } = useAuth()
  const isDark = tema === 'escuro'
  const router = useRouter()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProfile()
      setProfile(data)
    } catch (err) {
      setError('Erro ao carregar perfil')
    } finally {
      setLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadProfile()
    }, [loadProfile])
  )

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadProfile()
    setRefreshing(false)
  }, [loadProfile])

  const handleSair = async () => {
    try {
      await logout()
      router.replace('/')
    } catch (err) {}
  }

  const nomeUsuario = profile?.name || 'Usuário'
  const profissaoUsuario = profile?.currentJob || 'Sem profissão definida'
  const inicialUsuario = nomeUsuario.charAt(0).toUpperCase()

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <LinearGradient
        colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerOverlay} />
        <Text style={styles.headerTitle}>Perfil</Text>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Cores.roxoPrimario} />
          <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
            Carregando perfil...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={[styles.errorText, isDark && styles.errorTextDark]}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
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
          <View style={[styles.profileCard, isDark && styles.profileCardDark]}>
            <LinearGradient
              colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{inicialUsuario}</Text>
            </LinearGradient>
            <Text style={[styles.userName, isDark && styles.userNameDark]}>{nomeUsuario}</Text>
            <Text style={[styles.userJob, isDark && styles.userJobDark]}>{profissaoUsuario}</Text>
          </View>
          <View style={styles.settingsSection}>
            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
              Configurações
            </Text>
            <View style={[styles.settingItem, isDark && styles.settingItemDark]}>
              <View style={styles.settingInfo}>
                <View style={[styles.settingIcon, isDark && styles.settingIconDark]}>
                  <Ionicons
                    name={isDark ? 'moon' : 'sunny'}
                    size={20}
                    color={isDark ? '#999' : '#666'}
                  />
                </View>
                <Text style={[styles.settingLabel, isDark && styles.settingLabelDark]}>
                  Modo Escuro
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={alternarTema}
                trackColor={{
                  false: 'rgba(126, 48, 225, 0.2)',
                  true: Cores.roxoPrimario,
                }}
                thumbColor="white"
                ios_backgroundColor="rgba(126, 48, 225, 0.2)"
              />
            </View>
            <TouchableOpacity
              style={[styles.settingItem, styles.clickable, isDark && styles.settingItemDark]}
              onPress={() => router.push('/editar-perfil')}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.settingIcon, isDark && styles.settingIconDark]}>
                  <Ionicons name="create-outline" size={20} color={isDark ? '#999' : '#666'} />
                </View>
                <Text style={[styles.settingLabel, isDark && styles.settingLabelDark]}>
                  Editar Perfil
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.settingItem, styles.clickable, isDark && styles.settingItemDark]}
              onPress={() => router.push('/upload-curriculo')}
            >
              <View style={styles.settingInfo}>
                <View style={[styles.settingIcon, isDark && styles.settingIconDark]}>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color={isDark ? '#999' : '#666'}
                  />
                </View>
                <Text style={[styles.settingLabel, isDark && styles.settingLabelDark]}>
                  Atualizar Currículo
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.settingItem, styles.clickable, isDark && styles.settingItemDark]}
              onPress={handleSair}
            >
              <View style={styles.settingInfo}>
                <View style={styles.settingIconDanger}>
                  <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                </View>
                <Text style={styles.settingLabelDanger}>Sair da Conta</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>
          <View style={styles.appVersion}>
            <Text style={styles.versionText}>NextStep v1.0.0</Text>
            <View style={styles.poweredBy}>
              <Text style={styles.versionText}>Powered by </Text>
              <TextoAnimado texto="Mentor AI" estilo={styles.mentorAI} />
            </View>
          </View>
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
    shadowColor: Cores.roxoPrimario,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 10,
    position: 'relative',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'Poppins_700Bold',
    color: 'white',
    position: 'relative',
    zIndex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  profileCardDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.8)',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Cores.roxoPrimario,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  avatarText: {
    fontSize: 36,
    fontFamily: 'Poppins_700Bold',
    color: 'white',
  },
  userName: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    color: '#1C1B29',
    marginBottom: 4,
  },
  userNameDark: {
    color: '#F8F8FB',
  },
  userJob: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  userJobDark: {
    color: '#999',
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#1C1B29',
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionTitleDark: {
    color: '#F8F8FB',
  },
  settingItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 0,
    borderRadius: 16,
    padding: 18,
    paddingHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingItemDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.5)',
  },
  clickable: {},
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIconDark: {},
  settingIconDanger: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: '#1C1B29',
  },
  settingLabelDark: {
    color: '#F8F8FB',
  },
  settingLabelDanger: {
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    color: '#ef4444',
  },
  appVersion: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  versionText: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#999',
    marginVertical: 4,
  },
  poweredBy: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mentorAI: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: '#ef4444',
    textAlign: 'center',
  },
  errorTextDark: {
    color: '#ff6b6b',
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: Cores.roxoPrimario,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
  },
})
