# Guia de Acessibilidade

Este guia fornece diretrizes completas para implementar acessibilidade no aplicativo, garantindo que todos os usuários possam usar o app de forma eficiente.

## Índice

1. [Princípios Fundamentais](#princípios-fundamentais)
2. [Labels e Hints](#labels-e-hints)
3. [Roles e Estados](#roles-e-estados)
4. [Contraste e Cores](#contraste-e-cores)
5. [Tamanhos de Toque](#tamanhos-de-toque)
6. [Navegação por Teclado](#navegação-por-teclado)
7. [Testes de Acessibilidade](#testes-de-acessibilidade)
8. [Checklist](#checklist)

---

## Princípios Fundamentais

### 1. Perceptível

- Informações devem ser apresentadas de forma que todos os usuários possam percebê-las
- Use contraste adequado
- Forneça alternativas textuais para imagens
- Use labels descritivos

### 2. Operável

- Interface deve ser operável por todos
- Áreas de toque devem ser grandes o suficiente
- Não dependa apenas de gestos complexos
- Forneça tempo suficiente para interações

### 3. Compreensível

- Interface deve ser fácil de entender
- Use linguagem clara e simples
- Forneça feedback claro
- Evite mudanças inesperadas

### 4. Robusto

- Conteúdo deve ser compatível com tecnologias assistivas
- Use semântica HTML adequada
- Teste com leitores de tela

---

## Labels e Hints

### accessibilityLabel

Descreve o elemento de forma clara e concisa:

```typescript
// ✅ CORRETO
<TouchableOpacity
  accessibilityLabel="Botão de login"
  onPress={handleLogin}
>
  <Text>Entrar</Text>
</TouchableOpacity>

// ❌ ERRADO - muito genérico
<TouchableOpacity
  accessibilityLabel="Botão"
  onPress={handleLogin}
>
  <Text>Entrar</Text>
</TouchableOpacity>
```

### accessibilityHint

Fornece instruções sobre o que acontece ao interagir:

```typescript
<TouchableOpacity
  accessibilityLabel="Agendar consulta"
  accessibilityHint="Toque duas vezes para abrir a tela de agendamento"
  onPress={() => navigation.navigate('Schedule')}
>
  <Text>📅 Agendar Consulta</Text>
</TouchableOpacity>
```

### Quando Usar Hint

- Ações que não são óbvias pelo label
- Elementos que têm comportamento especial
- Quando o contexto ajuda o usuário

```typescript
// ✅ ÚTIL - explica comportamento
<TouchableOpacity
  accessibilityLabel="Cancelar consulta"
  accessibilityHint="Cancela a consulta agendada para amanhã às 14h"
  onPress={handleCancel}
/>

// ❌ DESNECESSÁRIO - ação óbvia
<TouchableOpacity
  accessibilityLabel="Salvar"
  accessibilityHint="Salva os dados" // Redundante
  onPress={handleSave}
/>
```

---

## Roles e Estados

### accessibilityRole

Define o papel semântico do elemento:

```typescript
// Botão
<TouchableOpacity
  accessibilityRole="button"
  onPress={handlePress}
>
  <Text>Clique aqui</Text>
</TouchableOpacity>

// Link
<TouchableOpacity
  accessibilityRole="link"
  onPress={() => Linking.openURL(url)}
>
  <Text>Visite nosso site</Text>
</TouchableOpacity>

// Header
<Text
  accessibilityRole="header"
  style={styles.title}
>
  Título da Tela
</Text>

// Texto
<Text accessibilityRole="text">
  Conteúdo de texto
</Text>
```

### Roles Comuns

| Role        | Uso                                    |
| ----------- | -------------------------------------- |
| `button`    | Elementos clicáveis que executam ações |
| `link`      | Links para navegação ou URLs externas  |
| `header`    | Títulos e cabeçalhos                   |
| `text`      | Texto estático                         |
| `image`     | Imagens (use com accessibilityLabel)   |
| `searchbox` | Campos de busca                        |
| `textbox`   | Campos de entrada de texto             |

### Estados

```typescript
// Desabilitado
<TouchableOpacity
  accessibilityRole="button"
  accessibilityState={{ disabled: true }}
  disabled={true}
>
  <Text>Botão Desabilitado</Text>
</TouchableOpacity>

// Selecionado
<TouchableOpacity
  accessibilityRole="button"
  accessibilityState={{ selected: isSelected }}
  onPress={handleToggle}
>
  <Text>Item</Text>
</TouchableOpacity>

// Expandido/Colapsado
<View
  accessibilityRole="button"
  accessibilityState={{ expanded: isExpanded }}
>
  <Text>Menu</Text>
</View>
```

---

## Contraste e Cores

### Requisitos de Contraste (WCAG AA)

- **Texto normal** (menor que 18px): Contraste mínimo de 4.5:1
- **Texto grande** (18px ou maior): Contraste mínimo de 3:1
- **Elementos não textuais** (ícones, bordas): Contraste mínimo de 3:1

### Cores do Tema

O design system já segue os requisitos:

```typescript
// ✅ CORRETO - contraste adequado
color: theme.colors.text; // #212121 sobre #FFFFFF = 12.6:1
color: theme.colors.textSecondary; // #757575 sobre #FFFFFF = 4.5:1

// ❌ ERRADO - contraste insuficiente
color: '#CCCCCC'; // Contraste muito baixo
```

### Não Dependa Apenas de Cores

Sempre combine cor com texto ou ícone:

```typescript
// ✅ CORRETO
<View style={styles.errorContainer}>
  <Text style={styles.errorText}>❌ Erro: {message}</Text>
</View>

// ❌ ERRADO - apenas cor
<View style={{ backgroundColor: 'red' }}>
  <Text>{message}</Text>
</View>
```

---

## Tamanhos de Toque

### Área Mínima

Elementos interativos devem ter área de toque mínima de **44x44 pixels**:

```typescript
// ✅ CORRETO
const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    padding: theme.spacing.md,
  },
});

// ❌ ERRADO - muito pequeno
const styles = StyleSheet.create({
  button: {
    height: 30,
    width: 30,
  },
});
```

### Espaçamento entre Elementos

Mínimo de **8px** entre elementos clicáveis:

```typescript
// ✅ CORRETO
const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm, // 8px
  },
});
```

### Componentes que Já Seguem

- **Button**: Altura mínima de 50px ✅
- **Input**: Altura de 50px ✅
- **Card clicável**: Área de toque adequada ✅

---

## Navegação por Teclado

### Ordem de Foco

Elementos devem ser focáveis na ordem lógica:

```typescript
// ✅ CORRETO - ordem lógica
<Input
  label="Nome"
  value={nome}
  onChangeText={setNome}
/>
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
/>
<Button
  title="Salvar"
  onPress={handleSave}
/>
```

### Pular Elementos Não Interativos

Elementos decorativos não devem receber foco:

```typescript
// ✅ CORRETO - não focável
<View
  accessibilityElementsHidden={true}
  importantForAccessibility="no-hide-descendants"
>
  <Image source={decorativeImage} />
</View>
```

---

## Testes de Acessibilidade

### Teste Manual com TalkBack (Android)

1. Ative TalkBack nas configurações
2. Navegue pelo app usando gestos
3. Verifique se todos os elementos são anunciados corretamente
4. Teste todas as ações principais

### Teste Manual com VoiceOver (iOS)

1. Ative VoiceOver nas configurações
2. Navegue pelo app usando gestos
3. Verifique se todos os elementos são anunciados corretamente
4. Teste todas as ações principais

### Checklist de Teste

- [ ] Todos os botões têm labels descritivos
- [ ] Todos os inputs têm labels
- [ ] Mensagens de erro são anunciadas
- [ ] Estados de loading são comunicados
- [ ] Navegação é clara e lógica
- [ ] Contraste de cores é adequado
- [ ] Áreas de toque são grandes o suficiente
- [ ] Elementos decorativos não recebem foco

---

## Checklist

### Para Cada Componente

- [ ] Tem `accessibilityLabel` se for interativo
- [ ] Tem `accessibilityRole` apropriado
- [ ] Tem `accessibilityHint` se necessário
- [ ] Área de toque mínima de 44x44px
- [ ] Contraste de cores adequado
- [ ] Estados são comunicados (disabled, selected, etc.)

### Para Cada Tela

- [ ] Título da tela tem `accessibilityRole="header"`
- [ ] Formulários têm labels em todos os campos
- [ ] Mensagens de erro são acessíveis
- [ ] Botões têm labels descritivos
- [ ] Navegação é clara
- [ ] Estados vazios são comunicados

### Para o App Completo

- [ ] Testado com TalkBack (Android)
- [ ] Testado com VoiceOver (iOS)
- [ ] Contraste de todas as cores verificado
- [ ] Todas as funcionalidades são acessíveis
- [ ] Documentação de acessibilidade atualizada

---

## Exemplos Práticos

### Botão Acessível

```typescript
<Button
  title="Agendar Consulta"
  onPress={handleSchedule}
  accessibilityLabel="Agendar consulta médica"
  accessibilityHint="Toque duas vezes para abrir a tela de agendamento"
  accessibilityRole="button"
/>
```

### Input Acessível

```typescript
<Input
  label="CPF"
  value={cpf}
  onChangeText={setCpf}
  error={cpfError}
  accessibilityLabel="Campo CPF"
  accessibilityHint="Digite seu CPF no formato 000.000.000-00"
/>
```

### Card Clicável Acessível

```typescript
<Card
  onPress={handlePress}
  accessibilityRole="button"
  accessibilityLabel="Consulta do dia 20/12/2024 às 14h"
  accessibilityHint="Toque duas vezes para ver detalhes da consulta"
>
  <Text>Consulta</Text>
</Card>
```

### Lista Acessível

```typescript
{items.map((item, index) => (
  <Card
    key={item.id}
    onPress={() => handleItemPress(item)}
    accessibilityRole="button"
    accessibilityLabel={`${item.title}, item ${index + 1} de ${items.length}`}
    accessibilityHint="Toque duas vezes para ver detalhes"
  >
    <Text>{item.title}</Text>
  </Card>
))}
```

---

## Recursos Adicionais

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [Material Design Accessibility](https://material.io/design/usability/accessibility.html)

---

**Última atualização**: 2025-12-06
**Versão**: 1.0.0
