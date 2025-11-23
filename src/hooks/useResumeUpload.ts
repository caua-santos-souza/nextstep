import { useState } from 'react'
import { Alert } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import { uploadResumeFetch as uploadResume } from '../api/resume'
import { useProgressTimer } from './useProgressTimer'

type UploadStage = 'select' | 'analyzing' | 'results'

export function useResumeUpload(onSuccess?: () => void) {
  const [stage, setStage] = useState<UploadStage>('select')
  const [fileName, setFileName] = useState('')
  const [resumeAnalysis, setResumeAnalysis] = useState<any | null>(null)

  const { progress, progressAnim, startTimer, completeProgress, resetProgress } =
    useProgressTimer(30000)

  const retryUpload = async (uri: string, name: string, mimeType: string, attempts = 3) => {
    let lastErr: any = null

    for (let i = 0; i < attempts; i++) {
      try {
        const uploadPromise = uploadResume(uri, name, mimeType)
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 60000)
        )

        const response = await Promise.race([uploadPromise, timeoutPromise])
        return response as any
      } catch (err: any) {
        lastErr = err

        const isNetworkErr =
          err?.message === 'timeout' ||
          /network/i.test(err?.message || '') ||
          err?.code === 'ERR_NETWORK' ||
          err?.isAxiosError

        if (!isNetworkErr) {
          break
        }

        const backoffMs = 1000 * Math.pow(2, i)
        await new Promise(r => setTimeout(r, backoffMs))
      }
    }

    throw lastErr || new Error('upload_failed')
  }

  const handleSelectFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      copyToCacheDirectory: true,
    })

    if (result.assets && result.assets.length > 0) {
      const file = result.assets[0]
      setFileName(file.name || 'Arquivo selecionado')
      setStage('analyzing')

      startTimer()

      try {
        const response = await retryUpload(
          file.uri,
          file.name,
          file.mimeType || 'application/pdf',
          3
        )
        completeProgress()

        const res = response as any
        setResumeAnalysis(res.resumeAnalysis || res.summary || null)

        if (onSuccess) {
          try {
            await onSuccess()
          } catch {}
        }

        setTimeout(() => setStage('results'), 800)
      } catch (err: any) {
        resetProgress()

        let msg = 'Falha ao enviar currículo. Tente novamente.'
        if (err?.message === 'timeout') {
          msg =
            'A análise demorou demais para responder. Tente novamente ou envie um arquivo menor.'
        } else if (/network/i.test(err?.message || '') || err?.code === 'ERR_NETWORK') {
          msg = 'Erro de rede durante o upload. Verifique a conexão e tente novamente.'
        }

        Alert.alert('Erro', msg)
        setStage('select')
        setResumeAnalysis(null)
      }
    } else if ((result as any).type === 'success') {
      const file = result as any
      setFileName(file.name || 'Arquivo selecionado')
      setStage('analyzing')

      startTimer()

      try {
        const response = await uploadResume(file.uri, file.name, file.mimeType || 'application/pdf')
        completeProgress()

        if (onSuccess) {
          try {
            await onSuccess()
          } catch {}
        }

        setTimeout(() => setStage('results'), 800)
      } catch (err: any) {
        resetProgress()
        Alert.alert('Erro', 'Falha ao enviar currículo. Tente novamente.')
        setStage('select')
      }
    }
  }

  const resetUpload = () => {
    setStage('select')
    setFileName('')
    setResumeAnalysis(null)
    resetProgress()
  }

  return {
    stage,
    fileName,
    resumeAnalysis,
    progress,
    progressAnim,
    handleSelectFile,
    resetUpload,
  }
}
