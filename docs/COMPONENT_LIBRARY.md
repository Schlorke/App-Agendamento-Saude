# Component Library

Esta documentação descreve todos os componentes disponíveis no design system, quando usá-los, suas variantes e exemplos de código.

## Índice

1. [Button](#button)
2. [Input](#input)
3. [Card](#card)
4. [Loading](#loading)
5. [Badge](#badge)
6. [EmptyState](#emptystate)
7. [Header](#header)
8. [Modal](#modal)
9. [Toast](#toast)
10. [Skeleton](#skeleton)

---

## Button

Componente de botão reutilizável com suporte a múltiplas variantes, estados de loading e animações.

### Button - Quando Usar

- Ações principais e secundárias
- Confirmações de formulários
- Navegação entre telas
- Qualquer ação que requer interação do usuário

### Button - Variantes

- **primary**: Botão principal com fundo verde saúde (padrão)
- **secondary**: Botão secundário com fundo azul
- **outline**: Botão com borda e fundo transparente

### Button - Estados

- **default**: Estado normal
- **pressed**: Animação de scale ao pressionar
- **disabled**: Opacidade reduzida, interação desabilitada
- **loading**: Exibe ActivityIndicator no lugar do texto

### Button - Exemplo de Uso

```typescript
import Button from '../components/Button';

// Botão primário
<Button
  title="Salvar"
  onPress={handleSave}
  variant="primary"
/>

// Botão com loading
<Button
  title="Carregando..."
  onPress={handleAction}
  loading={true}
/>

// Botão outline
<Button
  title="Cancelar"
  onPress={handleCancel}
  variant="outline"
  fullWidth
/>
```

### Button - Props

| Prop                 | Tipo                                    | Padrão      | Descrição                                  |
| -------------------- | --------------------------------------- | ----------- | ------------------------------------------ |
| `title`              | `string`                                | -           | Texto exibido no botão (obrigatório)       |
| `onPress`            | `() => void`                            | -           | Função chamada ao pressionar (obrigatório) |
| `variant`            | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | Variante visual                            |
| `disabled`           | `boolean`                               | `false`     | Desabilita interação                       |
| `loading`            | `boolean`                               | `false`     | Exibe indicador de loading                 |
| `fullWidth`          | `boolean`                               | `false`     | Ocupa 100% da largura                      |
| `style`              | `ViewStyle`                             | -           | Estilos customizados                       |
| `textStyle`          | `TextStyle`                             | -           | Estilos customizados do texto              |
| `accessibilityLabel` | `string`                                | -           | Label de acessibilidade                    |
| `accessibilityHint`  | `string`                                | -           | Hint de acessibilidade                     |

---

## Input

Componente de input com suporte a label, validação de erros e animação de foco.

### Input - Quando Usar

- Campos de formulário
- Entrada de texto do usuário
- Validação de dados

### Input - Estados

- **default**: Borda cinza
- **focused**: Borda verde com animação suave
- **error**: Borda vermelha com mensagem de erro

### Input - Exemplo de Uso

```typescript
import Input from '../components/Input';

// Input básico
<Input
  label="CPF"
  placeholder="000.000.000-00"
  value={cpf}
  onChangeText={setCpf}
/>

// Input com erro
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  error="Email inválido"
/>
```

### Input - Props

| Prop                | Tipo        | Padrão | Descrição                                   |
| ------------------- | ----------- | ------ | ------------------------------------------- |
| `label`             | `string`    | -      | Label acima do input                        |
| `error`             | `string`    | -      | Mensagem de erro                            |
| `containerStyle`    | `ViewStyle` | -      | Estilos do container                        |
| `...TextInputProps` | -           | -      | Todas as props do TextInput do React Native |

---

## Card

Componente de card reutilizável com variantes e suporte a animação quando clicável.

### Card - Quando Usar

- Agrupar conteúdo relacionado
- Exibir informações em containers elevados
- Criar listas de itens

### Card - Variantes

- **elevated**: Card com sombra (padrão)
- **outlined**: Card com apenas borda
- **flat**: Card sem sombra nem borda

### Card - Exemplo de Uso

```typescript
import Card from '../components/Card';

// Card simples
<Card>
  <Text>Título</Text>
  <Text>Conteúdo do card</Text>
</Card>

// Card clicável
<Card
  variant="elevated"
  onPress={() => navigation.navigate('Detail')}
>
  <Text>Card clicável</Text>
</Card>
```

### Card - Props

| Prop       | Tipo                                 | Padrão       | Descrição                      |
| ---------- | ------------------------------------ | ------------ | ------------------------------ |
| `children` | `React.ReactNode`                    | -            | Conteúdo do card (obrigatório) |
| `variant`  | `'elevated' \| 'outlined' \| 'flat'` | `'elevated'` | Variante visual                |
| `onPress`  | `() => void`                         | -            | Torna o card clicável          |
| `disabled` | `boolean`                            | `false`      | Desabilita interação           |
| `style`    | `ViewStyle`                          | -            | Estilos customizados           |

---

## Loading

Componente de loading com ActivityIndicator e mensagem opcional.

### Loading - Quando Usar

- Estados de carregamento
- Operações assíncronas
- Feedback de processamento

### Loading - Exemplo de Uso

```typescript
import Loading from '../components/Loading';

// Loading básico
<Loading />

// Loading com mensagem
<Loading message="Carregando dados..." size="large" />
```

### Loading - Props

| Prop      | Tipo                 | Padrão            | Descrição            |
| --------- | -------------------- | ----------------- | -------------------- |
| `message` | `string`             | `'Carregando...'` | Mensagem exibida     |
| `size`    | `'small' \| 'large'` | `'large'`         | Tamanho do indicador |

---

## Badge

Componente de badge para status, tags ou contadores.

### Badge - Quando Usar

- Indicar status (agendada, realizada, cancelada)
- Exibir tags ou categorias
- Mostrar contadores

### Badge - Variantes

- **primary**: Verde saúde (padrão)
- **success**: Verde de sucesso
- **error**: Vermelho de erro
- **warning**: Laranja de aviso
- **neutral**: Cinza neutro

### Badge - Tamanhos

- **small**: Pequeno (caption)
- **medium**: Médio (bodySmall) - padrão
- **large**: Grande (body)

### Badge - Exemplo de Uso

```typescript
import Badge from '../components/Badge';

// Badge de status
<Badge text="Agendada" variant="primary" />

// Badge de erro
<Badge text="Cancelada" variant="error" size="small" />
```

### Badge - Props

| Prop        | Tipo                                                          | Padrão      | Descrição                    |
| ----------- | ------------------------------------------------------------- | ----------- | ---------------------------- |
| `text`      | `string`                                                      | -           | Texto do badge (obrigatório) |
| `variant`   | `'primary' \| 'success' \| 'error' \| 'warning' \| 'neutral'` | `'primary'` | Variante visual              |
| `size`      | `'small' \| 'medium' \| 'large'`                              | `'medium'`  | Tamanho do badge             |
| `style`     | `ViewStyle`                                                   | -           | Estilos customizados         |
| `textStyle` | `TextStyle`                                                   | -           | Estilos do texto             |

---

## EmptyState

Componente padronizado para estados vazios.

### EmptyState - Quando Usar

- Listas vazias
- Seções sem conteúdo
- Resultados de busca vazios

### EmptyState - Exemplo de Uso

```typescript
import EmptyState from '../components/EmptyState';

<EmptyState
  icon="📋"
  title="Nenhuma consulta encontrada"
  description="Você ainda não possui consultas agendadas."
  action={
    <Button
      title="Agendar Consulta"
      onPress={() => navigation.navigate('Schedule')}
    />
  }
/>
```

### EmptyState - Props

| Prop          | Tipo              | Padrão | Descrição                  |
| ------------- | ----------------- | ------ | -------------------------- |
| `icon`        | `string`          | -      | Emoji ou texto do ícone    |
| `title`       | `string`          | -      | Título (obrigatório)       |
| `description` | `string`          | -      | Descrição adicional        |
| `action`      | `React.ReactNode` | -      | Componente de ação (botão) |
| `style`       | `ViewStyle`       | -      | Estilos customizados       |

---

## Header

Componente de header consistente para telas.

### Header - Quando Usar

- Headers de telas principais
- Navegação com botão de voltar
- Telas que precisam de ações no header

### Header - Exemplo de Uso

```typescript
import Header from '../components/Header';

<Header
  title="Agendar Consulta"
  subtitle="Selecione especialidade e profissional"
  showBackButton
  onBack={() => navigation.goBack()}
  actions={
    <Button
      title="Ajuda"
      onPress={handleHelp}
      variant="outline"
    />
  }
/>
```

### Header - Props

| Prop             | Tipo              | Padrão  | Descrição                      |
| ---------------- | ----------------- | ------- | ------------------------------ |
| `title`          | `string`          | -       | Título do header (obrigatório) |
| `subtitle`       | `string`          | -       | Subtítulo opcional             |
| `actions`        | `React.ReactNode` | -       | Componentes de ação à direita  |
| `showBackButton` | `boolean`         | `false` | Exibe botão de voltar          |
| `onBack`         | `() => void`      | -       | Função ao pressionar voltar    |
| `style`          | `ViewStyle`       | -       | Estilos customizados           |

---

## Modal

Componente de modal com animações e variantes.

### Modal - Quando Usar

- Confirmações importantes
- Alertas
- Informações que requerem atenção

### Modal - Variantes

- **alert**: Borda vermelha (erros)
- **confirm**: Borda verde (confirmações)
- **info**: Borda verde saúde (informações) - padrão

### Modal - Exemplo de Uso

```typescript
import Modal from '../components/Modal';

<Modal
  visible={showModal}
  variant="confirm"
  title="Confirmar Cancelamento"
  message="Tem certeza que deseja cancelar esta consulta?"
  primaryAction={{
    label: 'Sim, cancelar',
    onPress: handleCancel,
  }}
  secondaryAction={{
    label: 'Não',
    onPress: () => setShowModal(false),
  }}
  onClose={() => setShowModal(false)}
/>
```

### Modal - Props

| Prop              | Tipo                                     | Padrão   | Descrição                           |
| ----------------- | ---------------------------------------- | -------- | ----------------------------------- |
| `visible`         | `boolean`                                | -        | Controla visibilidade (obrigatório) |
| `variant`         | `'alert' \| 'confirm' \| 'info'`         | `'info'` | Variante visual                     |
| `title`           | `string`                                 | -        | Título do modal (obrigatório)       |
| `message`         | `string`                                 | -        | Mensagem (obrigatório)              |
| `primaryAction`   | `{ label: string, onPress: () => void }` | -        | Ação primária (obrigatório)         |
| `secondaryAction` | `{ label: string, onPress: () => void }` | -        | Ação secundária opcional            |
| `onClose`         | `() => void`                             | -        | Função ao fechar                    |
| `style`           | `ViewStyle`                              | -        | Estilos customizados                |

---

## Toast

Sistema de notificações toast para feedback temporário.

### Toast - Quando Usar

- Feedback de ações (sucesso, erro)
- Notificações não bloqueantes
- Mensagens temporárias

### Toast - Tipos

- **success**: Verde (sucesso)
- **error**: Vermelho (erro)
- **warning**: Laranja (aviso)
- **info**: Verde saúde (informação) - padrão

### Toast - Posições

- **top**: Topo da tela (padrão)
- **bottom**: Parte inferior
- **center**: Centro da tela

### Toast - Exemplo de Uso

```typescript
import Toast from '../components/Toast';

<Toast
  visible={showToast}
  type="success"
  message="Consulta agendada com sucesso!"
  position="top"
  duration={3000}
  onDismiss={() => setShowToast(false)}
/>
```

### Toast - Props

| Prop        | Tipo                                          | Padrão   | Descrição                            |
| ----------- | --------------------------------------------- | -------- | ------------------------------------ |
| `visible`   | `boolean`                                     | -        | Controla visibilidade (obrigatório)  |
| `type`      | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Tipo visual                          |
| `message`   | `string`                                      | -        | Mensagem (obrigatório)               |
| `position`  | `'top' \| 'bottom' \| 'center'`               | `'top'`  | Posição na tela                      |
| `duration`  | `number`                                      | `3000`   | Duração em ms (0 = não auto-dismiss) |
| `onDismiss` | `() => void`                                  | -        | Função ao fechar                     |
| `style`     | `ViewStyle`                                   | -        | Estilos customizados                 |

---

## Skeleton

Componente de skeleton loading para placeholders.

### Skeleton - Quando Usar

- Placeholders durante carregamento
- Feedback visual de conteúdo que está carregando
- Melhorar percepção de performance

### Skeleton - Variantes

- **text**: Linha de texto (padrão)
- **card**: Card completo
- **listItem**: Item de lista

### Skeleton - Exemplo de Uso

```typescript
import Skeleton from '../components/Skeleton';

// Skeleton de texto
<Skeleton variant="text" width="80%" />

// Skeleton de card
<Skeleton variant="card" height={200} />

// Múltiplos skeletons
{loading ? (
  <>
    <Skeleton variant="listItem" />
    <Skeleton variant="listItem" />
    <Skeleton variant="listItem" />
  </>
) : (
  <Content />
)}
```

### Skeleton - Props

| Prop      | Tipo                             | Padrão   | Descrição                  |
| --------- | -------------------------------- | -------- | -------------------------- |
| `variant` | `'text' \| 'card' \| 'listItem'` | `'text'` | Variante visual            |
| `width`   | `number \| string`               | `'100%'` | Largura                    |
| `height`  | `number`                         | -        | Altura (varia por variant) |
| `style`   | `ViewStyle`                      | -        | Estilos customizados       |

---

## Padrões de Composição

### Formulário Completo

```typescript
<Card>
  <Input
    label="Nome"
    value={nome}
    onChangeText={setNome}
    error={nomeError}
  />
  <Input
    label="Email"
    value={email}
    onChangeText={setEmail}
    error={emailError}
    keyboardType="email-address"
  />
  <Button
    title="Salvar"
    onPress={handleSave}
    loading={loading}
    fullWidth
  />
</Card>
```

### Lista com Empty State

```typescript
{items.length === 0 ? (
  <EmptyState
    icon="📋"
    title="Nenhum item encontrado"
    description="Adicione itens para começar."
  />
) : (
  items.map(item => (
    <Card key={item.id}>
      <Text>{item.name}</Text>
    </Card>
  ))
)}
```

### Card com Badge

```typescript
<Card>
  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    <Text>Título</Text>
    <Badge text="Ativo" variant="success" />
  </View>
</Card>
```

---

**Última atualização**: 2025-12-06
**Versão**: 1.0.0
