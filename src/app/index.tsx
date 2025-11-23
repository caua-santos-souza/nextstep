import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import FundoGradiente from '../components/FundoGradiente'
import BotaoPrimario from '../components/BotaoPrimario'
import CampoTexto from '../components/CampoTexto'
import TextoAnimado from '../components/TextoAnimado'
import { Cores } from '../constants/Cores'
import { useTema } from '../contexts/TemaContext'
import { useAuth } from '../contexts/AuthContext'

export default function TelaLogin() {
  const router = useRouter()
  const { tema } = useTema()
  const isDark = tema === 'escuro'
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [senhaVisivel, setSenhaVisivel] = useState(false)
  const { loginAccount, loading } = useAuth()

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Email e senha são obrigatórios')
      return
    }

    const loginResult = await loginAccount(email, senha)
    if (loginResult.success) {
      router.replace('/(tabs)/home')
    } else {
      Alert.alert('Erro', loginResult.error || 'Falha ao entrar')
    }
  }

  return (
    <FundoGradiente>
      <View style={estilos.container}>
        <View style={estilos.headerLogo}>
          <Image
            source={require('../../assets/images/logo banner png.png')}
            style={estilos.logoBanner}
            resizeMode="contain"
          />
        </View>

        <Text style={[estilos.subtitulo, isDark && estilos.subtituloDark]}>
          Dê o próximo passo na sua carreira
        </Text>

        <View style={estilos.formContainer}>
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

          <BotaoPrimario
            titulo="Entrar"
            aoClicar={handleLogin}
            carregando={loading}
            estilo={estilos.botaoEntrar}
          />

          <TouchableOpacity
            onPress={() => router.push('/esqueci-senha')}
            style={estilos.linkEsqueciSenha}
          >
            <Text style={estilos.textoLink}>Esqueci minha senha</Text>
          </TouchableOpacity>
        </View>
        <View style={estilos.divisor}>
          <View style={[estilos.linhaDivisor, isDark && estilos.linhaDivisorDark]} />
          <Text style={[estilos.textoDivisor, isDark && estilos.textoDivisorDark]}>ou</Text>
          <View style={[estilos.linhaDivisor, isDark && estilos.linhaDivisorDark]} />
        </View>
        <View style={estilos.rodape}>
          <Text style={[estilos.textoRodape, isDark && estilos.textoRodapeDark]}>
            Não tem uma conta?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/cadastro')}>
            <Text style={estilos.textoLinkCadastro}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
        <View style={estilos.containerPoweredBy}>
          <Text style={estilos.textoPoweredBy}>Powered by </Text>
          <TextoAnimado texto="Mentor AI" estilo={estilos.textoMentorAI} />
        </View>
      </View>
    </FundoGradiente>
  )
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headerLogo: {
    alignItems: 'center',
    marginBottom: 0,
  },
  logoBanner: {
    width: 375,
    height: 175,
    marginTop: 2,
  },
  subtitulo: {
    fontSize: 16,
    color: Cores.textoSecundarioEscuro,
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Poppins_400Regular',
  },
  subtituloDark: {
    color: Cores.textoSecundarioClaro,
  },
  formContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  botaoEntrar: {
    marginTop: 8,
  },
  linkEsqueciSenha: {
    alignItems: 'center',
    marginTop: 16,
  },
  textoLink: {
    color: Cores.roxoPrimario,
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  textoMostrarSenha: {
    fontSize: 18,
  },
  divisor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  linhaDivisor: {
    flex: 1,
    height: 1,
    backgroundColor: Cores.bordaVidro,
  },
  linhaDivisorDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  textoDivisor: {
    marginHorizontal: 16,
    color: Cores.textoSecundarioEscuro,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  textoDivisorDark: {
    color: Cores.textoSecundarioClaro,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoRodape: {
    color: Cores.textoSecundarioEscuro,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  textoRodapeDark: {
    color: Cores.textoSecundarioClaro,
  },
  textoLinkCadastro: {
    color: Cores.roxoPrimario,
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  containerPoweredBy: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  textoPoweredBy: {
    textAlign: 'center',
    color: 'rgba(102, 102, 102, 0.5)',
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
  textoMentorAI: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
  },
})
