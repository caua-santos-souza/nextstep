# NextStep - Plataforma de Aceleração de Carreira

## 🚀 Sobre o Projeto

NextStep é uma plataforma inovadora de orientação profissional que combina inteligência artificial com análise de currículos para criar jornadas de carreira personalizadas. A solução utiliza o poder do **Google Gemini AI** para analisar perfis profissionais e gerar planos de desenvolvimento sob medida, ajudando profissionais a alcançarem seus objetivos de carreira de forma estruturada e eficiente.

### 💡 Problema Resolvido

Em um mercado de trabalho cada vez mais competitivo e dinâmico, profissionais enfrentam dificuldades para:
- Identificar gaps de competências em suas carreiras
- Traçar um caminho claro para suas metas profissionais
- Encontrar recursos de aprendizado relevantes e atualizados
- Acompanhar seu progresso de desenvolvimento de forma organizada

NextStep resolve esses desafios ao oferecer:
- **Análise inteligente de currículos** com identificação automática de skills e gaps
- **Jornadas personalizadas** com etapas claras e recursos específicos
- **Sugestões de carreira** baseadas no perfil e experiência do usuário
- **Acompanhamento de progresso** com métricas e insights em tempo real
- **Mentor AI** para orientação personalizada via chat

---

## 👥 Integrantes

