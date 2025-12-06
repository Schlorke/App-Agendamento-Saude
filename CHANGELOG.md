# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Documentação

- **README.md Profissional**: README.md completamente reestruturado com formato enterprise, incluindo badges, estrutura completa, tabelas organizadas e links para toda a documentação
- **Índice de Documentação**: Criado `docs/README.md` como índice central de toda a documentação do projeto, com navegação rápida, busca por tópicos e checklist de documentação
- **Organização de Documentação**: Melhorada organização da documentação com categorização clara (Arquitetura, Design, Acessibilidade, Troubleshooting) e guias específicos por perfil (Desenvolvedores, Designers, Agentes de IA)

### Fixed

- **TypeScript Errors**: Corrigidos erros de tipo no Input.tsx para compatibilidade com React Native 0.81.5 (onFocus/onBlur handlers)
- **HistoryScreen**: Corrigido uso de `consulta.profissional` para usar `profissionalId` com mapa de profissionais
- **Card Component**: Adicionado suporte a props de acessibilidade (accessibilityLabel, accessibilityHint) para melhorar acessibilidade
- **Testes - Expo Notifications Mock**: Adicionados métodos faltantes no mock do `expo-notifications` (`getPermissionsAsync`, `requestPermissionsAsync`, `SchedulableTriggerInputTypes`) para corrigir erros nos testes
- **Testes - Warnings de Animações**: Suprimidos warnings esperados de `act(...)` e animações do React Native nos testes, melhorando a legibilidade do output
- **Testes - Timers e Environment**: Corrigido problema de "Jest environment torn down" adicionando limpeza adequada de timers após cada teste
- **Testes - Input Component**: Adicionado uso de `act()` e controle de timers nos testes do Input para evitar warnings de animações
- **Testes - LoginScreen**: Adicionado uso de `act()` e controle de timers nos testes do LoginScreen para melhor compatibilidade com animações
- **Testes - Fake Timers**: Ativado `jest.useFakeTimers()` e limpeza de timers nos testes do Input e LoginScreen para evitar warnings e acessos ao ambiente após teardown

<!-- Removido bloco duplicado: '### Added' (sem conteúdo) encontrado por validação CI. Nenhuma ação necessária. -->

#### Sistema de Design e Componentes

- **Sistema de Animações**: Criado `src/utils/animations.ts` com funções reutilizáveis de animação (fadeIn, fadeOut, slideUp, scalePress, pulse, shake, staggerFadeIn)
- **Componente Badge**: Componente para status, tags e contadores com variantes (primary, success, error, warning, neutral) e tamanhos (small, medium, large)
- **Componente EmptyState**: Componente padronizado para estados vazios com ícone, título, descrição e ação opcional
- **Componente Header**: Header consistente para telas com título, subtítulo, ações e suporte a botão de voltar
- **Componente Modal**: Modal seguindo design system com variantes (alert, confirm, info) e animações de entrada/saída
- **Componente Toast**: Sistema de notificações toast com tipos (success, error, warning, info), posições (top, bottom, center) e auto-dismiss
- **Componente Skeleton**: Componente de skeleton loading com variantes (text, card, listItem) e animação de pulso

#### Melhorias em Componentes Existentes

- **Button**: Adicionada animação de scale ao pressionar para melhor feedback visual
- **Input**: Implementada animação suave de transição de cor da borda ao focar
- **Card**: Adicionadas variantes (elevated, outlined, flat) e animação de press quando clicável
- **Loading**: Adicionada animação de pulso sutil no texto da mensagem

#### Documentação de Design

- **COMPONENT_LIBRARY.md**: Documentação completa de todos os componentes com exemplos de uso, props, variantes e quando usar cada componente
- **DESIGN_PATTERNS.md**: Padrões de layout, navegação, formulários, listas e feedback ao usuário
- **ACCESSIBILITY_GUIDE.md**: Guia completo de acessibilidade com exemplos práticos, checklist e testes

#### Sistema de Contexto para IA

