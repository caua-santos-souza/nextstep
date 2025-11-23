import client from './axiosClient'
import AsyncStorage from '@react-native-async-storage/async-storage'

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const CONV_KEY = '@chatConversationId'

export async function sendChatMessage(message: string): Promise<any> {
  try {
    let conversationId = await AsyncStorage.getItem(CONV_KEY)
    if (!conversationId) {
      conversationId = uuidv4()
      await AsyncStorage.setItem(CONV_KEY, conversationId)
    }

    const payload = { message, conversationId }
    const res = await client.post('/chat/send', payload)
    return res.data
  } catch (err) {
    throw err
  }
}

export async function getChatHistory(conversationId: string): Promise<any> {
  const res = await client.get('/chat/history', { params: { conversationId } })
  return res.data
}
