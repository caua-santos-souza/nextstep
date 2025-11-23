import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface ContextoTema {
  modoEscuro: boolean
  tema: 'claro' | 'escuro'
  alternarTema: () => void
  temaAutomatico: boolean
  definirTemaAutomatico: (automatico: boolean) => void
}

const TemaContext = createContext<ContextoTema | undefined>(undefined)

interface ProvedorTemaProps {
  children: ReactNode
}

const TEMA_STORAGE_KEY = '@nextstep:tema'
const TEMA_AUTOMATICO_KEY = '@nextstep:temaAutomatico'

export function ProvedorTema({ children }: ProvedorTemaProps) {
  const esquemaCor = useColorScheme()
  const [temaAutomatico, setTemaAutomatico] = useState(true)
  const [temaManual, setTemaManual] = useState<'claro' | 'escuro'>('claro')
  const [carregado, setCarregado] = useState(false)

  useEffect(() => {
    const carregarPreferencias = async () => {
      try {
        const [temaStorage, automaticStorage] = await Promise.all([
          AsyncStorage.getItem(TEMA_STORAGE_KEY),
          AsyncStorage.getItem(TEMA_AUTOMATICO_KEY),
        ])
        if (automaticStorage !== null) {
          setTemaAutomatico(automaticStorage === 'true')
        }
        if (temaStorage !== null) {
          setTemaManual(temaStorage as 'claro' | 'escuro')
        }
      } catch (error) {
      } finally {
        setCarregado(true)
      }
    }
    carregarPreferencias()
  }, [])

  const modoEscuro = temaAutomatico ? esquemaCor === 'dark' : temaManual === 'escuro'

  const tema = modoEscuro ? 'escuro' : 'claro'

  const alternarTema = async () => {
    try {
      if (temaAutomatico) {
        setTemaAutomatico(false)
        const novoTema = modoEscuro ? 'claro' : 'escuro'
        setTemaManual(novoTema)
        await Promise.all([
          AsyncStorage.setItem(TEMA_STORAGE_KEY, novoTema),
          AsyncStorage.setItem(TEMA_AUTOMATICO_KEY, 'false'),
        ])
      } else {
        const novoTema = temaManual === 'claro' ? 'escuro' : 'claro'
        setTemaManual(novoTema)
        await AsyncStorage.setItem(TEMA_STORAGE_KEY, novoTema)
      }
    } catch (error) {}
  }

  const definirTemaAutomatico = async (automatico: boolean) => {
    try {
      setTemaAutomatico(automatico)
      await AsyncStorage.setItem(TEMA_AUTOMATICO_KEY, String(automatico))

      if (automatico) {
        const temaSistema = esquemaCor === 'dark' ? 'escuro' : 'claro'
        setTemaManual(temaSistema)
        await AsyncStorage.setItem(TEMA_STORAGE_KEY, temaSistema)
      }
    } catch (error) {}
  }
  if (!carregado) {
    return null
  }

  return (
    <TemaContext.Provider
      value={{
        modoEscuro,
        tema,
        alternarTema,
        temaAutomatico,
        definirTemaAutomatico,
      }}
    >
      {children}
    </TemaContext.Provider>
  )
}

export function usarTema() {
  const contexto = useContext(TemaContext)
  if (contexto === undefined) {
    throw new Error('usarTema deve ser usado dentro de um ProvedorTema')
  }
  return contexto
}

export { usarTema as useTema }
