import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import FundoGradiente from '../components/FundoGradiente'
import BotaoPrimario from '../components/BotaoPrimario'
import BotaoVoltar from '../components/BotaoVoltar'
import CampoTexto from '../components/CampoTexto'
import { Cores } from '../constants/Cores'
import { useTema } from '../contexts/TemaContext'
import { useAuth } from '../contexts/AuthContext'
import { auth } from '../../firebaseConfig'
import { completeProfile } from '../api/auth'

export default function TelaCadastro() {
  const router = useRouter()
  const { tema } = useTema()
  const isDark = tema === 'escuro'
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [profissao, setProfissao] = useState('')
  const [senhaVisivel, setSenhaVisivel] = useState(false)
  const { register, loading } = useAuth()

  const handleCadastro = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Email e senha são obrigatórios')
      return
    }
    if (!nome.trim() || !profissao.trim()) {
      Alert.alert('Erro', 'Nome e profissão são obrigatórios')
      return
    }

    const registerResult = await register(email, senha)
    if (!registerResult.success) {
      Alert.alert('Erro', registerResult.error || 'Erro ao criar conta')
      return
    }

    try {
      const currentUser = auth.currentUser
      const token = currentUser ? await currentUser.getIdToken() : null

      if (token) {
        try {
          const resp = await completeProfile(token, { name: nome, currentJob: profissao })
          Alert.alert('Sucesso', 'Conta criada e perfil salvo com sucesso', [
            {
              text: 'OK',
              onPress: () => {
                setTimeout(() => {
                  router.push('/upload-curriculo')
                  setTimeout(() => {
                    if (typeof loading === 'boolean') {
                    }
                  }, 100)
                }, 100)
              },
            },
          ])
          return
        } catch (apiErr: any) {
          Alert.alert('Aviso', 'Conta criada, mas houve um erro ao enviar dados ao backend.', [
            {
              text: 'OK',
              onPress: () => {
                setTimeout(() => {
                  router.push('/upload-curriculo')
                }, 100)
              },
            },
          ])
          return
        }
      } else {
        Alert.alert(
          'Aviso',
          'Conta criada, mas não foi possível obter token para enviar dados ao backend.',
          [
            {
              text: 'OK',
              onPress: () => {
                setTimeout(() => {
                  router.push('/upload-curriculo')
                }, 100)
              },
            },
          ]
        )
        return
      }
    } catch (err: any) {
      Alert.alert(
        'Aviso',
        'Conta criada, mas houve erro ao enviar dados adicionais. Tente novamente mais tarde.',
        [
          {
            text: 'OK',
            onPress: () => {
              setTimeout(() => {
                router.push('/upload-curriculo')
              }, 100)
            },
          },
        ]
      )
      return
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
          <View style={estilos.header}>
            <BotaoVoltar />
          </View>
          <View style={estilos.headerTexto}>
            <Text style={[estilos.titulo, isDark && estilos.tituloDark]}>Crie sua conta</Text>
            <Text style={[estilos.subtitulo, isDark && estilos.subtituloDark]}>
              Comece sua jornada profissional
            </Text>
          </View>
          <View style={estilos.formContainer}>
            <CampoTexto
              rotulo="Nome completo"
              placeholder="Nome completo"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              modoEscuro={isDark}
              iconeEsquerda={
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={isDark ? Cores.textoSecundarioClaro : Cores.textoSecundarioEscuro}
                />
              }
            />
            <CampoTexto
              rotulo="Email"
              placeholder="Email"
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
            <CampoTexto
              rotulo="Senha"
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!senhaVisivel}
              modoEscuro={isDark}
              iconeEsquerda={
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={isDark ? Cores.textoSecundarioClaro : Cores.textoSecundarioEscuro}
                />
              }
              iconeDireita={
                <Ionicons
                  name={senhaVisivel ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={isDark ? Cores.textoSecundarioClaro : Cores.textoSecundarioEscuro}
                />
              }
              aoClicarIconeDireita={() => setSenhaVisivel(!senhaVisivel)}
            />
            <CampoTexto
              rotulo="Profissão atual"
              placeholder="Profissão atual"
              value={profissao}
              onChangeText={setProfissao}
              autoCapitalize="words"
              modoEscuro={isDark}
              iconeEsquerda={
                <Ionicons
                  name="briefcase-outline"
                  size={20}
                  color={isDark ? Cores.textoSecundarioClaro : Cores.textoSecundarioEscuro}
                />
              }
            />
            <BotaoPrimario
              titulo="Criar Conta"
              aoClicar={handleCadastro}
              carregando={loading}
              estilo={estilos.botaoCadastro}
            />
          </View>
          <View style={estilos.rodape}>
            <Text style={[estilos.textoRodape, isDark && estilos.textoRodapeDark]}>
              Já possui conta?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={estilos.textoLinkLogin}>Entrar</Text>
            </TouchableOpacity>
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
  header: {
    marginBottom: 24,
  },
  headerTexto: {
    marginBottom: 32,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
    color: Cores.textoEscuro,
    marginBottom: 8,
    textAlign: 'center',
  },
  tituloDark: {
    color: Cores.textoClaro,
  },
  subtitulo: {
    fontSize: 16,
    color: Cores.textoSecundarioEscuro,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
  },
  subtituloDark: {
    color: Cores.textoSecundarioClaro,
  },
  formContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  botaoCadastro: {
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
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
  },
  textoRodapeDark: {
    color: Cores.textoSecundarioClaro,
  },
  textoLinkLogin: {
    color: Cores.roxoPrimario,
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
  },
})
