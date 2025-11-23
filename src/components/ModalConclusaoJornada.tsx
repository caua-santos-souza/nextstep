import React from 'react'
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { Cores } from '../constants/Cores'
import { useRouter } from 'expo-router'

interface ModalConclusaoJornadaProps {
  visible: boolean
  onClose: () => void
  isDark?: boolean
  journeyTitle?: string
}

export default function ModalConclusaoJornada({
  visible,
  onClose,
  isDark = false,
  journeyTitle = 'sua jornada',
}: ModalConclusaoJornadaProps) {
  const router = useRouter()

  const handleUpdateResume = () => {
    onClose()
    router.push('/upload-curriculo')
  }

  const handleNewJourney = () => {
    onClose()
    router.push('/nova-jornada')
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, isDark && styles.modalContainerDark]}>
          {/* Mentor AI celebrando */}
          <View style={styles.mentorContainer}>
            <LinearGradient
              colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mentorGradient}
            >
              <View style={styles.mentorIcon}>
                <Ionicons name="trophy" size={64} color="white" />
              </View>
            </LinearGradient>
          </View>

          <Text style={[styles.title, isDark && styles.titleDark]}>Parabéns!</Text>

          <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
            Você concluiu {journeyTitle}!
          </Text>

          <Text style={[styles.message, isDark && styles.messageDark]}>
            Agora é hora de atualizar seu currículo com as novas competências e certificados que
            você adquiriu durante esta jornada. Isso vai te destacar ainda mais no mercado!
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleUpdateResume}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Ionicons name="cloud-upload-outline" size={20} color="white" />
                <Text style={styles.primaryButtonText}>Atualizar Currículo</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, isDark && styles.secondaryButtonDark]}
              onPress={handleNewJourney}
              activeOpacity={0.8}
            >
              <Ionicons name="rocket-outline" size={20} color={Cores.roxoPrimario} />
              <Text style={[styles.secondaryButtonText, isDark && styles.secondaryButtonTextDark]}>
                Criar Nova Jornada
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
              <Text style={[styles.closeButtonText, isDark && styles.closeButtonTextDark]}>
                Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  modalContainerDark: {
    backgroundColor: '#1C1B29',
  },
  mentorContainer: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  mentorGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Cores.roxoPrimario,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  mentorIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
    color: '#1C1B29',
    marginBottom: 8,
    textAlign: 'center',
  },
  titleDark: {
    color: '#F8F8FB',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: Cores.roxoPrimario,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitleDark: {
    color: Cores.lilaSecundario,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  messageDark: {
    color: '#999',
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Cores.roxoPrimario,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: 'white',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: `${Cores.roxoPrimario}15`,
    borderWidth: 1,
    borderColor: `${Cores.roxoPrimario}40`,
  },
  secondaryButtonDark: {
    backgroundColor: `${Cores.lilaSecundario}20`,
    borderColor: `${Cores.lilaSecundario}40`,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: Cores.roxoPrimario,
  },
  secondaryButtonTextDark: {
    color: Cores.lilaSecundario,
  },
  closeButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#666',
  },
  closeButtonTextDark: {
    color: '#999',
  },
})
