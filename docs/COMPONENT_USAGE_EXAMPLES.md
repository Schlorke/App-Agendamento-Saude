# Exemplos de Uso de Componentes

Este documento fornece exemplos práticos e completos de como usar cada componente do design system em situações reais.

## Índice

1. [Exemplos Básicos](#exemplos-básicos)
2. [Padrões de Composição](#padrões-de-composição)
3. [Casos de Uso Comuns](#casos-de-uso-comuns)
4. [Anti-padrões](#anti-padrões)

---

## Exemplos Básicos

### Button

#### Botão Primário Simples

```typescript
import Button from '../components/Button';

<Button
  title="Salvar"
  onPress={handleSave}
/>
```

#### Botão com Loading

```typescript
const [saving, setSaving] = useState(false);

const handleSave = async () => {
  setSaving(true);
  try {
    await saveData();
  } finally {
    setSaving(false);
  }
};

<Button
  title="Salvar"
  onPress={handleSave}
  loading={saving}
  disabled={saving}
/>
```

#### Botão Secundário

```typescript
<Button
  title="Cancelar"
  onPress={handleCancel}
  variant="secondary"
/>
```

#### Botão Outline

```typescript
<Button
  title="Ver Mais"
  onPress={handleSeeMore}
  variant="outline"
/>
```

#### Botão Full Width

```typescript
<Button
  title="Continuar"
  onPress={handleContinue}
  fullWidth
/>
```

---

### Input

#### Input Básico

```typescript
import Input from '../components/Input';

const [email, setEmail] = useState('');

<Input
  label="Email"
  placeholder="seu@email.com"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
/>
```

#### Input com Validação

```typescript
const [cpf, setCpf] = useState('');
const [cpfError, setCpfError] = useState('');

const handleCpfChange = (text: string) => {
  setCpf(text);
  if (text.length === 11 && !isValidCPF(text)) {
    setCpfError('CPF inválido');
  } else {
    setCpfError('');
  }
};

<Input
  label="CPF"
  placeholder="000.000.000-00"
  value={cpf}
  onChangeText={handleCpfChange}
  error={cpfError}
  keyboardType="numeric"
  maxLength={14}
/>
```

#### Input de Senha

```typescript
const [senha, setSenha] = useState('');
const [showPassword, setShowPassword] = useState(false);

<Input
  label="Senha"
  placeholder="Digite sua senha"
  value={senha}
  onChangeText={setSenha}
  secureTextEntry={!showPassword}
/>
```

---

### Card

#### Card Simples

```typescript
import Card from '../components/Card';

<Card>
  <Text style={styles.title}>Título do Card</Text>
  <Text style={styles.content}>Conteúdo do card aqui</Text>
</Card>
```

#### Card Clicável

```typescript
<Card
  onPress={() => navigation.navigate('Detail', { id: item.id })}
>
  <Text style={styles.title}>{item.title}</Text>
  <Text style={styles.description}>{item.description}</Text>
</Card>
```

#### Card com Variante

```typescript
// Card com borda
<Card variant="outlined">
  <Text>Conteúdo</Text>
</Card>

// Card sem sombra
<Card variant="flat">
  <Text>Conteúdo</Text>
</Card>
```

---

### Badge

#### Badge de Status

```typescript
import Badge from '../components/Badge';

<Badge text="Agendada" variant="primary" />

<Badge text="Realizada" variant="success" />

<Badge text="Cancelada" variant="error" />
```

#### Badge em Card

```typescript
<Card>
  <View style={styles.header}>
    <Text style={styles.title}>Consulta</Text>
    <Badge text={consulta.status} variant={getStatusVariant(consulta.status)} />
  </View>
</Card>
```

---

### EmptyState

#### EmptyState Simples

```typescript
import EmptyState from '../components/EmptyState';

<EmptyState
  icon="📋"
  title="Nenhuma consulta encontrada"
  description="Você ainda não possui consultas agendadas."
/>
```

#### EmptyState com Ação

```typescript
<EmptyState
  icon="📅"
  title="Nenhuma consulta agendada"
  description="Agende sua primeira consulta para começar."
  action={
    <Button
      title="Agendar Consulta"
      onPress={() => navigation.navigate('Schedule')}
      fullWidth
    />
  }
/>
```

---

### Modal

#### Modal de Confirmação

```typescript
import Modal from '../components/Modal';

const [showModal, setShowModal] = useState(false);

<Modal
  visible={showModal}
  variant="confirm"
  title="Confirmar Ação"
  message="Tem certeza que deseja continuar?"
  primaryAction={{
    label: 'Sim',
    onPress: () => {
      handleConfirm();
      setShowModal(false);
    },
  }}
  secondaryAction={{
    label: 'Não',
    onPress: () => setShowModal(false),
  }}
  onClose={() => setShowModal(false)}
/>
```

#### Modal de Alerta

```typescript
<Modal
  visible={showErrorModal}
  variant="alert"
  title="Erro"
  message="Não foi possível completar a operação. Tente novamente."
  primaryAction={{
    label: 'OK',
    onPress: () => setShowErrorModal(false),
  }}
  onClose={() => setShowErrorModal(false)}
/>
```

---

### Toast

#### Toast de Sucesso

```typescript
import Toast from '../components/Toast';

const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState('');
const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

const handleSuccess = () => {
  setToastMessage('Operação realizada com sucesso!');
  setToastType('success');
  setShowToast(true);
};

<Toast
  visible={showToast}
  type={toastType}
  message={toastMessage}
  position="top"
  duration={3000}
  onDismiss={() => setShowToast(false)}
/>
```

---

### Skeleton

#### Skeleton de Lista

```typescript
import Skeleton from '../components/Skeleton';

{loading ? (
  <>
    <Skeleton variant="listItem" />
    <Skeleton variant="listItem" />
    <Skeleton variant="listItem" />
  </>
) : (
  items.map(item => (
    <Card key={item.id}>
      <Text>{item.title}</Text>
    </Card>
  ))
)}
```

---

## Padrões de Composição

### Formulário Completo

```typescript
import { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { theme } from '../styles/theme';

const FormScreen = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nomeError, setNomeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Limpar erros
    setNomeError('');
    setEmailError('');

    // Validações
    if (!nome) {
      setNomeError('Nome é obrigatório');
      return;
    }

    if (!email || !isValidEmail(email)) {
      setEmailError('Email inválido');
      return;
    }

    setLoading(true);
    try {
      await submitForm({ nome, email, telefone });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Input
          label="Nome *"
          value={nome}
          onChangeText={setNome}
          error={nomeError}
          placeholder="Digite seu nome"
        />

        <Input
          label="Email *"
          value={email}
          onChangeText={setEmail}
          error={emailError}
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          placeholder="(00) 00000-0000"
          keyboardType="phone-pad"
        />

        <Button
          title="Salvar"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          fullWidth
          style={styles.submitButton}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    margin: theme.spacing.lg,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
});
```

### Lista com Empty State e Loading

```typescript
import { useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';
import Loading from '../components/Loading';
import Button from '../components/Button';

const ListScreen = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await fetchItems();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Skeleton variant="listItem" />
        <Skeleton variant="listItem" />
        <Skeleton variant="listItem" />
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="Nenhum item encontrado"
        description="Adicione itens para começar."
        action={
          <Button
            title="Adicionar Item"
            onPress={() => navigation.navigate('AddItem')}
            fullWidth
          />
        }
      />
    );
  }

  return (
    <ScrollView>
      {items.map(item => (
        <Card key={item.id} style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </Card>
      ))}
    </ScrollView>
  );
};
```

### Card com Badge e Ações

```typescript
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { View, Text, StyleSheet } from 'react-native';

const ConsultaCard = ({ consulta, onCancel }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'agendada': return 'primary';
      case 'realizada': return 'success';
      case 'cancelada': return 'error';
      default: return 'neutral';
    }
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.data}>
            {formatDate(consulta.data)} às {consulta.horario}
          </Text>
          <Text style={styles.profissional}>{consulta.profissional}</Text>
        </View>
        <Badge
          text={consulta.status}
          variant={getStatusVariant(consulta.status)}
        />
      </View>

      {consulta.status === 'agendada' && (
        <Button
          title="Cancelar"
          onPress={() => onCancel(consulta.id)}
          variant="outline"
          style={styles.cancelButton}
        />
      )}
    </Card>
  );
};
```

---

## Casos de Uso Comuns

### Tela de Login

```typescript
import { useState } from 'react';
import { ScrollView, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { theme } from '../styles/theme';

const LoginScreen = () => {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setCpfError('');
    setSenhaError('');

    if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
      setCpfError('CPF deve ter 11 dígitos');
      return;
    }

    if (!senha) {
      setSenhaError('Senha é obrigatória');
      return;
    }

    setLoading(true);
    try {
      await login(cpf, senha);
    } catch (error) {
      setSenhaError('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Input
          label="CPF"
          placeholder="000.000.000-00"
          value={cpf}
          onChangeText={setCpf}
          error={cpfError}
          keyboardType="numeric"
          maxLength={14}
        />

        <Input
          label="Senha"
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          error={senhaError}
          secureTextEntry
        />

        <Button
          title="Entrar"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          fullWidth
          style={styles.loginButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
```

### Tela com Filtros

```typescript
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Card from '../components/Card';
import { theme } from '../styles/theme';

const FilteredListScreen = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            Todas
          </Text>
        </TouchableOpacity>
        {/* Mais filtros */}
      </View>

      <ScrollView>
        {filteredItems.map(item => (
          <Card key={item.id}>
            <Text>{item.title}</Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};
```

---

## Anti-padrões

### ❌ Não Faça: Botão sem Loading State

```typescript
// ❌ ERRADO
<Button
  title="Salvar"
  onPress={async () => {
    await saveData(); // Usuário não sabe que está processando
  }}
/>

// ✅ CORRETO
const [saving, setSaving] = useState(false);

<Button
  title="Salvar"
  onPress={async () => {
    setSaving(true);
    try {
      await saveData();
    } finally {
      setSaving(false);
    }
  }}
  loading={saving}
/>
```

### ❌ Não Faça: Input sem Validação Visual

```typescript
// ❌ ERRADO
<Input
  value={email}
  onChangeText={setEmail}
  // Sem validação visual
/>

// ✅ CORRETO
<Input
  value={email}
  onChangeText={setEmail}
  error={emailError}
/>
```

### ❌ Não Faça: Card Clicável com Botões Internos

```typescript
// ❌ ERRADO - conflito de eventos
<Card onPress={handleCardPress}>
  <Button title="Ação" onPress={handleAction} />
</Card>

// ✅ CORRETO - escolha uma abordagem
<Card onPress={handleCardPress}>
  <Text>Conteúdo</Text>
</Card>

// OU

<Card>
  <Text>Conteúdo</Text>
  <Button title="Ação" onPress={handleAction} />
</Card>
```

### ❌ Não Faça: Múltiplos Toasts Simultâneos

```typescript
// ❌ ERRADO
<Toast visible={showToast1} message="Mensagem 1" />
<Toast visible={showToast2} message="Mensagem 2" />

// ✅ CORRETO - gerenciar estado globalmente
const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

<Toast
  visible={toast.visible}
  message={toast.message}
  type={toast.type}
  onDismiss={() => setToast({ ...toast, visible: false })}
/>
```

---

**Última atualização**: 2025-12-06
**Versão**: 1.0.0
