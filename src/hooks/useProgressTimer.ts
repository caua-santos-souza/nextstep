import { useState, useRef } from 'react'
import { Animated } from 'react-native'
export function useProgressTimer(duration = 30000) {
  const [progress, setProgress] = useState(0)
  const progressAnim = useRef(new Animated.Value(0)).current
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const apiDoneRef = useRef(false)

  const startTimer = () => {
    setProgress(0)
    progressAnim.setValue(0)
    apiDoneRef.current = false

    const start = Date.now()
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000
      const durationInSeconds = duration / 1000

      if (elapsed < durationInSeconds) {
        const progressValue = Math.min(99, Math.round((elapsed / durationInSeconds) * 99))
        setProgress(progressValue)
        Animated.timing(progressAnim, {
          toValue: progressValue,
          duration: 300,
          useNativeDriver: false,
        }).start()
      } else {
        setProgress(99)
        Animated.timing(progressAnim, {
          toValue: 99,
          duration: 300,
          useNativeDriver: false,
        }).start()

        if (apiDoneRef.current && timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
    }, 300)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const completeProgress = () => {
    apiDoneRef.current = true
    setProgress(100)
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 400,
      useNativeDriver: false,
    }).start()
    stopTimer()
  }

  const resetProgress = () => {
    stopTimer()
    setProgress(0)
    progressAnim.setValue(0)
    apiDoneRef.current = false
  }

  return {
    progress,
    progressAnim,
    startTimer,
    stopTimer,
    completeProgress,
    resetProgress,
  }
}
