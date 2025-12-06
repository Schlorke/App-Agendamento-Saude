# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **LoginViewModel**: Adicionados logs de debug em modo desenvolvimento para diagnosticar problemas de login (usuário não encontrado, senha incorreta).
- **App.tsx**: Adicionadas funções de debug no console do navegador:
  - `window.debugUsuario("CPF")`: Verifica se um usuário existe no banco de dados
  - `window.listarUsuarios()`: Lista todos os usuários cadastrados
  - `window.exportarDados()`: Exporta todos os dados do banco (útil para migração entre navegadores)
  - `window.importarDados(JSON)`: Importa dados de outro navegador
- **dataService.ts**: Adicionados métodos `importarDatabase()` e `exportarDatabase()` para facilitar migração de dados entre navegadores.
- **lucide-react-native**: Adicionada biblioteca de ícones Lucide para substituir emojis por ícones vetoriais elegantes e consistentes com a identidade visual do projeto.

### Fixed

- **RegisterScreen.tsx**: Corrigido problema de scroll na web removendo `flexGrow: 1` do `scrollContent` na web (que impedia o scroll) e ajustando estrutura do `ScrollView` para permitir scroll correto no navegador.
- **Navigation/index.tsx**: Adicionados estilos específicos para web no `NavigationContainer` para garantir altura correta e permitir scroll nas telas.
- **LoginScreen.tsx**: Ajustado `KeyboardAvoidingView` para ser desabilitado na web e melhorados estilos do `ScrollView`.
- **AppStack.tsx**: Corrigido conflito de nomes na navegação renomeando a tela do Stack Navigator de "Home" para "MainTabs", eliminando o warning "Found screens with the same name nested inside one another" do React Navigation. O Tab Navigator interno ainda mantém a tela "Home" funcionando corretamente.

- **Input.tsx, EmptyState.tsx, Header.tsx**: Corrigido erro "Unexpected text node" no React Native Web substituindo renderização condicional com `&&` por operadores ternários com `null`. Isso garante que valores `undefined` ou `false` não sejam renderizados diretamente como texto dentro de componentes `<View>`.
- **dataService.ts, App.tsx**: Adicionado método `limparDatabase()` e exposição de métodos de desenvolvimento no console do navegador (`window.resetDatabase()` e `window.limparDatabase()`) para facilitar limpeza de dados durante desenvolvimento.
- **theme.ts**: Corrigido warning "shadow\* style props are deprecated" adicionando suporte para `boxShadow` na web enquanto mantém compatibilidade com React Native usando `Platform.OS`.
- **Toast.tsx**: Corrigido warning "props.pointerEvents is deprecated" movendo `pointerEvents` de prop para `style`.
- **App.tsx**: Corrigido warning do expo-notifications na web usando importação condicional para evitar carregar o módulo em plataformas web onde push tokens não são suportados. Agora o módulo só é carregado em plataformas móveis (iOS/Android).
- **animations.ts, Toast.tsx**: Adicionada verificação de plataforma para `useNativeDriver` (não suportado na web), eliminando warnings do Animated.
- **LoginViewModel.ts**: Corrigido tratamento do CPF para sempre limpar formatação antes de buscar usuário no banco de dados, garantindo que CPF formatado e não formatado funcionem corretamente.
- **RegisterScreen.tsx**: Corrigido envio do CPF ao ViewModel para sempre enviar CPF limpo (sem formatação), garantindo consistência no armazenamento.
- **LoginScreen.tsx**: Corrigido envio do CPF ao ViewModel para sempre enviar CPF limpo (sem formatação), garantindo consistência na busca.
- **dataService.ts**: Melhorada comparação de CPF em `buscarUsuarioPorCPF` e `cpfJaCadastrado` para sempre limpar formatação de ambos os lados da comparação, garantindo que CPFs sejam encontrados independentemente da formatação.
- Corrigido warning relacionado ao bloco duplicado `### Added` detectado na validação CI do CHANGELOG.md.

### Changed

- **src/services/dataService.ts**: Dados agora sao carregados de um cache em memoria e persistidos em AsyncStorage (funciona no Expo e Web), com metodo de reset para testes e inicializacao com o seed de db.json.
- **src/hooks/useAuth.tsx**, **App.tsx**: useAuth convertido para Context + AuthProvider global, e o app passou a envolver a navegacao com o provider para compartilhar a sessao entre telas e plataformas.
- **HomeScreen.tsx**: Substituídos emojis por ícones Lucide (Calendar, ClipboardList, Megaphone, Pill, Syringe, UserCircle) com coloração da identidade visual do projeto (verde primário, laranja, vermelho, azul). Melhorado layout dos cards com ícones alinhados ao lado dos títulos.
- **RegisterScreen.tsx**: Alterado formato de data de nascimento de YYYY-MM-DD para DD/MM/YYYY com formatação automática durante a digitação. Conversão automática para YYYY-MM-DD antes de enviar ao ViewModel.
- **Input.tsx**: Corrigido alinhamento vertical do placeholder e texto dos inputs. Adicionado suporte específico para campos multiline com alinhamento adequado.
- **validation.ts**: Melhorada validação de data de nascimento com verificação de datas inválidas (ex: 31/02).

- **LoginViewModel.ts**: Corrigido tratamento do CPF para sempre limpar formatação antes de buscar usuário no banco de dados, garantindo que CPF formatado e não formatado funcionem corretamente.
- **RegisterScreen.tsx**: Corrigido envio do CPF ao ViewModel para sempre enviar CPF limpo (sem formatação), garantindo consistência no armazenamento.
- **LoginScreen.tsx**: Corrigido envio do CPF ao ViewModel para sempre enviar CPF limpo (sem formatação), garantindo consistência na busca.
- **dataService.ts**: Melhorada comparação de CPF em `buscarUsuarioPorCPF` e `cpfJaCadastrado` para sempre limpar formatação de ambos os lados da comparação, garantindo que CPFs sejam encontrados independentemente da formatação.

#### Documentação

- **README.md Profissional**: README.md completamente reestruturado com formato enterprise, incluindo badges, estrutura completa, tabelas organizadas e links para toda a documentação
- **Índice de Documentação**: Criado `docs/README.md` como índice central de toda a documentação do projeto, com navegação rápida, busca por tópicos e checklist de documentação
- **Organização de Documentação**: Melhorada organização da documentação com categorização clara (Arquitetura, Design, Acessibilidade, Troubleshooting) e guias específicos por perfil (Desenvolvedores, Designers, Agentes de IA)

- **README.md - Diagrama de Arquitetura**: Substituído diagrama ASCII por diagrama Mermaid profissional e visual para melhor representação da arquitetura MVVM
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

<!-- Corrigido warning: bloco duplicado de '### Fixed' removido para evitar conflitos na validação CI. -->

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
