# Erros Conhecidos e Limitações

Este documento registra bugs conhecidos, limitações e workarounds do projeto. **Sempre consulte este arquivo antes de investigar um problema que parece familiar.**

## Índice

1. [Erros Conhecidos](#erros-conhecidos)
2. [Limitações de Componentes](#limitações-de-componentes)
3. [Workarounds](#workarounds)
4. [Erros Comuns e Soluções](#erros-comuns-e-soluções)

---

## Erros Conhecidos

### Nenhum Erro Conhecido no Momento

Atualmente não há erros conhecidos no projeto. Este arquivo será atualizado conforme bugs forem identificados.

**Como reportar um bug:**

1. Verifique se o bug já está listado aqui
2. Se não estiver, adicione uma entrada seguindo o formato abaixo
3. Inclua: descrição, passos para reproduzir, comportamento esperado vs atual, workaround (se houver)

**Formato para adicionar bugs:**

```markdown
### [Título do Bug]

**Descrição**: Descrição clara do problema

**Passos para Reproduzir**:

1. Passo 1
2. Passo 2
3. Passo 3

**Comportamento Esperado**: O que deveria acontecer

**Comportamento Atual**: O que está acontecendo

**Workaround**: Solução temporária (se houver)

**Status**: `aberto` | `em investigação` | `resolvido`

**Data**: YYYY-MM-DD
```

---

## Limitações de Componentes

### Modal

**Limitação**: O Modal não fecha automaticamente ao tocar no backdrop se `onClose` não for fornecido.

**Solução**: Sempre forneça `onClose` quando usar Modal:

```typescript
// ✅ CORRETO
<Modal
  visible={showModal}
  onClose={() => setShowModal(false)}
  // ...
/>

// ❌ ERRADO - backdrop não funcionará
<Modal
  visible={showModal}
  // onClose ausente
/>
```

### Toast

**Limitação**: Múltiplos Toasts não são suportados simultaneamente. Apenas um Toast pode ser exibido por vez.

**Solução**: Use um sistema de fila de toasts ou gerencie o estado globalmente:

```typescript
// ✅ CORRETO - gerenciar estado globalmente
const [toast, setToast] = useState<{ visible: boolean; message: string; type: string }>({
  visible: false,
  message: '',
  type: 'info',
});

<Toast
  visible={toast.visible}
  message={toast.message}
  type={toast.type}
  onDismiss={() => setToast({ ...toast, visible: false })}
/>
```

### Input

**Limitação**: A animação de foco não funciona corretamente se o input for desmontado enquanto focado.

**Solução**: Sempre limpe o estado de foco antes de desmontar:

```typescript
// ✅ CORRETO
useEffect(() => {
  return () => {
    // Cleanup se necessário
  };
}, []);
```

### Card Clicável

**Limitação**: Quando `onPress` é fornecido, o Card não pode ter filhos clicáveis (botões dentro do card).

**Solução**: Use `onPress` no Card OU botões dentro do Card, não ambos:

```typescript
// ✅ CORRETO - Card clicável sem botões internos
<Card onPress={handleCardPress}>
  <Text>Conteúdo</Text>
</Card>

// ✅ CORRETO - Card com botões internos (sem onPress no Card)
<Card>
  <Text>Conteúdo</Text>
  <Button title="Ação" onPress={handleAction} />
</Card>

// ❌ ERRADO - conflito de eventos
<Card onPress={handleCardPress}>
  <Button title="Ação" onPress={handleAction} />
</Card>
```

---

## Workarounds

### Animações em Listas Longas

**Problema**: Animações de entrada em listas muito longas podem causar performance issues.

**Workaround**: Limite animações aos primeiros N itens ou use `useNativeDriver: true`:

```typescript
// ✅ CORRETO - usar native driver
const animation = Animated.timing(value, {
  toValue: 1,
  duration: 250,
  useNativeDriver: true, // Sempre use quando possível
});
```

### Navegação com Animações

**Problema**: Animações podem conflitar com transições de navegação do React Navigation.

**Workaround**: Aguarde a transição de navegação antes de iniciar animações:

```typescript
// ✅ CORRETO
useEffect(() => {
  const timer = setTimeout(() => {
    // Iniciar animações após navegação
    startAnimations();
  }, 300);

  return () => clearTimeout(timer);
}, []);
```

---

## Erros Comuns e Soluções

### Erro: "Cannot read property 'setValue' of undefined"

**Causa**: Tentativa de usar `Animated.Value` antes de ser inicializado.

**Solução**: Sempre inicialize valores animados com `useRef`:

```typescript
// ✅ CORRETO
const animValue = useRef(new Animated.Value(0)).current;

// ❌ ERRADO
const animValue = new Animated.Value(0); // Perde referência em re-renders
```

### Erro: "Warning: Cannot update a component while rendering"

**Causa**: Atualização de estado durante renderização.

**Solução**: Use `useEffect` para atualizações de estado:

```typescript
// ✅ CORRETO
useEffect(() => {
  setState(newValue);
}, [dependency]);

// ❌ ERRADO
const Component = () => {
  setState(newValue); // Durante render
  return <View />;
};
```

### Erro: Animações não funcionam após navegação

**Causa**: Componente desmontado antes da animação completar.

**Solução**: Limpe animações no cleanup:

```typescript
// ✅ CORRETO
useEffect(() => {
  const animation = startAnimation();

  return () => {
    animation.stop();
  };
}, []);
```

### Erro: Toast não aparece

**Causa**: `visible` não está sendo gerenciado corretamente ou múltiplos toasts.

**Solução**: Gerencie estado de toast globalmente:

```typescript
// ✅ CORRETO
const [toast, setToast] = useState({
  visible: false,
  message: '',
  type: 'info',
});

const showToast = (message: string, type: string) => {
  setToast({ visible: true, message, type });
  setTimeout(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, 3000);
};
```

### Erro: Input não anima ao focar

**Causa**: `onFocus` ou `onBlur` não estão sendo passados corretamente.

**Solução**: O componente Input gerencia foco internamente, não passe `onFocus`/`onBlur` diretamente:

```typescript
// ✅ CORRETO
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
/>

// ❌ ERRADO - sobrescreve lógica interna
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  onFocus={handleFocus} // Conflita com animação interna
/>
```

---

## Avisos Esperados no Console (Desenvolvimento Web)

### expo-notifications: Push Token Changes

**Aviso**: `[expo-notifications] Listening to push token changes is not yet fully supported on web. Adding a listener will have no effect.`

**Causa**: Notificações push não são totalmente suportadas na web. O módulo é carregado mesmo quando não será usado.

**Status**: Esperado e inofensivo. O código já verifica a plataforma antes de inicializar notificações (ver `App.tsx` linha 39-41).

**Ação**: Nenhuma ação necessária. Este aviso não afeta a funcionalidade.

### Animated: useNativeDriver

**Aviso**: `Animated: useNativeDriver is not supported because the native animated module is missing. Falling back to JS-based animation.`

**Causa**: O módulo nativo de animação não está disponível na web. React Native Web usa animações JavaScript como fallback.

**Status**: Esperado e inofensivo. As animações funcionam normalmente, apenas usando JavaScript ao invés do driver nativo.

**Ação**: Nenhuma ação necessária. Este aviso não afeta a funcionalidade.

### react-native-web: pointerEvents Deprecated

**Aviso**: `props.pointerEvents is deprecated. Use style.pointerEvents`

**Causa**: Versões antigas de componentes podem ainda usar `pointerEvents` como prop ao invés de estilo.

**Status**:

- ✅ Corrigido em `Toast.tsx` (movendo `pointerEvents` de prop para `style`).
- ⚠️ Warning ainda aparece no `AuthStack.tsx` (linha 36) mas vem de dentro do `@react-navigation/stack` (componente `HeaderContainer`). Este é um problema interno da biblioteca e não pode ser corrigido diretamente no nosso código.

**Ação**:

- Se aparecer em componentes nossos, mover `pointerEvents` de prop para `style`.
- O warning do `@react-navigation/stack` será resolvido quando a biblioteca for atualizada. Não há ação necessária do nosso lado.

## Limitações do Design System

### Cores

**Limitação**: O design system não suporta dark mode atualmente.

**Status**: Planejado para versão futura.

**Workaround**: Use apenas cores do tema atual.

### Animações

**Limitação**: Algumas animações podem não funcionar em dispositivos mais antigos.

**Workaround**: Teste em dispositivos reais e considere reduzir complexidade de animações se necessário.

### Acessibilidade

**Limitação**: Alguns componentes podem precisar de ajustes para leitores de tela específicos.

**Status**: Em constante melhoria.

**Workaround**: Teste sempre com TalkBack (Android) e VoiceOver (iOS).

---

## Como Contribuir

Ao encontrar um bug ou limitação:

1. Verifique se já está documentado aqui
2. Se não estiver, adicione seguindo o formato
3. Inclua informações suficientes para reproduzir
4. Proponha workaround se possível
5. Atualize o status quando o bug for resolvido

---

**Última atualização**: 2025-12-06
**Versão**: 1.0.0