- **KNOWN_ISSUES.md**: Registro de erros conhecidos, limitações de componentes, workarounds e erros comuns com soluções
- **DESIGN_DECISIONS.md**: Registro de decisões importantes de design com contexto, alternativas consideradas e justificativas
- **COMPONENT_USAGE_EXAMPLES.md**: Exemplos práticos e completos de uso de componentes em situações reais
- **AI_CONTEXT.md**: Guia específico para IAs entenderem o projeto, suas convenções e como implementar novos recursos

#### Melhorias de UX nas Telas

- **HomeScreen**: Melhorada com animações de entrada escalonadas, uso de Card component e melhor hierarquia visual
- **HistoryScreen**: Melhorada com Badge component para status, EmptyState padronizado, Skeleton loading e melhor organização visual
- **NewsScreen**: Melhorada com Skeleton loading e EmptyState padronizado
- **MedicationsScreen**: Melhorada com Skeleton loading e EmptyState padronizado

### Changed

- **DESIGN_SYSTEM.md**: Expandido com seção detalhada de animações, exemplos de implementação, microinterações e referências aos novos documentos
- **AGENTS.md**: Adicionadas seções sobre design system, sistema de contexto para IA, referências rápidas e checklist expandido
- **Button.tsx**: Adicionada animação de scale ao pressionar usando sistema de animações
- **Input.tsx**: Implementada animação de foco com transição suave da cor da borda
- **Card.tsx**: Adicionadas variantes visuais e suporte a animação quando clicável
- **Loading.tsx**: Adicionada animação de pulso no texto da mensagem
- **HomeScreen.tsx**: Refatorada para usar Card component e animações de entrada
- **HistoryScreen.tsx**: Refatorada para usar Badge, EmptyState e Skeleton components
- **NewsScreen.tsx**: Refatorada para usar Skeleton e EmptyState ao invés de Loading genérico
- **MedicationsScreen.tsx**: Refatorada para usar Skeleton e EmptyState ao invés de Loading genérico
- **.eslintrc.json**: Desabilitada regra `react-hooks/refs` que gerava falsos positivos para o padrão válido `useRef(...).current`

#### Correções de Linting

- Corrigidos todos os erros de linting relacionados a:
  - Uso de refs em componentes com animações (desabilitada regra `react-hooks/refs` que gerava falsos positivos)
  - Ordem de declaração de funções no Toast (handleDismiss movido antes do useEffect usando useCallback)
  - Hooks sendo chamados dentro de callbacks no HomeScreen (refatorado para usar useMemo)
  - Imports não utilizados (Text em Loading.tsx removido, já que usa Animated.Text)
  - Tipos `any` em Input.tsx (substituídos por `NativeSyntheticEvent<TextInputFocusEventData>`)
  - Parâmetros não utilizados em funções de animação (prefixados com \_ onde apropriado)

#### Funcionalidades Anteriores

- **RF04 - Validação de 24h no cancelamento**: Implementada validação que bloqueia cancelamentos com menos de 24 horas de antecedência
- **RF06 - Tela de Notícias/Campanhas**: Criada `NewsScreen.tsx` com `NewsViewModel.ts` para exibir notícias e campanhas de saúde
- **RF07 - Tela de Farmácias de Plantão**: Criada `PharmaciesScreen.tsx` com `PharmaciesViewModel.ts` para listar farmácias de plantão
- **RF08 - Notificações Push**: Implementado serviço completo de notificações com `notificationService.ts` usando expo-notifications
  - Notificações de confirmação ao agendar consulta
  - Notificações de lembrete 1 dia antes da consulta
  - Cancelamento automático de notificações ao cancelar consulta
- **RF09 - Edição de Perfil**: Criada `EditProfileScreen.tsx` com `EditProfileViewModel.ts` para editar telefone e endereço
- **RF10 - Tela de Medicamentos**: Criada `MedicationsScreen.tsx` com `MedicationsViewModel.ts` para exibir informações sobre medicamentos
- Métodos no `dataService.ts`:
  - `buscarNoticias()` - Busca todas as notícias
  - `buscarFarmacias()` - Busca todas as farmácias de plantão
  - `buscarMedicamentos()` - Busca todos os medicamentos
  - `buscarConsultaPorId()` - Busca uma consulta por ID
