# Decisões de Design

Este documento registra decisões importantes de design tomadas durante o desenvolvimento do projeto, incluindo o contexto, alternativas consideradas e justificativas.

## Índice

1. [Decisões de Arquitetura](#decisões-de-arquitetura)
2. [Decisões de Design Visual](#decisões-de-design-visual)
3. [Decisões de Componentes](#decisões-de-componentes)
4. [Decisões de UX](#decisões-de-ux)
5. [Decisões de Acessibilidade](#decisões-de-acessibilidade)

---

## Decisões de Arquitetura

### MVVM Pattern

**Decisão**: Usar arquitetura MVVM (Model-View-ViewModel) ao invés de outras arquiteturas.

**Contexto**: Projeto React Native que precisa de separação clara de responsabilidades e testabilidade.

**Alternativas Consideradas**:

- MVC (Model-View-Controller)
- Redux com hooks
- Arquitetura baseada em Context API

**Justificativa**:

- Separação clara entre lógica de negócio (Model), apresentação (View) e lógica de apresentação (ViewModel)
- Facilita testes unitários
- ViewModels podem ser reutilizados em diferentes Views
- Mantém Views "burras" e focadas apenas em apresentação

**Data**: 2024-01-15

---

## Decisões de Design Visual

### Paleta de Cores - Verde Saúde

**Decisão**: Usar verde (#2E7D32) como cor primária ao invés de azul ou outras cores.

**Contexto**: Aplicativo de saúde que precisa transmitir confiança e bem-estar.

**Alternativas Consideradas**:

- Azul médico (#1976D2) - usado como secundária
- Vermelho - rejeitado por associar com emergência
- Laranja - rejeitado por não transmitir profissionalismo

**Justificativa**:

- Verde está associado a saúde, natureza e bem-estar
- Transmite confiança e tranquilidade
- Diferencia o app de outros apps médicos que usam azul
- Mantém contraste adequado para acessibilidade

**Data**: 2024-01-15

### Sistema de Espaçamento Baseado em 4px

**Decisão**: Usar múltiplos de 4px para todos os espaçamentos (4, 8, 16, 24, 32, 48).

**Contexto**: Necessidade de consistência visual e facilidade de implementação.

**Alternativas Consideradas**:

- Sistema baseado em 8px
- Espaçamentos arbitrários
- Sistema baseado em rem/em

**Justificativa**:

- 4px é divisível por 2, facilitando cálculos
- Permite granularidade suficiente sem ser excessivo
- Alinhado com Material Design e outras guidelines
- Facilita implementação e manutenção

**Data**: 2024-01-15

### Uso de Emojis como Ícones

**Decisão**: Usar emojis simples ao invés de bibliotecas de ícones (como react-native-vector-icons).

**Contexto**: Simplicidade, reconhecimento imediato e evitar dependências adicionais.

**Alternativas Consideradas**:

- react-native-vector-icons
- @expo/vector-icons
- SVG customizado

**Justificativa**:

- Emojis são universais e reconhecidos imediatamente
- Não requerem bibliotecas adicionais
- Funcionam em todas as plataformas
- Reduz tamanho do bundle
- Adequado para público com pouca afinidade tecnológica

**Limitação**: Emojis podem variar entre plataformas, mas isso é aceitável para este projeto.

**Data**: 2024-01-15

---

## Decisões de Componentes

### Componente Button com Animações

**Decisão**: Implementar animação de scale ao pressionar ao invés de apenas opacity.

**Contexto**: Melhorar feedback visual e experiência do usuário.

**Alternativas Consideradas**:

- Apenas `activeOpacity` (opção padrão do TouchableOpacity)
- Ripple effect (mais complexo)
- Sem animação

**Justificativa**:

- Scale animation fornece feedback mais claro
- Mantém simplicidade (não requer bibliotecas adicionais)
- Melhora percepção de interatividade
- Alinhado com padrões modernos de UI

**Data**: 2025-12-06

### Input com Animação de Foco

**Decisão**: Implementar animação suave de transição de cor da borda ao focar.

**Contexto**: Melhorar feedback visual quando o usuário interage com inputs.

**Alternativas Consideradas**:

- Mudança instantânea de cor
- Label flutuante (mais complexo)
- Sem feedback visual

**Justificativa**:

- Animação suave melhora percepção de qualidade
- Não adiciona complexidade excessiva
- Fornece feedback claro sem distrair
- Mantém acessibilidade (não depende apenas de cor)

**Data**: 2025-12-06

### Card com Variantes

**Decisão**: Criar variantes de Card (elevated, outlined, flat) ao invés de apenas um estilo.

**Contexto**: Necessidade de diferentes níveis de hierarquia visual.

**Alternativas Consideradas**:

- Apenas um estilo de card
- Múltiplos componentes (ElevatedCard, OutlinedCard, etc.)

**Justificativa**:

- Variantes permitem flexibilidade sem duplicação de código
- Mantém API consistente
- Facilita manutenção
- Segue padrão de design systems modernos

**Data**: 2025-12-06

### Sistema de Toast ao Invés de Alert Nativo

**Decisão**: Criar componente Toast customizado ao invés de usar Alert do React Native.

**Contexto**: Alert nativo não segue o design system e não é customizável.

**Alternativas Consideradas**:

- Alert nativo do React Native
- Biblioteca de toast (react-native-toast-message)
- Snackbar

**Justificativa**:

- Toast customizado segue design system
- Permite controle total sobre aparência e comportamento
- Não bloqueia interação do usuário (ao contrário de Alert)
- Pode ser animado e posicionado conforme necessário

**Data**: 2025-12-06

---

## Decisões de UX

### Validação em Tempo Real

**Decisão**: Validar campos de formulário em tempo real ao invés de apenas no submit.

**Contexto**: Melhorar experiência do usuário e reduzir frustrações.

**Alternativas Consideradas**:

- Validação apenas no submit
- Validação ao perder foco (onBlur)
- Validação após digitar (debounced)

**Justificativa**:

- Feedback imediato ajuda usuário a corrigir erros rapidamente
- Reduz número de tentativas de submit
- Melhora percepção de qualidade do app
- Especialmente importante para público com pouca afinidade tecnológica

**Data**: 2024-01-15

### Estados Vazios com EmptyState

**Decisão**: Sempre exibir componente EmptyState quando listas estão vazias.

**Contexto**: Fornecer contexto e orientação quando não há dados.

**Alternativas Consideradas**:

- Apenas mensagem de texto
- Nada (tela em branco)
- Loading infinito

**Justificativa**:

- EmptyState fornece contexto e orientação
- Reduz confusão do usuário
- Pode incluir ações (ex: "Agendar primeira consulta")
- Melhora experiência geral

**Data**: 2025-12-06

### Skeleton Loading ao Invés de Spinner

**Decisão**: Usar Skeleton loading para listas ao invés de apenas ActivityIndicator.

**Contexto**: Melhorar percepção de performance e reduzir "flash of empty content".

**Alternativas Consideradas**:

- Apenas ActivityIndicator
- Nada (tela em branco durante loading)
- Placeholder estático

**Justificativa**:

- Skeleton mostra estrutura do conteúdo que está carregando
- Reduz percepção de tempo de espera
- Fornece contexto visual
- Alinhado com padrões modernos (Facebook, LinkedIn, etc.)

**Data**: 2025-12-06

---

## Decisões de Acessibilidade

### Labels de Acessibilidade Obrigatórios

**Decisão**: Todos os componentes interativos devem ter `accessibilityLabel` e `accessibilityRole`.

**Contexto**: Garantir que o app seja acessível para usuários com deficiência visual.

**Alternativas Consideradas**:

- Labels opcionais
- Apenas para elementos críticos
- Depender de texto visível

**Justificativa**:

- Acessibilidade não é opcional, é um direito
- Labels explícitos melhoram experiência com leitores de tela
- Facilita testes de acessibilidade
- Alinhado com WCAG 2.1

**Data**: 2024-01-15

### Área de Toque Mínima de 44x44px

**Decisão**: Todos os elementos interativos devem ter área de toque mínima de 44x44 pixels.

**Contexto**: Garantir que elementos sejam fáceis de tocar, especialmente em dispositivos móveis.

**Alternativas Consideradas**:

- 40x40px (mínimo técnico)
- 48x48px (maior)
- Sem mínimo

**Justificativa**:

- 44x44px é o padrão da indústria (Apple HIG, Material Design)
- Balanceia usabilidade e densidade de informação
- Especialmente importante para público com pouca afinidade tecnológica
- Reduz erros de toque

**Data**: 2024-01-15

---

## Decisões de Performance

### Animações com useNativeDriver

**Decisão**: Sempre usar `useNativeDriver: true` quando possível em animações.

**Contexto**: Melhorar performance de animações, especialmente em listas longas.

**Alternativas Consideradas**:

- useNativeDriver: false (padrão)
- Sem animações

**Justificativa**:

- Animações com native driver rodam na thread nativa
- Não bloqueiam thread JavaScript
- Melhor performance, especialmente em dispositivos mais antigos
- Experiência mais suave

**Limitação**: Algumas propriedades não suportam native driver (ex: width, height sem transform).

**Data**: 2025-12-06

---

## Decisões Futuras (Planejadas)

### Dark Mode

**Status**: Planejado para versão futura

**Decisão Pendente**: Como implementar dark mode mantendo identidade visual.

**Considerações**:

- Manter verde saúde como cor primária
- Ajustar cores de fundo e texto
- Testar contraste em modo escuro
- Considerar preferência do sistema

### Biblioteca de Ícones

**Status**: Em avaliação

**Decisão Pendente**: Se migrar de emojis para biblioteca de ícones.

**Considerações**:

- Consistência entre plataformas
- Mais opções de ícones
- Aumento do tamanho do bundle
- Complexidade adicional

---

**Última atualização**: 2025-12-06
**Versão**: 1.0.0
