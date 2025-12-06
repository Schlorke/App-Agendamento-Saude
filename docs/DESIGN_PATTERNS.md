# Design Patterns

Este documento descreve padrões de design comuns usados no aplicativo, incluindo layouts, navegação, formulários e feedback ao usuário.

## Índice

1. [Padrões de Layout](#padrões-de-layout)
2. [Padrões de Navegação](#padrões-de-navegação)
3. [Padrões de Formulários](#padrões-de-formulários)
4. [Padrões de Listas](#padrões-de-listas)
5. [Padrões de Feedback](#padrões-de-feedback)

---

## Padrões de Layout

### Layout de Tela Padrão

Todas as telas seguem uma estrutura consistente:

```typescript
<ScrollView style={styles.container}>
  <View style={styles.content}>
    {/* Conteúdo da tela */}
  </View>
</ScrollView>
```

**Estilos padrão:**

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
});
```

### Layout com Header

Telas que precisam de header:

```typescript
<View style={styles.container}>
  <Header
    title="Título da Tela"
    subtitle="Subtítulo opcional"
    showBackButton
    onBack={() => navigation.goBack()}
  />
  <ScrollView style={styles.scrollView}>
    {/* Conteúdo */}
  </ScrollView>
</View>
```

### Layout de Cards

Agrupar conteúdo relacionado em cards:

```typescript
<View style={styles.content}>
  <Card style={styles.card}>
    <Text style={styles.title}>Título</Text>
    <Text>Conteúdo do card</Text>
  </Card>

  <Card style={styles.card}>
    <Text style={styles.title}>Outro Card</Text>
    <Text>Mais conteúdo</Text>
  </Card>
</View>
```

**Espaçamento entre cards:**

```typescript
const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md, // Espaçamento consistente
  },
});
```

---

## Padrões de Navegação

### Navegação com Botão de Voltar

Sempre use o componente Header quando precisar de navegação:

```typescript
<Header
  title="Tela de Detalhes"
  showBackButton
  onBack={() => navigation.goBack()}
/>
```

### Navegação com Ações no Header

```typescript
<Header
  title="Perfil"
  actions={
    <>
      <Button
        title="Editar"
        onPress={() => navigation.navigate('EditProfile')}
        variant="outline"
      />
    </>
  }
/>
```

### Navegação entre Telas

Use sempre o objeto `navigation` do React Navigation:

```typescript
// Navegar para nova tela
navigation.navigate('ScreenName');

// Voltar
navigation.goBack();

// Substituir stack
navigation.replace('ScreenName');
```

---

## Padrões de Formulários

### Estrutura de Formulário

```typescript
<ScrollView
  contentContainerStyle={styles.formContainer}
  keyboardShouldPersistTaps="handled"
>
  <Card>
    <Input
      label="Campo Obrigatório *"
      value={value}
      onChangeText={setValue}
      error={error}
      placeholder="Digite aqui"
    />

    <Input
      label="Campo Opcional"
      value={optionalValue}
      onChangeText={setOptionalValue}
    />

    <Button
      title="Salvar"
      onPress={handleSubmit}
      loading={loading}
      fullWidth
    />
  </Card>
</ScrollView>
```

### Validação de Formulário

Sempre valide antes de submeter:

```typescript
const handleSubmit = async () => {
  // Limpar erros anteriores
  setErrors({});

  // Validações
  if (!nome) {
    setErrors((prev) => ({ ...prev, nome: 'Nome é obrigatório' }));
    return;
  }

  if (!email || !isValidEmail(email)) {
    setErrors((prev) => ({ ...prev, email: 'Email inválido' }));
    return;
  }

  // Submeter
  await submitForm();
};
```

### Estados de Loading em Formulários

```typescript
<Button
  title="Salvar"
  onPress={handleSubmit}
  loading={loading}
  disabled={loading}
  fullWidth
/>
```

---

## Padrões de Listas

### Lista com Cards

```typescript
<ScrollView>
  <View style={styles.listContainer}>
    {items.map(item => (
      <Card key={item.id} style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Card>
    ))}
  </View>
