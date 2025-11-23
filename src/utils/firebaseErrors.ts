export const translateFirebaseError = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'Email inválido. Verifique o formato do email.',
    'auth/user-disabled': 'Esta conta foi desabilitada.',
    'auth/user-not-found': 'Usuário não encontrado. Verifique o email digitado.',
    'auth/wrong-password': 'Senha incorreta. Tente novamente.',
    'auth/invalid-credential': 'Email ou senha incorretos.',
    'auth/invalid-login-credentials': 'Email ou senha incorretos.',
    'auth/email-already-in-use': 'Este email já está em uso. Tente fazer login.',
    'auth/operation-not-allowed': 'Operação não permitida.',
    'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
    'auth/requires-recent-login': 'Esta operação requer login recente. Faça login novamente.',
    'auth/internal-error': 'Erro interno. Tente novamente mais tarde.',
  }

  return errorMessages[errorCode] || 'Erro desconhecido. Tente novamente.'
}

export const getFirebaseErrorCode = (error: any): string => {
  if (error?.code) {
    return error.code
  }
  if (error?.message) {
    const match = error.message.match(/\(auth\/[\w-]+\)/)
    if (match) {
      return match[0].replace(/[()]/g, '')
    }
  }
  return 'auth/internal-error'
}

export const getErrorMessage = (error: any): string => {
  const errorCode = getFirebaseErrorCode(error)
  return translateFirebaseError(errorCode)
}