### Luigi Berzaghi - RM: 555516
GitHub: [@luigiberzaghi](https://github.com/luigiberzaghi)

### Guilherme Pelissari - RM: 558445
GitHub: [@Guilherme-Pelissari](https://github.com/Guilherme-Pelissari)

### Cauã dos Santos Souza - RM: 559093
GitHub: [@caua-santos-souza](https://github.com/caua-santos-souza)

---

## 📱 Funcionalidades Principais

### 🔐 Autenticação e Perfil
- **Login/Cadastro Seguro:** Autenticação via Firebase com validação de e-mail
- **Recuperação de Senha:** Reset de senha via e-mail
- **Gerenciamento de Perfil:** Edição de dados pessoais e profissionais
- **Exclusão de Conta:** Remoção completa de dados do usuário

### 📄 Análise de Currículo
- **Upload de Currículo:** Suporte para PDF e DOCX
- **Análise com IA:** Extração automática de competências, experiência e gaps
- **Sugestões de Carreira:** Recomendações personalizadas com percentual de match
- **Visualização de Skills:** Exibição clara de habilidades e níveis de proficiência

### 🎯 Journey+ (Jornadas de Carreira)
- **Geração Automática:** Criação de planos personalizados baseados em seu perfil
- **Etapas Detalhadas:** Objetivos claros, recursos e tempo estimado para cada fase
- **Acompanhamento de Progresso:** Marque etapas como concluídas e veja seu avanço
- **Insights Inteligentes:** Dicas e tendências de mercado relevantes para sua jornada
- **Modal de Conclusão:** Celebração ao completar toda a jornada

### 💬 Mentor AI
- **Chat Inteligente:** Converse com um mentor virtual especializado em carreira
- **Respostas Contextualizadas:** Orientações baseadas no seu perfil e objetivos
- **Histórico de Conversas:** Acesse discussões anteriores a qualquer momento
- **Sugestões Rápidas:** Chips com perguntas frequentes para facilitar a interação

### 🏠 Dashboard
- **Estatísticas de Progresso:** Jornadas concluídas, habilidades mapeadas e progresso geral
- **Acesso Rápido:** Navegação direta para jornada ativa, upload de currículo e chat
- **Card de Resumo:** Visualização do status atual da jornada em andamento

### ⚙️ Configurações
- **Modo Escuro/Claro:** Alternância de tema para melhor conforto visual
- **Edição de Perfil:** Atualização de nome, e-mail e cargo atual
- **Segurança:** Gerenciamento de conta e exclusão de dados

---

## 🛠 Tecnologias Utilizadas

### Frontend (React Native/Expo)
- **React Native** - Framework mobile multiplataforma
- **Expo** - Plataforma de desenvolvimento e build
- **TypeScript** - Linguagem tipada para maior segurança
- **Expo Router** - Navegação baseada em arquivos (file-based routing)

### Autenticação e Armazenamento
- **Firebase Authentication** - Sistema de login seguro
- **AsyncStorage** - Persistência local de dados
- **Firebase Cloud Storage** - Armazenamento de currículos

### API e Comunicação
- **Axios** - Cliente HTTP para requisições
- **RESTful API (Java/Spring Boot)** - Backend robusto e escalável

### Inteligência Artificial
- **Google Gemini AI** - Análise de currículos e geração de jornadas
- **Apache POI & PDF Box** - Extração de texto de documentos
- **Rate Limiting** - Controle de uso da API de IA

### UI/UX
- **Expo Vector Icons (Ionicons)** - Biblioteca de ícones
- **Linear Gradient** - Gradientes personalizados
- **Poppins Font** - Tipografia moderna e legível
- **Animações Customizadas** - Feedback visual e interações suaves

### Ferramentas de Desenvolvimento
- **Prettier** - Formatação automática
- **Git/GitHub** - Versionamento e colaboração

---

## 📂 Estrutura do Projeto

```
nextstep/
├── src/
│   ├── api/                          # Serviços de comunicação com API
│   │   ├── auth.ts                   # Endpoints de autenticação
│   │   ├── axiosClient.ts            # Configuração do Axios
│   │   ├── chat.ts                   # Endpoints do chat com IA
│   │   ├── journeys.ts               # Endpoints de jornadas
│   │   ├── profile.ts                # Endpoints de perfil
│   │   ├── resume.ts                 # Endpoints de currículo
│   │   └── index.ts                  # Exportações centralizadas
│   │
│   ├── app/                          # Rotas e telas (Expo Router)
│   │   ├── _layout.tsx               # Layout raiz da aplicação
│   │   ├── index.tsx                 # Tela inicial/splash
│   │   ├── cadastro.tsx              # Tela de cadastro
│   │   ├── editar-perfil.tsx         # Edição de perfil do usuário
│   │   ├── esqueci-senha.tsx         # Recuperação de senha
│   │   ├── nova-jornada.tsx          # Criação de nova jornada
│   │   ├── upload-curriculo.tsx      # Upload e análise de currículo
│   │   └── (tabs)/                   # Navegação em abas
│   │       ├── _layout.tsx           # Layout das tabs
│   │       ├── chat.tsx              # Chat com Mentor AI
│   │       ├── home.tsx              # Dashboard principal
│   │       ├── jornadas.tsx          # Jornadas de carreira
│   │       └── perfil.tsx            # Perfil do usuário
│   │
│   ├── components/                   # Componentes reutilizáveis
│   │   ├── BotaoFlutuante.tsx        # FAB (Floating Action Button)
│   │   ├── BotaoPrimario.tsx         # Botão primário com loading
│   │   ├── BotaoVoltar.tsx           # Botão de navegação voltar
│   │   ├── CampoTexto.tsx            # Input de texto customizado
│   │   ├── CardCarreira.tsx          # Card de sugestão de carreira
│   │   ├── CardResumo.tsx            # Card de resumo da jornada
│   │   ├── FundoGradiente.tsx        # Background com gradiente
│   │   ├── ListaEtapas.tsx           # Lista de etapas da jornada
│   │   ├── ListaInsights.tsx         # Lista de insights da IA
│   │   ├── ModalConclusaoJornada.tsx # Modal de conclusão de jornada
│   │   ├── ProgressoCarregamento.tsx # Indicador de progresso
│   │   └── TextoAnimado.tsx          # Texto com animação
│   │
│   ├── constants/                    # Constantes da aplicação
│   │   └── Cores.ts                  # Paleta de cores
│   │
│   ├── contexts/                     # Context API
│   │   ├── AuthContext.tsx           # Contexto de autenticação
│   │   ├── JourneyContext.tsx        # Contexto de jornadas
│   │   ├── ResumeContext.tsx         # Contexto de currículo
│   │   └── TemaContext.tsx           # Contexto de tema (dark/light)
│   │
│   ├── hooks/                        # Custom Hooks
│   │   ├── useProgressTimer.ts       # Hook de timer de progresso
│   │   └── useResumeUpload.ts        # Hook de upload de currículo
│   │
│   ├── types/                        # Definições TypeScript
│   │   ├── auth.ts                   # Tipos de autenticação
│   │   ├── career.ts                 # Tipos de carreira
│   │   ├── journey.ts                # Tipos de jornada
│   │   ├── profile.ts                # Tipos de perfil
│   │   ├── resume.ts                 # Tipos de currículo
│   │   └── index.ts                  # Exportações centralizadas
│   │
│   └── utils/                        # Utilitários
│       ├── apiHelpers.ts             # Helpers de API
│       └── firebaseErrors.ts         # Traduções de erros Firebase
│
├── assets/                           # Recursos estáticos
│   ├── fonts/                        # Fontes (Poppins)
│   └── images/                       # Imagens e ícones
│
├── firebaseConfig.ts                 # Configuração do Firebase
├── app.json                          # Configuração do Expo
├── babel.config.js                   # Configuração do Babel
├── tsconfig.json                     # Configuração do TypeScript
├── package.json                      # Dependências e scripts
└── README.md                         # Este arquivo
```

---

## 🔒 Arquitetura de Autenticação

O NextStep utiliza um sistema de autenticação híbrido combinando **Firebase Authentication** no frontend e **JWT (JSON Web Tokens)** no backend para garantir segurança e escalabilidade.

### Fluxo de Autenticação

1. **Registro/Login:**
   - Usuário faz login via Firebase Authentication
   - Firebase retorna um **ID Token** (JWT)
   - Token é armazenado localmente via AsyncStorage

2. **Comunicação com Backend:**
   - Toda requisição ao backend inclui o token no header `Authorization: Bearer <token>`
   - Axios interceptor adiciona automaticamente o token em todas as chamadas
   - Backend valida o token

3. **Autorização:**
   - Backend extrai o UID do usuário do token JWT
   - Associa operações ao usuário autenticado
   - Garante que usuários acessem apenas seus próprios dados

### Segurança

- ✅ **HTTPS obrigatório** para todas as comunicações
- ✅ **Tokens criptografados** e assinados pelo Firebase
- ✅ **Validação server-side** de todos os tokens
- ✅ **Timeout de requisições** para evitar ataques
- ✅ **Rate limiting** na API de IA para prevenir abuso

---

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo Go (app mobile) ou emulador Android/iOS

### 1. Clone o repositório
```bash
git clone https://github.com/FIAP-MOBILE/global-solution-nextstep.git
cd global-solution-nextstep/nextstep
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=<sua_api_key_aqui>
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=<seu_projeto.firebaseapp.com>
EXPO_PUBLIC_FIREBASE_PROJECT_ID=<seu_projeto_id>
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=<seu_projeto.appspot.com>
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<seu_sender_id>
EXPO_PUBLIC_FIREBASE_APP_ID=<seu_app_id>
```

### 4. Configure a URL da API

Edite `src/api/axiosClient.ts` e configure a URL do backend (A api já está hospedada, mas caso queira rodar localmente):

```typescript
const BASE_URL = 'https://nextstep-2tdsb.azurewebsites.net/api'
```

### 5. Inicie o projeto
```bash
npm start
```

### 6. Execute no dispositivo

#### Expo Go (Recomendado)
1. Instale o Expo Go no seu dispositivo ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))
2. Escaneie o QR code exibido no terminal

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

#### Web
```bash
npm run web
```

---

## 📖 Como Usar o App

### Primeiro Acesso
1. **Cadastre-se:** Informe e-mail, senha, nome e profissão
2. **Faça Login:** Use suas credenciais para acessar
3. **Envie seu Currículo:** Upload do PDF/DOCX para análise
4. **Aguarde a Análise:** A IA processará seu currículo
5. **Visualize Sugestões:** Veja carreiras compatíveis com seu perfil

### Criando uma Jornada
1. Acesse a aba **Journey+**
2. Clique em **Gerar Jornada**
3. Escolha uma profissão sugerida ou busque uma específica
4. Aguarde a geração da jornada personalizada
5. Acompanhe as etapas e marque como concluídas conforme avança

### Usando o Mentor AI
1. Acesse a aba **Chat**
2. Digite sua dúvida 
3. Receba orientações personalizadas baseadas no seu perfil

### Acompanhando Progresso
1. Veja estatísticas na **Home**
2. Marque etapas concluídas na aba **Journey+**
3. Receba celebrações ao completar jornadas
4. Gere novas jornadas para continuar evoluindo

---

## 🎨 Design e UX

O NextStep foi desenvolvido com foco em:
- **Interface Intuitiva:** Navegação clara e objetiva
- **Tema Adaptável:** Modo claro e escuro para conforto visual
- **Feedback Visual:** Animações e indicadores de progresso
- **Acessibilidade:** Tipografia legível e contrastes adequados
- **Experiência Mobile-First:** Otimizado para dispositivos móveis

### Paleta de Cores
- **Roxo Primário:** `#7E30E1` - Ação e destaque
- **Lilás Secundário:** `#C5BAFF` - Suavidade e elegância
- **Tema Claro:** Fundo `#F8F8FB`, Texto `#1C1B29`
- **Tema Escuro:** Fundo `#0A0A12`, Texto `#F8F8FB`

---

## 🔗 Links Importantes

### Backend (Java/Spring Boot)
**Repositório:** https://github.com/LuigiBerzaghi/NextStep-Devops

### Vídeo de Apresentação
**YouTube:** https://www.youtube.com/watch?v=0Jw1yDLA6FE

---

## 📄 Licença

Este projeto foi desenvolvido como parte da **Global Solution 2025** da FIAP, com o tema **"Futuro do Trabalho"**.

---

<div align="center">

### 🎓 Global Solution 2025
**Tema: Futuro do Trabalho**

<br>

**Desenvolvido por estudantes da FIAP**

<br>

*NextStep - Acelerando carreiras com inteligência artificial* 🚀

<br>

---

<sub>© 2025 NextStep. Todos os direitos reservados.</sub>

</div>