- Interfaces TypeScript para novos tipos:
  - `Noticia`, `Farmacia`, `Medicamento` em `dataService.ts`
- Testes unitários para novos ViewModels:
  - `NewsViewModel.test.ts`
  - `PharmaciesViewModel.test.ts`
  - `MedicationsViewModel.test.ts`
  - `EditProfileViewModel.test.ts`
  - Testes de validação de 24h em `CancelAppointmentViewModel.test.ts`
- Testes de serviços:
  - `storageService.test.ts` cobrindo criptografia de sessão e dados sensíveis
  - `dataService.test.ts` cobrindo validação de 24h no cancelamento
- Configuração de testes atualizada:
  - `jest-expo` 54 + `jest` 29.7.0 adicionados como dependências de desenvolvimento
  - `babel.config.js` criado para habilitar transformações com `babel-preset-expo`
- Navegação atualizada:
  - Adicionadas rotas `News`, `Pharmacies`, `Medications`, `EditProfile` no `AppStack`
  - Botões de navegação na `HomeScreen` para as novas telas
- Sistema completo de documentação enterprise
  - `AGENTS.md` - Guia completo para agentes de IA (localizado na raiz para fácil descoberta)
  - `/docs/ARCHITECTURE.md` - Documentação da arquitetura MVVM
  - `/docs/DESIGN_SYSTEM.md` - Sistema de design visual
- `CHANGELOG.md` - Registro de mudanças do projeto
- Blocos de documentação JSDoc em todos os componentes `.tsx`

#### Mudanças Anteriores

- `AppStack.tsx` - Convertido para Stack Navigator contendo Tab Navigator e novas rotas secundárias
- `CancelAppointmentViewModel.ts` - Adicionada validação de 24h antes de cancelar consulta
- `ScheduleViewModel.ts` - Integrado com serviço de notificações para agendar notificações ao criar consulta
- `ProfileScreen.tsx` - Implementada navegação para `EditProfileScreen`
- `App.tsx` - Adicionada configuração de handlers de notificações e solicitação de permissões
- `README.md` - Reestruturado com formato profissional e links para documentação
- `AGENTS.md` - Movido de `/docs/` para a raiz do projeto para facilitar descoberta por IAs e IDEs
- `dataService.ts` - Cancelamento agora valida antecedência mínima de 24h na camada de serviço
- `storageService.ts` - Persistência local agora grava sessão e dados de usuário criptografados
- Acessibilidade reforçada em `Button`, `HomeScreen` e `HistoryScreen` com `accessibilityLabel`/`accessibilityHint`/`accessibilityRole` padrão
- `jest.config.js` - Agora deriva do preset `jest-expo`; `jest.setup.js` ajustado para lidar com versões recentes do React Native

#### Correções Anteriores

- Corrigido erro de linting no arquivo `temp-template/package/metro.config.js` adicionando `temp-template/` aos padrões ignorados do ESLint
- Corrigido erro de permissão ao fazer `git add` adicionando `.gradle/` e `temp-template/` ao `.gitignore`
- Corrigido scripts do `package.json` que usavam `expo` diretamente: atualizados para usar `pnpm exec expo` para garantir uso da versão instalada localmente
- Adicionado `.gitattributes` para normalizar line endings (LF/CRLF) automaticamente
- Adicionado `android/` e `ios/` ao `.gitignore` para ignorar diretórios nativos gerados pelo `expo prebuild`
- Corrigidos warnings do npm alterando script `build` para usar `pnpm` ao invés de `npm`, eliminando avisos sobre configurações de ambiente desconhecidas
- Removido aviso do script `prebuild` sobre possível falha do Expo SDK 54
- Resolvido aviso do Android `userInterfaceStyle` instalando `expo-system-ui`
- Corrigidos problemas de linting markdown no `DESIGN_SYSTEM.md`: convertidas ênfases em títulos adequados e resolvidos títulos duplicados adicionando contexto específico

### Removed

- Removida pasta `temp-template/` que não estava sendo utilizada no projeto (template temporário do Expo)

### Security

- Criptografia AES aplicada aos dados sensíveis armazenados no AsyncStorage (sessão e dados do usuário)
