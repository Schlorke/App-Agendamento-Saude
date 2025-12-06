# HoW - Health on Web

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Private-red.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB.svg)
![Expo](https://img.shields.io/badge/Expo-54.0-000020.svg)
![Architecture](https://img.shields.io/badge/Architecture-MVVM-green.svg)
![Testing](https://img.shields.io/badge/Testing-TDD-brightgreen.svg)

## Sobre o Projeto

Aplicativo mobile completo para agendamento de consultas em postos de saúde.

Desenvolvido com React Native, Expo e TypeScript, seguindo arquitetura MVVM e metodologia TDD.

[Documentação](#-documentação) • [Início Rápido](#-início-rápido) • [Arquitetura](#-arquitetura) • [Contribuindo](#-contribuindo)

---

## 📑 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Características](#-características)
- [Tecnologias](#-tecnologias)
- [Início Rápido](#-início-rápido)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Executando o Projeto](#executando-o-projeto)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Arquitetura](#-arquitetura)
- [Funcionalidades](#-funcionalidades)
- [Desenvolvimento](#-desenvolvimento)
  - [Testes](#testes)
  - [Linting e Formatação](#linting-e-formatação)
  - [Build](#build)
- [Design System](#-design-system)
- [Documentação](#-documentação)
- [Contribuindo](#-contribuindo)
- [Segurança](#-segurança)
- [Credenciais de Teste](#-credenciais-de-teste)
- [Roadmap](#-roadmap)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

**HoW (Health on Web)** é um aplicativo mobile desenvolvido para facilitar o agendamento de consultas em postos de saúde, com foco em comunidades de baixa renda. O aplicativo oferece uma interface simples e intuitiva, garantindo acesso fácil a serviços de saúde.

### Objetivos

- ✅ Simplificar o processo de agendamento de consultas
- ✅ Melhorar o acesso a informações de saúde
- ✅ Fornecer notificações sobre consultas e campanhas de saúde
- ✅ Disponibilizar informações sobre medicamentos e farmácias de plantão

### Público-Alvo

O aplicativo foi desenvolvido pensando em comunidades de baixa renda, priorizando:

- **Simplicidade**: Interface intuitiva e fácil de usar
- **Acessibilidade**: Design inclusivo seguindo padrões de acessibilidade (a11y)
- **Performance**: Otimizado para funcionar em dispositivos de baixo custo
- **Offline-first**: Funcionalidades básicas disponíveis mesmo com conexão limitada

---

## ✨ Características

### Funcionalidades Principais

- 🔐 **Autenticação Segura**: Login e cadastro com validação de CPF e hash seguro de senhas
- 📅 **Agendamento de Consultas**: Sistema completo de agendamento com seleção de especialidade, profissional, data e horário
- ❌ **Cancelamento Inteligente**: Cancelamento com validação de 24 horas de antecedência
- 📋 **Histórico Completo**: Visualização de todas as consultas (passadas, futuras e canceladas)
- 📰 **Notícias e Campanhas**: Quadro de notícias sobre saúde e campanhas de vacinação
- 💊 **Informações de Medicamentos**: Catálogo completo de medicamentos com descrições e dosagens
- 🏥 **Farmácias de Plantão**: Lista de farmácias de plantão com informações de contato
- 🔔 **Notificações Push**: Sistema completo de notificações para lembretes de consultas
- 👤 **Perfil do Usuário**: Edição de informações pessoais (telefone e endereço)

### Qualidade de Código

- 🏗️ **Arquitetura MVVM**: Separação clara de responsabilidades
- 🧪 **TDD**: Desenvolvimento orientado por testes
- 📝 **TypeScript**: Tipagem estática para maior segurança
- ♿ **Acessibilidade**: Design inclusivo seguindo padrões WCAG
- 🎨 **Design System**: Sistema de design consistente e reutilizável
- 📚 **Documentação Completa**: Documentação detalhada de arquitetura, design e componentes

---

## 🚀 Tecnologias

### Core

| Tecnologia       | Versão   | Propósito                             |
| ---------------- | -------- | ------------------------------------- |
| **React Native** | 0.81.5   | Framework mobile multiplataforma      |
| **Expo**         | ~54.0.27 | Plataforma de desenvolvimento e build |
| **TypeScript**   | ~5.9.2   | Tipagem estática                      |
| **React**        | 19.1.0   | Biblioteca UI                         |

### Navegação e Estado

- **React Navigation** (v7) - Sistema de navegação com Stack e Tab Navigators
- **AsyncStorage** - Persistência local de dados

### Notificações

- **Expo Notifications** - Sistema de notificações push

### Ferramentas de Teste

- **Jest** (29.7.0) - Framework de testes
- **React Testing Library** - Testes de componentes React
- **Jest Expo** - Preset para testes com Expo

### Segurança

- **Crypto-js** - Hash seguro de senhas (SHA-256) e criptografia AES

### Ferramentas de Desenvolvimento

- **ESLint** - Linter para JavaScript/TypeScript
- **Prettier** - Formatador de código
- **Markdownlint** - Linter para documentação Markdown

---

## 🚀 Início Rápido

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **Gerenciador de pacotes**: npm, yarn ou pnpm (recomendado: pnpm)
- **Expo CLI**: Instalado globalmente ou via npx
- **Para Android**:
  - Android Studio
  - Android SDK
  - Variáveis de ambiente configuradas
- **Para iOS** (apenas macOS):
  - Xcode (versão mais recente)
  - CocoaPods

### Instalação

1. **Clone o repositório** (se aplicável):

   ```bash
   git clone <repository-url>
   cd HoW
   ```

2. **Instale as dependências**:

   ```bash
   # Usando pnpm (recomendado)
   pnpm install

   # Ou usando npm
   npm install

   # Ou usando yarn
   yarn install
   ```

3. **Verifique a instalação**:

   ```bash
   pnpm exec expo --version
   ```

### Executando o Projeto

#### Desenvolvimento

```bash
# Iniciar o servidor de desenvolvimento
pnpm start
# ou
pnpm dev

# Executar no Android
pnpm android

# Executar no iOS (apenas macOS)
pnpm ios

# Executar no navegador
pnpm web
```

#### Build de Produção

```bash
# Build para Android
pnpm build:android

# Build para iOS
pnpm build:ios

# Build para todas as plataformas
pnpm build:all

# Build para Web
pnpm build:web
```

---

## 📁 Estrutura do Projeto

```
HoW/
├── 📂 src/                      # Código-fonte principal
│   ├── 📂 components/           # Componentes reutilizáveis
│   │   ├── Badge.tsx            # Badge para status e tags
│   │   ├── Button.tsx           # Botão reutilizável
│   │   ├── Card.tsx             # Card com variantes
│   │   ├── EmptyState.tsx       # Estado vazio padronizado
│   │   ├── Header.tsx           # Header de telas
│   │   ├── Input.tsx            # Input com validação
│   │   ├── Loading.tsx          # Indicador de carregamento
│   │   ├── Modal.tsx            # Modal reutilizável
│   │   ├── Skeleton.tsx         # Skeleton loading
│   │   └── Toast.tsx            # Notificações toast
│   │
│   ├── 📂 screens/              # Telas do aplicativo
│   │   ├── 📂 Auth/             # Telas de autenticação
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   └── 📂 App/              # Telas autenticadas
│   │       ├── EditProfileScreen.tsx
│   │       ├── HistoryScreen.tsx
│   │       ├── HomeScreen.tsx
│   │       ├── MedicationsScreen.tsx
│   │       ├── NewsScreen.tsx
│   │       ├── PharmaciesScreen.tsx
│   │       ├── ProfileScreen.tsx
│   │       └── ScheduleScreen.tsx
│   │
│   ├── 📂 viewmodels/           # ViewModels (MVVM)
│   │   ├── CancelAppointmentViewModel.ts
│   │   ├── EditProfileViewModel.ts
│   │   ├── LoginViewModel.ts
│   │   ├── MedicationsViewModel.ts
│   │   ├── NewsViewModel.ts
│   │   ├── PharmaciesViewModel.ts
│   │   ├── RegisterViewModel.ts
│   │   └── ScheduleViewModel.ts
│   │
│   ├── 📂 services/             # Services (Model - MVVM)
│   │   ├── dataService.ts       # Acesso a dados
│   │   ├── notificationService.ts  # Notificações push
│   │   └── storageService.ts    # Persistência local
│   │
│   ├── 📂 navigation/           # Configuração de navegação
│   │   ├── AppStack.tsx         # Stack de telas autenticadas
│   │   ├── AuthStack.tsx        # Stack de autenticação
│   │   ├── index.tsx            # Navegação principal
│   │   └── types.ts             # Tipos de navegação
│   │
│   ├── 📂 hooks/                # Hooks customizados
│   │   └── useAuth.ts           # Hook de autenticação
│   │
│   ├── 📂 styles/               # Estilos globais
│   │   └── theme.ts             # Tema centralizado
│   │
│   ├── 📂 utils/                # Funções utilitárias
│   │   ├── animations.ts        # Sistema de animações
│   │   ├── hash.ts              # Funções de hash
│   │   └── validation.ts        # Validações
│   │
│   └── 📂 data/                 # Dados mockados
│       └── db.json              # Banco de dados simulado
│
├── 📂 __tests__/                # Testes unitários e de integração
│   ├── 📂 components/
│   ├── 📂 screens/
│   ├── 📂 services/
│   ├── 📂 utils/
│   └── 📂 viewmodels/
│
├── 📂 docs/                     # Documentação completa
│   ├── README.md                # Índice de documentação
│   ├── ARCHITECTURE.md          # Arquitetura MVVM
│   ├── DESIGN_SYSTEM.md         # Sistema de design
│   ├── COMPONENT_LIBRARY.md     # Biblioteca de componentes
│   ├── DESIGN_PATTERNS.md       # Padrões de design
│   ├── ACCESSIBILITY_GUIDE.md   # Guia de acessibilidade
│   ├── AI_CONTEXT.md            # Contexto para IAs
│   ├── KNOWN_ISSUES.md          # Problemas conhecidos
│   ├── DESIGN_DECISIONS.md      # Decisões de design
│   └── COMPONENT_USAGE_EXAMPLES.md  # Exemplos de uso
│
├── 📂 android/                  # Código nativo Android
├── 📂 ios/                      # Código nativo iOS (se aplicável)
│
├── 📄 AGENTS.md                 # Guia para agentes de IA
├── 📄 CHANGELOG.md              # Registro de mudanças
├── 📄 LICENSE                   # Licença do projeto
├── 📄 package.json              # Dependências e scripts
├── 📄 tsconfig.json             # Configuração TypeScript
├── 📄 jest.config.js            # Configuração Jest
├── 📄 babel.config.js           # Configuração Babel
└── 📄 README.md                 # Este arquivo
```

---

## 🏗️ Arquitetura

Este projeto utiliza a arquitetura **MVVM (Model-View-ViewModel)** para garantir separação de responsabilidades, testabilidade e manutenibilidade.

### Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│                         VIEW                             │
│  (Telas e Componentes - Apenas apresentação)            │
│  • Renderiza UI                                          │
│  • Captura interações do usuário                        │
│  • Exibe estados (loading, erro, sucesso)               │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Chama métodos
                     ▼
┌─────────────────────────────────────────────────────────┐
│                      VIEWMODEL                           │
│  (Lógica de apresentação e estado da UI)                │
│  • Gerencia estado da UI                                │
│  • Processa ações do usuário                            │
│  • Validações de formulário                            │
│  • Transforma dados para exibição                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Chama métodos
                     ▼
┌─────────────────────────────────────────────────────────┐
│                        MODEL                             │
│  (Services - Lógica de negócio e acesso a dados)       │
│  • Acesso a dados (API, banco, storage)                │
│  • Lógica de negócio                                    │
│  • Transformações de dados                              │
└─────────────────────────────────────────────────────────┘
```

### Regra de Ouro

A regra fundamental da arquitetura é: **View → ViewModel → Service**

A View **NUNCA** deve chamar Services diretamente. Toda comunicação deve passar pelo ViewModel.

### Benefícios

- ✅ **Separação de Responsabilidades**: Cada camada tem uma função bem definida
- ✅ **Testabilidade**: Lógica de negócio isolada e facilmente testável
- ✅ **Manutenibilidade**: Mudanças em uma camada não afetam diretamente outras
- ✅ **Reutilização**: ViewModels e Services podem ser reutilizados em diferentes Views

### Documentação Detalhada

Para mais detalhes sobre a arquitetura, consulte:

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Documentação completa da arquitetura MVVM
- **[AI_CONTEXT.md](docs/AI_CONTEXT.md)** - Contexto específico para implementação

---

## 🎯 Funcionalidades

### Requisitos Funcionais Implementados

| ID       | Requisito                   | Status | Descrição                                                                      |
| -------- | --------------------------- | ------ | ------------------------------------------------------------------------------ |
| **RF01** | Cadastro de Usuário         | ✅     | Validação de CPF, data de nascimento e senha. Hash seguro de senhas (SHA-256). |
| **RF02** | Login de Usuário            | ✅     | Autenticação com CPF e senha. Persistência de sessão.                          |
| **RF03** | Agendamento de Consulta     | ✅     | Seleção de especialidade, profissional, data e horário disponíveis.            |
| **RF04** | Cancelamento de Consulta    | ✅     | Cancelamento com validação de 24 horas de antecedência obrigatória.            |
| **RF05** | Histórico de Consultas      | ✅     | Listagem de consultas passadas e futuras com filtros por status.               |
| **RF06** | Quadro de Notícias          | ✅     | Tela dedicada para notícias e campanhas de saúde.                              |
| **RF07** | Farmácias de Plantão        | ✅     | Lista de farmácias de plantão com informações completas.                       |
| **RF08** | Notificações Push           | ✅     | Notificações de confirmação e lembrete de consultas.                           |
| **RF09** | Edição de Perfil            | ✅     | Edição de telefone e endereço do usuário.                                      |
| **RF10** | Informações de Medicamentos | ✅     | Catálogo completo de medicamentos com descrições e dosagens.                   |

### Detalhamento das Funcionalidades

#### 🔐 Autenticação (RF01, RF02)

- Validação completa de CPF
- Validação de data de nascimento
- Hash seguro de senhas usando SHA-256
- Verificação de CPF já cadastrado
- Persistência de sessão com criptografia AES
- Feedback visual de erros

#### 📅 Agendamento (RF03)

- Seleção de especialidade médica
- Seleção de profissional de saúde
- Seleção de data e horário disponíveis
- Validação de horários disponíveis
- Confirmação de agendamento
- Notificação de confirmação

#### ❌ Cancelamento (RF04)

- Cancelamento de consultas agendadas
- **Validação de 24 horas de antecedência obrigatória**
- Validação de status da consulta
- Confirmação antes de cancelar
- Cancelamento automático de notificações relacionadas
- Feedback visual de sucesso/erro

#### 📋 Histórico (RF05)

- Listagem de consultas passadas e futuras
- Filtros por status (agendadas, realizadas, canceladas)
- Visualização detalhada de cada consulta
- Integração com cancelamento

#### 📰 Notícias e Campanhas (RF06)

- Tela dedicada para notícias e campanhas de saúde
- Listagem de todas as notícias disponíveis
- Exibição de título, conteúdo e data
- Navegação a partir da tela inicial

#### 🏥 Farmácias de Plantão (RF07)

- Tela com lista de farmácias de plantão
- Informações completas: nome, endereço, telefone e horário
- Navegação a partir da tela inicial

#### 🔔 Notificações (RF08)

- Notificações de confirmação ao agendar consulta
- Notificações de lembrete 1 dia antes da consulta
- Cancelamento automático de notificações ao cancelar consulta
- Solicitação de permissões na inicialização do app
- Handlers configurados para notificações em foreground e background

#### 👤 Perfil (RF09)

- Tela dedicada para editar informações do perfil
- Edição de telefone e endereço
- Validação de campos
- Atualização automática do estado do usuário após edição

#### 💊 Medicamentos (RF10)

- Tela com lista de medicamentos disponíveis
- Informações completas: nome, descrição e dosagem
- Navegação a partir da tela inicial

---

## 💻 Desenvolvimento

### Executando Testes

O projeto segue **TDD (Test-Driven Development)**. Todos os testes estão localizados na pasta `__tests__` e seguem a estrutura de `src`.

#### Comandos de Teste

```bash
# Executar todos os testes
pnpm test

# Executar testes em modo watch
pnpm test:watch

# Executar testes com cobertura
pnpm test:coverage
```

#### Estrutura de Testes

- `__tests__/components/` - Testes de componentes reutilizáveis
- `__tests__/screens/` - Testes de telas
- `__tests__/services/` - Testes de serviços
- `__tests__/utils/` - Testes de funções utilitárias
- `__tests__/viewmodels/` - Testes de ViewModels

#### Cobertura de Testes

O projeto mantém alta cobertura de testes, especialmente para:

- Lógica de negócio (ViewModels e Services)
- Funções utilitárias
- Componentes críticos

### Linting e Formatação

#### ESLint

```bash
# Verificar problemas de linting
pnpm lint

# Corrigir problemas automaticamente
pnpm lint:fix
```

#### Prettier

```bash
# Formatar código
pnpm format

# Verificar formatação
pnpm format:check

# Formatar apenas Markdown
pnpm format:md
```

#### Markdownlint

```bash
# Verificar documentação Markdown
pnpm lint:md

# Corrigir problemas automaticamente
pnpm lint:md:fix
```

### Type Checking

```bash
# Verificar tipos TypeScript
pnpm type-check
```

### Build

```bash
# Build completo (type-check + lint)
pnpm build

# Build para produção
pnpm build:android
pnpm build:ios
pnpm build:web
```

---

## 🎨 Design System

O aplicativo utiliza um **sistema de design centralizado** e consistente, garantindo uma experiência visual uniforme em todo o aplicativo.

### Características

- **Tema Centralizado**: Todas as cores, espaçamentos e tipografia definidos em `src/styles/theme.ts`
- **Componentes Reutilizáveis**: Biblioteca completa de componentes padronizados
- **Animações Consistentes**: Sistema de animações reutilizáveis
- **Acessibilidade**: Design inclusivo seguindo padrões WCAG

### Componentes Disponíveis

- **Button**: Botão com variantes (primary, secondary, outline) e estados (loading, disabled)
- **Input**: Input com validação, label e feedback visual
- **Card**: Card com variantes (elevated, outlined, flat)
- **Badge**: Badge para status, tags e contadores
- **Modal**: Modal com variantes (alert, confirm, info)
- **Toast**: Notificações toast com tipos e posições
- **Skeleton**: Skeleton loading para estados de carregamento
- **EmptyState**: Estado vazio padronizado
- **Header**: Header consistente para telas
- **Loading**: Indicador de carregamento

### Cores

- **Primária**: Verde saúde (`#2E7D32`)
- **Secundária**: Verde claro (`#4CAF50`)
- **Erro**: Vermelho (`#D32F2F`)
- **Aviso**: Laranja (`#F57C00`)
- **Sucesso**: Verde (`#388E3C`)

### Documentação Completa

Para mais detalhes sobre o design system, consulte:

- **[DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)** - Sistema de design completo
- **[COMPONENT_LIBRARY.md](docs/COMPONENT_LIBRARY.md)** - Biblioteca de componentes
- **[DESIGN_PATTERNS.md](docs/DESIGN_PATTERNS.md)** - Padrões de design e UX
- **[COMPONENT_USAGE_EXAMPLES.md](docs/COMPONENT_USAGE_EXAMPLES.md)** - Exemplos práticos de uso

---

## 📚 Documentação

Este projeto possui **documentação completa e estruturada**, organizada para facilitar o desenvolvimento e manutenção.

### Documentação Principal

| Documento        | Descrição                                               | Localização     |
| ---------------- | ------------------------------------------------------- | --------------- |
| **AGENTS.md**    | Guia completo para agentes de IA trabalhando no projeto | Raiz do projeto |
| **CHANGELOG.md** | Registro de todas as mudanças do projeto                | Raiz do projeto |
| **README.md**    | Este arquivo - visão geral do projeto                   | Raiz do projeto |

### Documentação Técnica

| Documento                  | Descrição                                      | Localização |
| -------------------------- | ---------------------------------------------- | ----------- |
| **ARCHITECTURE.md**        | Documentação detalhada da arquitetura MVVM     | `docs/`     |
| **DESIGN_SYSTEM.md**       | Sistema de design visual e diretrizes de UI/UX | `docs/`     |
| **COMPONENT_LIBRARY.md**   | Biblioteca completa de componentes             | `docs/`     |
| **DESIGN_PATTERNS.md**     | Padrões de design e UX                         | `docs/`     |
| **ACCESSIBILITY_GUIDE.md** | Guia completo de acessibilidade                | `docs/`     |

### Documentação para Desenvolvimento

| Documento                       | Descrição                                         | Localização |
| ------------------------------- | ------------------------------------------------- | ----------- |
| **AI_CONTEXT.md**               | Contexto específico para IAs entenderem o projeto | `docs/`     |
| **KNOWN_ISSUES.md**             | Erros conhecidos, limitações e workarounds        | `docs/`     |
| **DESIGN_DECISIONS.md**         | Decisões de design e justificativas               | `docs/`     |
| **COMPONENT_USAGE_EXAMPLES.md** | Exemplos práticos de uso de componentes           | `docs/`     |

### Índice de Documentação

Para uma visão completa de toda a documentação, consulte:

- **[docs/README.md](docs/README.md)** - Índice completo de documentação

---

## 🤝 Contribuindo

Este projeto segue rigorosamente a arquitetura MVVM e metodologia TDD. Antes de contribuir, leia atentamente a documentação.

### Antes de Começar

1. **Leia a documentação completa**:
   - **[AGENTS.md](AGENTS.md)** - Protocolos obrigatórios para desenvolvimento
   - **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Entenda a arquitetura MVVM
   - **[docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)** - Siga o design system
   - **[docs/AI_CONTEXT.md](docs/AI_CONTEXT.md)** - Contexto do projeto

2. **Siga os protocolos**:
   - ✅ TDD é mandatório - escreva testes antes ou junto com o código
   - ✅ Atualize a documentação JSDoc nos arquivos modificados
   - ✅ Atualize o CHANGELOG.md
   - ✅ Mantenha a separação de camadas (View → ViewModel → Service)

3. **Convenções de código**:
   - ✅ Use TypeScript com tipagem estrita
   - ✅ Siga as convenções de nomenclatura
   - ✅ Implemente acessibilidade em todos os componentes interativos
   - ✅ Otimize para performance

### Checklist de Contribuição

Antes de submeter uma contribuição, verifique:

- [ ] Código segue as convenções do projeto
- [ ] Documentação JSDoc está atualizada
- [ ] Testes foram escritos e estão passando
- [ ] Acessibilidade foi implementada
- [ ] CHANGELOG.md foi atualizado
- [ ] Código foi revisado para performance
- [ ] Não há console.logs ou código de debug deixado
- [ ] Usa tema para cores, espaçamento e tipografia
- [ ] Usa componentes do design system quando possível
- [ ] Animações são sutis e usam native driver

Para mais detalhes, consulte **[AGENTS.md](AGENTS.md)**.

---

## 🔒 Segurança

### Medidas de Segurança Implementadas

- **Hash de Senhas**: Senhas são hasheadas usando SHA-256 antes de serem armazenadas
- **Criptografia de Dados**: Dados sensíveis (sessão e dados do usuário) são criptografados usando AES antes de serem armazenados no AsyncStorage
- **Validação de Entrada**: Todas as entradas do usuário são validadas antes de serem processadas
- **Validação de Regras de Negócio**: Regras de negócio são validadas tanto na camada de ViewModel quanto na camada de Service

### Boas Práticas

- ✅ Nunca armazene senhas em texto plano
- ✅ Sempre valide entradas do usuário
- ✅ Use criptografia para dados sensíveis
- ✅ Implemente validações em múltiplas camadas
- ✅ Mantenha dependências atualizadas

---

## 🔐 Credenciais de Teste

O banco de dados mockado contém os seguintes usuários para teste:

| Campo             | Valor                                                              |
| ----------------- | ------------------------------------------------------------------ |
| **CPF**           | `12345678901`                                                      |
| **Senha**         | `hello`                                                            |
| **Hash da Senha** | `a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3` |

### Notas Importantes

- O banco de dados é simulado usando um arquivo JSON local (`src/data/db.json`)
- Senhas são hasheadas usando SHA-256 antes de serem armazenadas
- O app simula delays de rede para testar performance em conexões lentas
- Interface otimizada para simplicidade e acessibilidade
- Todos os componentes seguem o design system centralizado

---

## 🗺️ Roadmap

### Funcionalidades Futuras

- [ ] Integração com API real
- [ ] Autenticação biométrica
- [ ] Modo offline completo
- [ ] Suporte a múltiplos idiomas
- [ ] Integração com calendário do dispositivo
- [ ] Compartilhamento de consultas
- [ ] Histórico de medicamentos do usuário
- [ ] Lembretes de medicamentos
- [ ] Telemedicina (vídeo consultas)

### Melhorias Técnicas

- [ ] Migração para React Native 0.82+
- [ ] Implementação de cache inteligente
- [ ] Otimização de bundle size
- [ ] Melhorias de performance
- [ ] Testes E2E com Detox
- [ ] CI/CD completo

---

## 📄 Licença

Este projeto é **privado** e foi desenvolvido para fins educacionais.

---

## 👥 Desenvolvedores

Desenvolvido seguindo metodologia TDD, arquitetura MVVM e boas práticas de desenvolvimento mobile.

---

## Informações do Projeto

Desenvolvido com ❤️ usando React Native, Expo e TypeScript

[Documentação](#-documentação) • [Contribuindo](#-contribuindo) • [Roadmap](#-roadmap)

**Versão**: 1.0.0
**Última atualização**: 2024-12-06