</ScrollView>
```

### Lista com Empty State

Sempre forneça feedback quando a lista estiver vazia:

```typescript
{items.length === 0 ? (
  <EmptyState
    icon="📋"
    title="Nenhum item encontrado"
    description="Adicione itens para começar."
    action={
      <Button
        title="Adicionar Item"
        onPress={handleAdd}
      />
    }
  />
) : (
  items.map(item => (
    <Card key={item.id}>
      {/* Item */}
    </Card>
  ))
)}
```

### Lista com Loading

Use Skeleton para melhor UX:

```typescript
{loading ? (
  <>
    <Skeleton variant="listItem" />
    <Skeleton variant="listItem" />
    <Skeleton variant="listItem" />
  </>
) : (
  items.map(item => (
    <Card key={item.id}>
      {/* Item */}
    </Card>
  ))
)}
```

### Lista com Filtros

```typescript
<View style={styles.filterContainer}>
  <TouchableOpacity
    style={[styles.filterButton, activeFilter === 'all' && styles.filterButtonActive]}
    onPress={() => setActiveFilter('all')}
  >
    <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>
      Todas
    </Text>
  </TouchableOpacity>
  {/* Mais filtros */}
</View>
```

---

## Padrões de Feedback

### Feedback de Sucesso

Use Toast para feedback não bloqueante:

```typescript
const handleSuccess = () => {
  setShowToast(true);
  setToastMessage('Operação realizada com sucesso!');
  setToastType('success');
};
```

### Feedback de Erro

Use Toast ou Modal dependendo da importância:

```typescript
// Erro não crítico - Toast
<Toast
  visible={showErrorToast}
  type="error"
  message="Erro ao salvar dados"
/>

// Erro crítico - Modal
<Modal
  visible={showErrorModal}
  variant="alert"
  title="Erro"
  message="Não foi possível completar a operação."
  primaryAction={{
    label: 'OK',
    onPress: () => setShowErrorModal(false),
  }}
/>
```

### Confirmação de Ações Destrutivas

Sempre use Modal para ações destrutivas:

```typescript
<Modal
  visible={showConfirmModal}
  variant="alert"
  title="Confirmar Exclusão"
  message="Esta ação não pode ser desfeita. Tem certeza?"
  primaryAction={{
    label: 'Sim, excluir',
    onPress: handleDelete,
  }}
  secondaryAction={{
    label: 'Cancelar',
    onPress: () => setShowConfirmModal(false),
  }}
/>
```

### Feedback de Loading

```typescript
// Loading de tela inteira
{loading ? (
  <Loading message="Carregando dados..." />
) : (
  <Content />
)}

// Loading de botão
<Button
  title="Salvar"
  onPress={handleSave}
  loading={saving}
/>
```

### Feedback de Validação

```typescript
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  keyboardType="email-address"
/>
```

---

## Padrões de Espaçamento

### Espaçamento Consistente

Sempre use o tema para espaçamento:

```typescript
// ✅ CORRETO
padding: theme.spacing.lg;
marginBottom: theme.spacing.md;
gap: theme.spacing.sm;

// ❌ ERRADO
padding: 24;
marginBottom: 16;
gap: 8;
```

### Espaçamento entre Seções

```typescript
const styles = StyleSheet.create({
  section: {
    marginBottom: theme.spacing.xl, // Entre seções principais
  },
  item: {
    marginBottom: theme.spacing.md, // Entre itens
  },
});
```

---

## Padrões de Acessibilidade

### Labels de Acessibilidade

Todos os elementos interativos devem ter:

```typescript
<TouchableOpacity
  accessibilityRole="button"
  accessibilityLabel="Botão de salvar"
  accessibilityHint="Toque duas vezes para salvar os dados"
  onPress={handleSave}
>
  <Text>Salvar</Text>
</TouchableOpacity>
```

### Área de Toque Mínima

Elementos clicáveis devem ter pelo menos 44x44px:

```typescript
const styles = StyleSheet.create({
  touchable: {
    minHeight: 44,
    minWidth: 44,
    padding: theme.spacing.md,
  },
});
```

---

## Padrões de Animações

### Animações de Entrada

Use animações sutis para melhorar a percepção:

```typescript
import { fadeIn, slideUp } from '../utils/animations';

const opacityAnim = useRef(new Animated.Value(0)).current;
const translateYAnim = useRef(new Animated.Value(20)).current;

useEffect(() => {
  Animated.parallel([fadeIn(opacityAnim), slideUp(translateYAnim)]).start();
}, []);
```

### Feedback de Press

Componentes clicáveis devem ter feedback visual:

```typescript
// Já implementado em Button e Card
// Usa animação de scale ao pressionar
```

---

**Última atualização**: 2025-12-06
**Versão**: 1.0.0
