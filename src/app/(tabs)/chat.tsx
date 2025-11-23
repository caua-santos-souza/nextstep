import { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTema } from '../../contexts/TemaContext'
import { sendChatMessage } from '../../api/chat'
import { Cores } from '../../constants/Cores'
import { LinearGradient } from 'expo-linear-gradient'

interface Message {
  id: number
  type: 'ai' | 'user'
  text: string
}

export default function ChatScreen() {
  const { tema } = useTema()
  const isDark = tema === 'escuro'
  const scrollViewRef = useRef<ScrollView>(null)
  const TABBAR_HEIGHT = 80

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      text: 'Olá! Sou o Mentor AI. Como posso ajudar você hoje na sua jornada profissional?',
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  const dot1Anim = useRef(new Animated.Value(0.4)).current
  const dot2Anim = useRef(new Animated.Value(0.6)).current
  const dot3Anim = useRef(new Animated.Value(0.8)).current

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }, [messages, isTyping])

  useEffect(() => {
    if (isTyping) {
      const createPulse = (animValue: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(animValue, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0.4,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        )
      }

      const animation = Animated.parallel([
        createPulse(dot1Anim, 0),
        createPulse(dot2Anim, 200),
        createPulse(dot3Anim, 400),
      ])

      animation.start()
      return () => animation.stop()
    }
  }, [isTyping])
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const showSub = Keyboard.addListener(showEvent, e => {
      setKeyboardHeight(e.endCoordinates.height)
    })
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0)
    })

    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }, [keyboardHeight])

  const handleSend = async () => {
    if (message.trim()) {
      const userMessage = message.trim()
      const newMessage: Message = {
        id: Date.now(),
        type: 'user',
        text: userMessage,
      }
      setMessages(prev => [...prev, newMessage])
      setMessage('')
      Keyboard.dismiss()
      setIsTyping(true)
      try {
        const response = await sendChatMessage(userMessage)
        setIsTyping(false)
        const aiText =
          response?.message ||
          response?.text ||
          response?.reply ||
          'Desculpe, não consegui responder agora.'
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            type: 'ai',
            text: aiText,
          },
        ])
      } catch (err) {
        setIsTyping(false)
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            type: 'ai',
            text: 'Erro ao conectar com o Mentor AI. Tente novamente mais tarde.',
          },
        ])
      }
    }
  }
  const bottomPadding = keyboardHeight > 0 ? keyboardHeight + 12 : TABBAR_HEIGHT

  return (
    <LinearGradient
      colors={isDark ? ['#0a0a12', '#1a0a2e', '#0a0a12'] : ['#f5f3ff', '#ede9fe', '#f5f3ff']}
      locations={[0, 0.5, 1]}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={[Cores.roxoPrimario, Cores.lilaSecundario]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.aiIcon}>
              <Ionicons name="sparkles" size={28} color="white" />
            </View>
            <Text style={styles.headerTitle}>Mentor AI</Text>
          </View>
        </LinearGradient>

        <View style={[styles.chatContainer, { paddingBottom: bottomPadding }]}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesArea}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            {messages.map(msg => (
              <View
                key={msg.id}
                style={[
                  styles.messageContainer,
                  msg.type === 'user' ? styles.userMessageContainer : styles.aiMessageContainer,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    msg.type === 'user'
                      ? styles.userBubble
                      : [styles.aiBubble, isDark && styles.aiBubbleDark],
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      msg.type === 'user'
                        ? styles.userText
                        : [styles.aiText, isDark && styles.aiTextDark],
                    ]}
                  >
                    {msg.text}
                  </Text>
                </View>
              </View>
            ))}

            {isTyping && (
              <View style={styles.messageContainer}>
                <View
                  style={[styles.messageBubble, styles.aiBubble, isDark && styles.aiBubbleDark]}
                >
                  <View style={styles.typingDots}>
                    <Animated.View style={[styles.dot, { opacity: dot1Anim }]} />
                    <Animated.View style={[styles.dot, { opacity: dot2Anim }]} />
                    <Animated.View style={[styles.dot, { opacity: dot3Anim }]} />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={[styles.inputArea, isDark && styles.inputAreaDark]}>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Mensagem para Mentor AI..."
              placeholderTextColor={isDark ? '#666' : '#999'}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
              returnKeyType="send"
            />

            <TouchableOpacity
              style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <LinearGradient
                colors={
                  message.trim() ? [Cores.roxoPrimario, Cores.lilaSecundario] : ['#ccc', '#ccc']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sendButtonGradient}
              >
                <Ionicons name="send" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 20,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: 'white',
  },
  chatContainer: {
    flex: 1,
  },
  messagesArea: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 12,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 18,
    padding: 14,
    paddingHorizontal: 18,
  },
  userBubble: {
    backgroundColor: '#7C3AED',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomLeftRadius: 4,
  },
  aiBubbleDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.9)',
  },
  messageText: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 22,
  },
  userText: {
    color: 'white',
  },
  aiText: {
    color: '#1C1B29',
  },
  aiTextDark: {
    color: '#F8F8FB',
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7C3AED',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
    gap: 12,
  },
  inputAreaDark: {
    backgroundColor: '#14141f',
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#f0f0f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: '#1C1B29',
  },
  inputDark: {
    backgroundColor: 'rgba(28, 27, 41, 0.8)',
    color: '#F8F8FB',
  },
  sendButton: {
    width: 40,
    height: 40,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
