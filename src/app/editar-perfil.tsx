import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native'
import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useTema } from '../contexts/TemaContext'
import { useAuth } from '../contexts/AuthContext'
import { Cores } from '../constants/Cores'
import CampoTexto from '../components/CampoTexto'
import BotaoPrimario from '../components/BotaoPrimario'
import BotaoVoltar from '../components/BotaoVoltar'
import { getProfile, updateProfile, deleteProfile } from '../api/profile'
import { deleteUser } from 'firebase/auth'
import { auth } from '../../firebaseConfig'

export default function EditarPerfilScreen() {
  const { tema } = useTema()
  const { logout } = useAuth()
  const isDark = tema === 'escuro'
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentJob, setCurrentJob] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      setLoadingProfile(true)
      const profile = await getProfile()
      setName(profile.name)
      setEmail(profile.email)
      setCurrentJob(profile.currentJob || '')
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados do perfil')
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleSave = async () => {
    if (!name.trim() || !email.trim() || !currentJob.trim()) {
      Alert.alert('Atenção', 'Todos os campos são obrigatórios')
      return
    }

    setLoading(true)
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        currentJob: currentJob.trim(),
      })

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ])
    } catch (error: any) {
      Alert.alert('Erro', error?.response?.data?.message || 'Não foi possível atualizar o perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false)
    setDeleting(true)

    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new Error('Usuário não autenticado')
      }

      await deleteProfile()
      await deleteUser(currentUser)
      await logout()

      setTimeout(() => {
        Alert.alert('Conta Excluída', 'Sua conta foi excluída com sucesso.', [
          { text: 'OK', onPress: () => router.replace('/') },
        ])
      }, 300)
    } catch (error: any) {
      setDeleting(false)

      let errorMessage = 'Não foi possível excluir a conta'
      if (error?.code === 'auth/requires-recent-login') {
        errorMessage = 'Por segurança, faça login novamente antes de excluir sua conta'
      } else if (error?.response?.status === 500) {
        errorMessage = 'Erro no servidor. Tente novamente mais tarde.'
      } else if (error?.message) {
        errorMessage = error.message
      }

      Alert.alert('Erro', errorMessage)
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
        <BotaoVoltar />
        <Text style={styles.headerTitle}>Editar Perfil</Text>
      </LinearGradient>

      {loadingProfile ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Cores.roxoPrimario} />
          <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
            Carregando dados...
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.formCard, isDark && styles.formCardDark]}>
            <CampoTexto
              rotulo="Nome completo"
              value={name}
              onChangeText={setName}
              placeholder="Seu nome completo"
              modoEscuro={isDark}
              autoCapitalize="words"
            />

            <CampoTexto
              rotulo="E-mail"
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              modoEscuro={isDark}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <CampoTexto
              rotulo="Cargo atual"
              value={currentJob}
              onChangeText={setCurrentJob}
              placeholder="Seu cargo ou profissão"
              modoEscuro={isDark}
              autoCapitalize="words"
            />

            <BotaoPrimario titulo="Salvar alterações" aoClicar={handleSave} carregando={loading} />
          </View>
          <View style={[styles.dangerZone, isDark && styles.dangerZoneDark]}>
            <Text style={[styles.dangerTitle, isDark && styles.dangerTitleDark]}>
              Zona de Perigo
            </Text>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => setShowDeleteModal(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              <Text style={styles.deleteButtonText}>Excluir minha conta</Text>
            </TouchableOpacity>

            <Text style={[styles.dangerWarning, isDark && styles.dangerWarningDark]}>
              Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos.
            </Text>
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {deleting && (
        <View style={styles.deletingOverlay}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.deletingText}>Excluindo conta...</Text>
        </View>
      )}

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            <View style={styles.modalIcon}>
              <Ionicons name="warning" size={48} color="#FF3B30" />
            </View>

            <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>Excluir conta?</Text>

            <Text style={[styles.modalText, isDark && styles.modalTextDark]}>
              Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os
              seus dados serão perdidos.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, isDark && styles.cancelButtonDark]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={[styles.cancelButtonText, isDark && styles.cancelButtonTextDark]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.confirmButtonText}>Sim, excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  formCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  formCardDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.8)',
  },
  dangerZone: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginTop: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 59, 48, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  dangerZoneDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.8)',
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  dangerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#FF3B30',
    marginBottom: 16,
  },
  dangerTitleDark: {
    color: '#FF6B66',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
  },
  deleteButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FF3B30',
  },
  dangerWarning: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginTop: 12,
    lineHeight: 18,
  },
  dangerWarningDark: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  modalContentDark: {
    backgroundColor: '#1C1B29',
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    color: '#1C1B29',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalTitleDark: {
    color: '#F8F8FB',
  },
  modalText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  modalTextDark: {
    color: '#999',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  cancelButtonDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  cancelButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1C1B29',
  },
  cancelButtonTextDark: {
    color: '#F8F8FB',
  },
  confirmButton: {
    backgroundColor: '#FF3B30',
  },
  confirmButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: 'white',
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
  deletingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  deletingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: 'white',
  },
})
