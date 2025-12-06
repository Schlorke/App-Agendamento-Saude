# App de Agendamento de Consultas em Saúde

Aplicativo mobile completo para agendamento de consultas em postos de saúde, desenvolvido com React Native, Expo e TypeScript, seguindo arquitetura MVVM e metodologia TDD.

## 📋 Índice

- [Características](#-características)
- [Tecnologias](#-tecnologias)
- [Como Começar](#-como-começar)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Executando o Projeto](#executando-o-projeto)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Arquitetura](#-arquitetura)
- [Funcionalidades](#-funcionalidades-implementadas)
- [Testes](#-testes)
- [Design System](#-design-system)
- [Documentação](#-documentação)
- [Como Contribuir](#-como-contribuir)
- [Credenciais de Teste](#-credenciais-de-teste)
- [Próximas Funcionalidades](#-próximas-funcionalidades)
- [Licença](#-licença)

## 📋 Características

- **Interface simples e intuitiva**: Pensada para comunidades de baixa renda
- **Arquitetura MVVM**: Separação clara entre View, ViewModel e Model
- **Testes**: Testes unitários e de integração com Jest e React Testing Library
- **TypeScript**: Tipagem estática para maior segurança e manutenibilidade
- **Navegação**: React Navigation com autenticação condicional
- **Acessibilidade**: Design focado em acessibilidade (a11y) e usabilidade

## 🚀 Tecnologias

- **React Native** com **Expo** - Framework mobile multiplataforma
- **TypeScript** - Tipagem estática
- **React Navigation** - Navegação entre telas
- **AsyncStorage** - Persistência local de dados
- **Expo Notifications** - Sistema de notificações push
- **Jest** - Framework de testes
- **React Testing Library** - Testes de componentes React
- **Crypto-js** - Hash seguro de senhas (SHA-256)

## 📱 Como Começar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm, yarn ou pnpm
- Expo CLI (instalado globalmente ou via npx)
- Para desenvolvimento Android: Android Studio e Android SDK
- Para desenvolvimento iOS: Xcode (apenas macOS)

### Instalação

```bash
# Clone o repositório (se aplicável)
# git clone <repository-url>

# Instale as dependências
npm install
# ou
yarn install
# ou
pnpm install
```

### Executando o Projeto

```bash
# Iniciar o servidor de desenvolvimento
npm start
# ou
npm run dev

# Executar no Android
npm run android

# Executar no iOS (apenas macOS)
npm run ios

# Executar no navegador
npm run web
```

## 📁 Estrutura do Projeto

```text
HoW/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Loading.tsx
│   ├── data/            # Mock do banco de dados
│   │   └── db.json
│   ├── hooks/           # Hooks customizados
│   │   └── useAuth.ts
│   ├── navigation/      # Configuração do React Navigation
│   │   ├── AppStack.tsx
│   │   ├── AuthStack.tsx
│   │   ├── index.tsx
│   │   └── types.ts
│   ├── screens/         # Telas principais
│   │   ├── Auth/        # Login e Cadastro
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   └── App/         # Telas autenticadas
│   │       ├── EditProfileScreen.tsx
│   │       ├── HistoryScreen.tsx
│   │       ├── HomeScreen.tsx
│   │       ├── MedicationsScreen.tsx
│   │       ├── NewsScreen.tsx
│   │       ├── PharmaciesScreen.tsx
│   │       ├── ProfileScreen.tsx
│   │       └── ScheduleScreen.tsx
│   │       ├── ScheduleScreen.tsx
│   │       ├── HistoryScreen.tsx
│   │       └── ProfileScreen.tsx
│   ├── services/        # Lógica de acesso aos dados
│   │   ├── dataService.ts
│   │   └── storageService.ts
│   ├── styles/          # Estilos globais e tema
│   │   └── theme.ts
│   ├── utils/           # Funções utilitárias
│   │   ├── hash.ts
│   │   └── validation.ts
│   └── viewmodels/      # Lógica de estado (MVVM)
│       ├── CancelAppointmentViewModel.ts
│       ├── EditProfileViewModel.ts
│       ├── LoginViewModel.ts
│       ├── MedicationsViewModel.ts
│       ├── NewsViewModel.ts
│       ├── PharmaciesViewModel.ts
│       ├── RegisterViewModel.ts
│       └── ScheduleViewModel.ts
│   └── services/        # Serviços (Model)
│       ├── dataService.ts
│       ├── notificationService.ts
│       └── storageService.ts
├── __tests__/           # Testes
│   ├── components/
│   ├── screens/
│   ├── utils/
│   └── viewmodels/
├── docs/                # Documentação
│   ├── ARCHITECTURE.md  # Documentação da arquitetura
│   └── DESIGN_SYSTEM.md # Sistema de design
├── AGENTS.md            # Guia para agentes de IA (raiz para fácil descoberta)
├── App.tsx              # Componente raiz
├── CHANGELOG.md         # Registro de mudanças
└── README.md            # Este arquivo
```

## 🏗️ Arquitetura

Este projeto utiliza a arquitetura **MVVM (Model-View-ViewModel)** para separar as responsabilidades e facilitar os testes.

- **Model**: Representado pelos serviços (`/src/services`) e dados (`/src/data`). É a camada de dados e lógica de negócio.
- **View**: As telas e componentes React (`/src/screens`, `/src/components`). É a camada de UI, responsável apenas por exibir dados e capturar interações do usuário.
- **ViewModel**: A cola entre a View e o Model (`/src/viewmodels`). Contém toda a lógica de estado da UI e as ações que a View pode executar. A View nunca fala diretamente com o Model.

Para mais detalhes sobre a arquitetura, consulte [ARCHITECTURE.md](docs/ARCHITECTURE.md).

## 🏗️ Funcionalidades Implementadas

### RF01: Cadastro de Usuário ✅

- Validação de CPF, data de nascimento e senha
- Hash seguro de senhas usando SHA-256
- Verificação de CPF já cadastrado
- Interface intuitiva e acessível

### RF02: Login de Usuário ✅

- Autenticação com CPF e senha
- Validação de credenciais
- Persistência de sessão usando AsyncStorage
- Feedback visual de erros

### RF03: Agendamento de Consulta ✅

- Seleção de especialidade médica
- Seleção de profissional de saúde
- Seleção de data e horário disponíveis
- Validação de horários disponíveis
- Confirmação de agendamento

### RF04: Cancelamento de Consulta ✅

- Cancelamento de consultas agendadas
- **Validação de 24 horas de antecedência obrigatória**
- Validação de status da consulta
- Confirmação antes de cancelar
- Feedback visual de sucesso/erro
- Cancelamento automático de notificações relacionadas

### RF05: Histórico de Consultas ✅

- Listagem de consultas passadas e futuras
- Filtros por status (agendadas, realizadas, canceladas)
- Integração com cancelamento
- Visualização detalhada de cada consulta

### RF06: Quadro de Notícias e Campanhas ✅

- Tela dedicada para notícias e campanhas de saúde
- Listagem de todas as notícias disponíveis
- Exibição de título, conteúdo e data
- Navegação a partir da tela inicial

### RF07: Farmácias de Plantão ✅

- Tela com lista de farmácias de plantão
- Informações completas: nome, endereço, telefone e horário
- Navegação a partir da tela inicial

### RF08: Notificações Push ✅

- Notificações de confirmação ao agendar consulta
- Notificações de lembrete 1 dia antes da consulta
- Cancelamento automático de notificações ao cancelar consulta
- Solicitação de permissões na inicialização do app
- Handlers configurados para notificações em foreground e background

### RF09: Edição de Perfil ✅

- Tela dedicada para editar informações do perfil
- Edição de telefone e endereço
- Validação de campos
- Atualização automática do estado do usuário após edição

### RF10: Informações sobre Medicamentos ✅

- Tela com lista de medicamentos disponíveis
- Informações completas: nome, descrição e dosagem
- Navegação a partir da tela inicial

## 🧪 Testes

O projeto segue **TDD (Test-Driven Development)**. Todos os testes estão localizados na pasta `__tests__` e seguem a estrutura de `src`.

### Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

### Estrutura de Testes

- `__tests__/components/` - Testes de componentes reutilizáveis
- `__tests__/screens/` - Testes de telas
- `__tests__/utils/` - Testes de funções utilitárias
- `__tests__/viewmodels/` - Testes de ViewModels

## 🎨 Design System

O aplicativo utiliza um tema centralizado em `src/styles/theme.ts` com:

- **Cores consistentes**: Verde saúde como cor primária (`#2E7D32`)
- **Tipografia padronizada**: Hierarquia clara de tamanhos e pesos
- **Espaçamentos uniformes**: Sistema baseado em múltiplos de 4px
- **Componentes reutilizáveis**: Button, Input, Card, Loading
- **Acessibilidade**: Contraste adequado, labels de acessibilidade, áreas de toque adequadas

Para mais detalhes sobre o design system, consulte [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).

## 📚 Documentação

Este projeto possui documentação completa e estruturada:

- **[AGENTS.md](AGENTS.md)** - Guia completo para agentes de IA trabalhando no projeto (localizado na raiz para fácil descoberta)
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Documentação detalhada da arquitetura MVVM
- **[DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)** - Sistema de design visual e diretrizes de UI/UX
- **[CHANGELOG.md](CHANGELOG.md)** - Registro de todas as mudanças do projeto

## 🤝 Como Contribuir

Este projeto segue rigorosamente a arquitetura MVVM e metodologia TDD. Antes de contribuir:

1. **Leia a documentação completa**:
   - [AGENTS.md](AGENTS.md) - Protocolos obrigatórios para desenvolvimento
   - [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Entenda a arquitetura
   - [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) - Siga o design system

2. **Siga os protocolos**:
   - TDD é mandatório - escreva testes antes ou junto com o código
   - Atualize a documentação JSDoc nos arquivos modificados
   - Atualize o CHANGELOG.md
   - Mantenha a separação de camadas (View → ViewModel → Service)

3. **Convenções de código**:
   - Use TypeScript com tipagem estrita
   - Siga as convenções de nomenclatura
   - Implemente acessibilidade em todos os componentes interativos
   - Otimize para performance

Para mais detalhes, consulte [AGENTS.md](AGENTS.md).

## 🔐 Credenciais de Teste

O banco de dados mockado contém os seguintes usuários para teste:

- **CPF**: `12345678901`
- **Senha**: `hello`
- **Hash da senha**: `a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3`

## 📝 Notas Importantes

- O banco de dados é simulado usando um arquivo JSON local (`src/data/db.json`)
- Senhas são hasheadas usando SHA-256 antes de serem armazenadas
- O app simula delays de rede para testar performance em conexões lentas
- Interface otimizada para simplicidade e acessibilidade
- Todos os componentes seguem o design system centralizado

## 🔄 Próximas Funcionalidades

- **RF06**: Quadro de Notícias
- **RF07**: Farmácias de Plantão
- **RF08**: Notificações Locais
- **RF09**: Edição de Perfil
- **RF10**: Informações de Medicamentos

## 📄 Licença

Este projeto é privado e foi desenvolvido para fins educacionais.

## 👥 Desenvolvedores

Desenvolvido seguindo metodologia TDD, arquitetura MVVM e boas práticas de desenvolvimento mobile.

---

**Versão**: 1.0.0
**Última atualização**: 2024-01-15
