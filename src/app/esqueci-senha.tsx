import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import FundoGradiente from '../components/FundoGradiente'
import BotaoVoltar from '../components/BotaoVoltar'
import CampoTexto from '../components/CampoTexto'
import BotaoPrimario from '../components/BotaoPrimario'
import { Cores } from '../constants/Cores'
import { useTema } from '../contexts/TemaContext'
import { useAuth } from '../contexts/AuthContext'

export default function EsqueciSenha() {
  const router = useRouter()
  const { tema } = useTema()
  const isDark = tema === 'escuro'
  const [email, setEmail] = useState('')
  const { resetPassword, loading } = useAuth()

  const handleEnviarCodigo = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, digite seu email')
      return
    }

    const resetResult = await resetPassword(email)
    if (resetResult.success) {
      Alert.alert('Email enviado!', 'Verifique sua caixa de entrada para redefinir sua senha.', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ])
    } else {
      Alert.alert('Erro', resetResult.error || 'Falha ao enviar email')
    }
  }

  return (
    <FundoGradiente>
      <ScrollView
        style={estilos.scrollView}
        contentContainerStyle={estilos.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.container}>
          <BotaoVoltar estilo={estilos.botaoVoltar} />

          <View style={estilos.headerTexto}>
            <Text style={[estilos.titulo, isDark && estilos.tituloDark]}>Esqueceu sua senha?</Text>
            <Text style={[estilos.subtitulo, isDark && estilos.subtituloDark]}>
              Digite seu email para receber o código de recuperação
            </Text>
          </View>

          <View style={estilos.formContainer}>
            <CampoTexto
              rotulo="Email"
              placeholder="Digite seu email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              modoEscuro={isDark}
              iconeEsquerda={
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={isDark ? Cores.textoSecundarioClaro : Cores.textoSecundarioEscuro}
                />
              }
            />

            <BotaoPrimario
              titulo="Enviar código"
              aoClicar={handleEnviarCodigo}
              carregando={loading}
              estilo={estilos.botaoEnviar}
            />
          </View>

          <View style={estilos.rodape}>
            <Text style={[estilos.textoRodape, isDark && estilos.textoRodapeDark]}>
              Lembrou sua senha?{' '}
            </Text>
            <Text style={estilos.textoLinkLogin} onPress={() => router.back()}>
              Voltar ao login
            </Text>
          </View>
        </View>
      </ScrollView>
    </FundoGradiente>
  )
}

const estilos = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  botaoVoltar: {
    marginBottom: 24,
  },
  headerTexto: {
    marginBottom: 32,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: Cores.textoEscuro,
    marginBottom: 12,
    textAlign: 'center',
  },
  tituloDark: {
    color: Cores.textoClaro,
  },
  subtitulo: {
    fontSize: 15,
    color: Cores.textoSecundarioEscuro,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  subtituloDark: {
    color: Cores.textoSecundarioClaro,
  },
  formContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  botaoEnviar: {
    marginTop: 8,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  textoRodape: {
    color: Cores.textoSecundarioEscuro,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  textoRodapeDark: {
    color: Cores.textoSecundarioClaro,
  },
  textoLinkLogin: {
    color: Cores.roxoPrimario,
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
})
