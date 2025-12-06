# Contexto para Inteligência Artificial

Este documento fornece contexto específico para IAs entenderem o projeto, suas convenções, padrões e como implementar novos recursos seguindo a identidade visual e arquitetura do projeto.

## Índice

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Arquitetura e Padrões](#arquitetura-e-padrões)
3. [Design System e Identidade Visual](#design-system-e-identidade-visual)
4. [Como Implementar Novos Componentes](#como-implementar-novos-componentes)
5. [Como Implementar Novas Telas](#como-implementar-novas-telas)
6. [Regras de Implementação](#regras-de-implementação)
7. [Interpretação do Design System](#interpretação-do-design-system)

---

## Visão Geral do Projeto

### Propósito

Aplicativo de agendamento de consultas em saúde desenvolvido com React Native, Expo e TypeScript.

### Arquitetura

- **Padrão**: MVVM (Model-View-ViewModel)
- **View**: Telas e componentes (apenas apresentação)
- **ViewModel**: Lógica de apresentação e estado da UI
- **Model**: Services com lógica de negócio e acesso a dados

### Regra de Ouro da Arquitetura

A regra fundamental é: **View → ViewModel → Service**

Nunca View → Service diretamente.

---

## Arquitetura e Padrões

### Estrutura de Pastas

```
src/
  components/     # Componentes reutilizáveis
  screens/        # Telas (Views)
    App/          # Telas autenticadas
    Auth/         # Telas de autenticação
  viewmodels/     # ViewModels (lógica de apresentação)
  services/       # Services (lógica de negócio)
  styles/         # Tema e estilos
  utils/          # Utilitários
  hooks/          # Hooks customizados
  navigation/     # Configuração de navegação
```

### Convenções de Código

1. **Nomenclatura**:
   - Componentes: PascalCase (`Button.tsx`)
   - Funções/Variáveis: camelCase (`handleLogin`)
   - Constantes: UPPER_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)

2. **Imports**:

   ```typescript
   // 1. Bibliotecas externas
   import React from 'react';
   import { View, Text } from 'react-native';

   // 2. Bibliotecas de terceiros
   import { useNavigation } from '@react-navigation/native';

   // 3. Imports internos
   import Button from '../components/Button';
   import { theme } from '../styles/theme';

   // 4. Tipos (no final)
   import type { AppScreenProps } from '../navigation/types';
   ```

3. **Documentação JSDoc**:
   Todo componente DEVE ter bloco JSDoc no cabeçalho:

   ```typescript
   /**
    * @component NomeDoComponente
    * @description Descrição do propósito
    * @props ...
    * @state ...
    * @known_issues ...
    * @changelog ...
    */
   ```

---

## Design System e Identidade Visual

### Cores Principais

- **Verde Saúde** (`#2E7D32`): Cor primária, representa saúde e bem-estar
- **Azul** (`#1976D2`): Cor secundária, ações secundárias
- **Fundo** (`#F5F5F5`): Background geral
- **Superfície** (`#FFFFFF`): Cards, inputs
- **Texto** (`#212121`): Texto principal
- **Texto Secundário** (`#757575`): Textos de apoio

### Espaçamento no Tema

Sempre use o tema para espaçamento:

```typescript
// ✅ CORRETO
padding: theme.spacing.lg; // 24px
marginBottom: theme.spacing.md; // 16px
gap: theme.spacing.sm; // 8px

// ❌ ERRADO
padding: 24;
marginBottom: 16;
```

### Tipografia

Use sempre o tema:

```typescript
// ✅ CORRETO
...theme.typography.h1  // Título principal
...theme.typography.body  // Texto normal
...theme.typography.caption  // Texto pequeno

// ❌ ERRADO
fontSize: 16
fontWeight: 'bold'
```

### Componentes Disponíveis

Consulte `docs/COMPONENT_LIBRARY.md` para lista completa e exemplos.

**Componentes Base**:

- `Button`: Botões com variantes (primary, secondary, outline)
- `Input`: Inputs com label, erro e animação de foco
- `Card`: Cards com variantes (elevated, outlined, flat)
- `Loading`: Indicador de carregamento

**Componentes Avançados**:

- `Badge`: Status, tags, contadores
- `EmptyState`: Estados vazios
- `Header`: Headers de tela
- `Modal`: Modais de confirmação/alerta
- `Toast`: Notificações temporárias
- `Skeleton`: Placeholders de loading

---

## Como Implementar Novos Componentes

### Passo a Passo - Criar Componente

1. **Criar arquivo** em `src/components/NomeDoComponente.tsx`

2. **Estrutura básica**:

   ```typescript
   /**
    * @component NomeDoComponente
    * @description [Descrição clara do propósito]
    * @props
    *   - `prop1`: {tipo} - [Descrição]
    * @state
    *   - [Estados internos se houver]
    * @known_issues
    *   - Nenhum problema conhecido.
    * @changelog
    *   - YYYY-MM-DD - IA - Criação inicial.
    */

   import React from 'react';
   import { View, Text, StyleSheet } from 'react-native';
   import { theme } from '../styles/theme';

   export interface NomeDoComponenteProps {
     // Props aqui
   }

   const NomeDoComponente: React.FC<NomeDoComponenteProps> = (props) => {
     return (
       <View style={styles.container}>
         {/* Conteúdo */}
       </View>
     );
   };

   const styles = StyleSheet.create({
     container: {
       // Use sempre theme
       padding: theme.spacing.lg,
       backgroundColor: theme.colors.surface,
     },
   });

   export default NomeDoComponente;
   ```

3. **Regras obrigatórias**:
   - ✅ Usar tema para cores, espaçamento, tipografia
   - ✅ Adicionar documentação JSDoc completa
   - ✅ Implementar acessibilidade (accessibilityLabel, accessibilityRole)
   - ✅ Seguir convenções de nomenclatura
   - ✅ Usar TypeScript com tipos explícitos

4. **Animações** (se necessário):

   ```typescript
   import { fadeIn, scalePress } from '../utils/animations';
   // Usar funções do animations.ts
   ```

---

## Como Implementar Novas Telas

### Passo a Passo - Criar Tela

1. **Criar arquivo** em `src/screens/App/NomeDaTela.tsx` ou `src/screens/Auth/NomeDaTela.tsx`

2. **Estrutura básica**:

   ```typescript
   /**
    * @component NomeDaTela
    * @description [Descrição da tela]
    * @props
    *   - `navigation`: {AppScreenProps<'NomeDaTela'>} - Navegação
    * @state
    *   - [Estados da tela]
    * @known_issues
    *   - Nenhum problema conhecido.
    * @changelog
    *   - YYYY-MM-DD - IA - Criação inicial.
    */

   import React, { useState } from 'react';
   import { View, Text, StyleSheet, ScrollView } from 'react-native';
   import { theme } from '../../styles/theme';
   import type { AppScreenProps } from '../../navigation/types';

   const NomeDaTela: React.FC<AppScreenProps<'NomeDaTela'>> = ({ navigation }) => {
     // Estados
     const [loading, setLoading] = useState(false);

     return (
       <ScrollView style={styles.container}>
         <View style={styles.content}>
           {/* Conteúdo */}
         </View>
       </ScrollView>
     );
   };

   const styles = StyleSheet.create({
     container: {
       flex: 1,
       backgroundColor: theme.colors.background,
     },
     content: {
       padding: theme.spacing.lg,
     },
   });

   export default NomeDaTela;
   ```

3. **Se precisar de ViewModel**:
   - Criar `src/viewmodels/NomeDaTelaViewModel.ts`
   - ViewModel gerencia estado e chama Services
   - View apenas chama ViewModel

4. **Adicionar rota** em `src/navigation/AppStack.tsx` ou `AuthStack.tsx`

---

## Regras de Implementação

### ✅ SEMPRE Faça

1. **Use o tema**:

   ```typescript
   // ✅ CORRETO
   color: theme.colors.primary
   padding: theme.spacing.lg
   ...theme.typography.body
   ```

2. **Documente componentes**:
   - JSDoc completo no cabeçalho
   - Documente props, state, known_issues, changelog

3. **Implemente acessibilidade**:

   ```typescript
   <TouchableOpacity
     accessibilityRole="button"
     accessibilityLabel="Descrição clara"
     accessibilityHint="O que acontece ao interagir"
   />
   ```

4. **Use componentes existentes**:
   - Não recrie Button, Input, Card, etc.
   - Use componentes do design system

5. **Siga MVVM**:
   - View → ViewModel → Service
   - Nunca View → Service diretamente

6. **Atualize CHANGELOG.md**:
   - Adicione entrada na seção `[Unreleased]`

### ❌ NUNCA Faça

1. **Valores hardcoded**:

   ```typescript
   // ❌ ERRADO
   color: '#2E7D32';
   padding: 24;

   // ✅ CORRETO
   color: theme.colors.primary;
   padding: theme.spacing.lg;
   ```

2. **View chamando Service diretamente**:

   ```typescript
   // ❌ ERRADO
   const data = await dataService.getData();

   // ✅ CORRETO
   const viewModel = new ScreenViewModel();
   const data = await viewModel.getData();
   ```

3. **Criar componentes sem documentação**:
   - Sempre adicione JSDoc completo

4. **Ignorar acessibilidade**:
   - Todos os elementos interativos precisam de labels

5. **Duplicar código**:
   - Use componentes reutilizáveis
   - Extraia lógica comum para utils

---

## Interpretação do Design System

### Identidade Visual

O projeto tem identidade visual baseada em:

- **Confiança**: Design profissional e consistente
- **Simplicidade**: Interface limpa, sem elementos desnecessários
- **Acessibilidade**: Pensado para usuários com pouca afinidade tecnológica

### Cores e Significados

- **Verde Saúde**: Saúde, bem-estar, confiança
- **Azul**: Profissionalismo, calma
- **Vermelho**: Erro, alerta (use com moderação)
- **Verde Claro**: Sucesso, confirmação
- **Laranja**: Aviso, atenção

### Quando Criar Novo Componente vs Usar Existente

**Use componente existente se**:

- Atende 80%+ dos requisitos
- Pode ser customizado via props
- Segue padrão do design system

**Crie novo componente se**:

- Não há componente similar
- Requisitos são muito diferentes
- Será reutilizado em múltiplos lugares

### Animações

- **Sempre sutis**: Não distrair do conteúdo
- **Duração**: 200-300ms para ações, 150ms para feedback
- **Use native driver**: Quando possível para melhor performance
- **Feedback visual**: Sempre forneça feedback em ações do usuário

### Princípios de Espaçamento

- **Consistência**: Sempre use tema
- **Hierarquia**: Mais espaço = mais importância
- **Agrupamento**: Elementos relacionados = menos espaço entre eles

---

## Checklist para Novas Implementações

Antes de considerar uma implementação completa:

- [ ] Usa tema para cores, espaçamento, tipografia
- [ ] Documentação JSDoc completa
- [ ] Acessibilidade implementada (labels, roles)
- [ ] Segue arquitetura MVVM
- [ ] Usa componentes do design system quando possível
- [ ] Animações sutis e com native driver
- [ ] CHANGELOG.md atualizado
- [ ] Testes escritos (se aplicável)
- [ ] Sem valores hardcoded
- [ ] Código segue convenções do projeto

---

## Recursos de Referência

Ao implementar novos recursos, consulte:

1. **`docs/DESIGN_SYSTEM.md`**: Guia completo do design system
2. **`docs/COMPONENT_LIBRARY.md`**: Exemplos de uso de componentes
3. **`docs/DESIGN_PATTERNS.md`**: Padrões de layout e UX
4. **`docs/ACCESSIBILITY_GUIDE.md`**: Guia de acessibilidade
5. **`docs/KNOWN_ISSUES.md`**: Erros conhecidos e limitações
6. **`docs/DESIGN_DECISIONS.md`**: Contexto de decisões de design
7. **`docs/COMPONENT_USAGE_EXAMPLES.md`**: Exemplos práticos
8. **`AGENTS.md`**: Protocolo completo para agentes de IA

---

## Exemplo Completo: Criando Novo Componente

```typescript
/**
 * @component StatusIndicator
 * @description Componente que exibe um indicador visual de status com ícone e texto.
 *
 * @props
 *   - `status`: {'online' | 'offline' | 'away'} - Status a ser exibido (obrigatório).
 *   - `showText`: {boolean} - Se true, exibe texto ao lado do ícone (padrão: true).
 *   - `size`: {'small' | 'medium' | 'large'} - Tamanho do indicador (padrão: 'medium').
 *   - `style`: {ViewStyle} - Estilos customizados para o container.
 *
 * @state
 *   - Nenhum estado interno. Componente puramente apresentacional.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2025-12-06 - IA - Criação inicial do componente StatusIndicator.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../styles/theme';

export interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'away';
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  showText = true,
  size = 'medium',
  style,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return theme.colors.success;
      case 'offline':
        return theme.colors.textSecondary;
      case 'away':
        return theme.colors.warning;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'away':
        return 'Ausente';
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="text"
      accessibilityLabel={`Status: ${getStatusText()}`}
    >
      <View
        style={[
          styles.indicator,
          { backgroundColor: getStatusColor() },
          getSizeStyle(),
        ]}
      />
      {showText && (
        <Text style={styles.text}>{getStatusText()}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  indicator: {
    borderRadius: theme.borderRadius.round,
  },
  small: {
    width: 8,
    height: 8,
  },
  medium: {
    width: 12,
    height: 12,
  },
  large: {
    width: 16,
    height: 16,
  },
  text: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
});

export default StatusIndicator;
```

---

**Última atualização**: 2025-12-06
**Versão**: 1.0.0
