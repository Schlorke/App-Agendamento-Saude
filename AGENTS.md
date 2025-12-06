# Guia de Operações para Agentes de IA

Este arquivo serve como o **"cérebro contextual"** para qualquer IA que interaja com este projeto. Ele contém todas as diretrizes, protocolos e filosofias que devem ser seguidas rigorosamente.

## 1. Protocolo de Interação

Antes de executar QUALQUER alteração de código, você DEVE seguir estritamente este protocolo:

1. **LEIA este arquivo (`AGENTS.md`) por completo.**
2. **LEIA o arquivo `/docs/ARCHITECTURE.md`** para entender a arquitetura.
3. **LEIA o arquivo `/docs/DESIGN_SYSTEM.md`** para entender a identidade visual.
4. **NAVEGUE até o componente ou arquivo** que você precisa alterar.
5. **LEIA o bloco de documentação no cabeçalho do arquivo** para entender seu propósito, estado, props e histórico de alterações.
6. **EXECUTE a alteração solicitada.**
7. **ATUALIZE o bloco de documentação no cabeçalho do arquivo** com a sua alteração, incluindo a data, seu nome (IA) e a descrição da mudança.
8. **ATUALIZE o arquivo `/CHANGELOG.md`** na raiz do projeto, adicionando uma entrada na seção "Unreleased".

## 2. Protocolo de Documentação de Componentes

Todo novo componente `.tsx` criado DEVE conter o seguinte bloco de documentação em seu cabeçalho. Ao alterar um componente, você DEVE atualizar este bloco.

```typescript
/**
 * @component [NomeDoComponente]
 * @description [Propósito principal do componente em uma frase.]
 *
 * @props
 *   - `[nomeProp]`: {[tipo]} - [Descrição da prop.]
 *
 * @state
 *   - `[nomeState]`: {[tipo]} - [Descrição do estado e seu propósito.]
 *
 * @known_issues
 *   - [Descreva aqui quaisquer bugs conhecidos ou limitações.]
 *
 * @changelog
 *   - [YYYY-MM-DD] - [Autor/IA] - [Descrição da alteração.]
 */
```

### Exemplo de Documentação Completa

```typescript
/**
 * @component Button
 * @description Componente de botão reutilizável com suporte a múltiplas variantes, estados de loading e acessibilidade.
 *
 * @props
 *   - `title`: {string} - Texto exibido no botão.
 *   - `onPress`: {() => void} - Função chamada quando o botão é pressionado.
 *   - `variant`: {'primary' | 'secondary' | 'outline'} - Variante visual do botão (padrão: 'primary').
 *   - `disabled`: {boolean} - Se true, desabilita a interação com o botão.
 *   - `loading`: {boolean} - Se true, exibe um indicador de carregamento.
 *   - `style`: {ViewStyle} - Estilos customizados para o container do botão.
 *   - `textStyle`: {TextStyle} - Estilos customizados para o texto do botão.
 *   - `fullWidth`: {boolean} - Se true, o botão ocupa 100% da largura disponível.
 *
 * @state
 *   - Nenhum estado interno. Componente controlado via props.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Criação inicial do componente com suporte a variantes e loading.
 */
```

## 3. Filosofia do Projeto

### Clareza sobre Concisão

Prefira código e comentários que sejam explícitos e fáceis de entender. Um código claro é mais valioso que um código conciso mas obscuro.

### TDD é Mandatório

Nenhum código de lógica de negócio pode ser "commitado" sem um teste correspondente. Os testes devem:

- Estar na pasta `__tests__` com estrutura espelhando `src`
- Cobrir casos de sucesso e falha
- Ser executáveis e passarem antes de qualquer commit

### Performance é um Requisito

Otimize para performance, especialmente em:

- Listas longas (use `FlatList` ao invés de `ScrollView` com muitos itens)
- Operações assíncronas (evite bloqueios na thread principal)
- Re-renderizações desnecessárias (use `React.memo`, `useMemo`, `useCallback` quando apropriado)

### Acessibilidade (a11y) não é Opcional

Todos os componentes interativos devem ter:

- `accessibilityLabel`: Descrição clara do elemento
- `accessibilityHint`: Instrução sobre o que acontece ao interagir
- `accessibilityRole`: Papel semântico do elemento (button, text, etc.)

Exemplo:

```typescript
<TouchableOpacity
  accessibilityLabel="Botão de login"
  accessibilityHint="Toque duas vezes para fazer login no aplicativo"
  accessibilityRole="button"
  onPress={handleLogin}
>
```

## 4. Arquitetura MVVM

Este projeto segue rigorosamente o padrão **MVVM (Model-View-ViewModel)**:

- **View (Telas/Componentes)**: Apenas exibem dados e capturam interações. NUNCA devem chamar serviços diretamente.
- **ViewModel**: Contém toda a lógica de estado da UI e ações. É a única camada que a View pode chamar.
- **Model (Services)**: Contém lógica de negócio e acesso a dados. Apenas ViewModels podem chamar Services.

**Regra de Ouro**: View → ViewModel → Service. Nunca View → Service diretamente.

## 5. Convenções de Código

### Nomenclatura

- **Componentes**: PascalCase (`LoginScreen`, `Button`)
- **Funções/Variáveis**: camelCase (`handleLogin`, `userName`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)
- **Arquivos**: PascalCase para componentes (`Button.tsx`), camelCase para utilitários (`validation.ts`)

### Estrutura de Arquivos

- Um componente por arquivo
- Export default para componentes principais
- Export nomeado para tipos/interfaces
- Testes na pasta `__tests__` espelhando a estrutura de `src`

### Imports

Ordem de imports:

1. Bibliotecas externas (React, React Native)
2. Bibliotecas de terceiros
3. Imports internos (componentes, serviços, utils)
4. Tipos (no final, com `type` keyword)

Exemplo:

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Button';
import type { AppScreenProps } from '../../navigation/types';
```

## 6. Tratamento de Erros

- Sempre trate erros de forma explícita
- Forneça mensagens de erro claras e acionáveis para o usuário
- Log erros em desenvolvimento, mas não exponha detalhes técnicos ao usuário final
- Use try/catch em operações assíncronas

## 7. Design System e Identidade Visual

### Uso do Tema

**SEMPRE** use o tema centralizado (`src/styles/theme.ts`) para cores, espaçamento e tipografia:

```typescript
// ✅ CORRETO
import { theme } from '../styles/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    ...theme.typography.body,
  },
});

// ❌ ERRADO - valores hardcoded
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    padding: 24,
    fontSize: 16,
  },
});
```

### Componentes do Design System

Use sempre os componentes do design system quando possível:

- `Button`: Botões com variantes (primary, secondary, outline)
- `Input`: Inputs com label, erro e animação de foco
- `Card`: Cards com variantes (elevated, outlined, flat)
- `Badge`: Status, tags, contadores
- `EmptyState`: Estados vazios
- `Modal`: Modais de confirmação/alerta
- `Toast`: Notificações temporárias
- `Skeleton`: Placeholders de loading

**NUNCA** recrie componentes que já existem. Customize via props.

### Animações

- Use funções do `src/utils/animations.ts` quando possível
- Animações devem ser sutis (200-300ms)
- Sempre use `useNativeDriver: true` quando possível
- Forneça feedback visual em todas as ações do usuário

### Documentação de Design

Consulte sempre:

- `docs/DESIGN_SYSTEM.md`: Guia completo do design system
- `docs/COMPONENT_LIBRARY.md`: Documentação de componentes
- `docs/DESIGN_PATTERNS.md`: Padrões de layout e UX
- `docs/ACCESSIBILITY_GUIDE.md`: Guia de acessibilidade
- `docs/AI_CONTEXT.md`: Contexto específico para IAs

## 8. Atualização de Documentação

Sempre que você fizer uma alteração:

1. Atualize o bloco JSDoc no cabeçalho do arquivo
2. Atualize o `CHANGELOG.md` na seção `[Unreleased]`
3. Se a alteração afetar a arquitetura, atualize `ARCHITECTURE.md`
4. Se a alteração afetar o design, atualize `DESIGN_SYSTEM.md`
5. Se encontrar um bug conhecido, consulte `docs/KNOWN_ISSUES.md` antes de investigar
6. Se criar novo componente, adicione exemplo em `docs/COMPONENT_USAGE_EXAMPLES.md`

## 9. Sistema de Contexto para IA

### Arquivos de Contexto

Este projeto possui um sistema completo de documentação para fornecer contexto às IAs:

- **`docs/AI_CONTEXT.md`**: Guia específico para IAs entenderem o projeto
- **`docs/KNOWN_ISSUES.md`**: Erros conhecidos, limitações e workarounds
- **`docs/DESIGN_DECISIONS.md`**: Decisões de design e justificativas
- **`docs/COMPONENT_USAGE_EXAMPLES.md`**: Exemplos práticos de uso

### Antes de Implementar

1. **Consulte `docs/KNOWN_ISSUES.md`**: Verifique se o problema já é conhecido
2. **Consulte `docs/AI_CONTEXT.md`**: Entenda o contexto do projeto
3. **Consulte `docs/DESIGN_DECISIONS.md`**: Entenda por que certas escolhas foram feitas
4. **Use exemplos**: Consulte `docs/COMPONENT_USAGE_EXAMPLES.md` para padrões

### Evitando Alucinações

- **Sempre use o tema**: Não invente cores ou espaçamentos
- **Use componentes existentes**: Não recrie componentes que já existem
- **Siga padrões**: Consulte `docs/DESIGN_PATTERNS.md` para padrões comuns
- **Mantenha identidade visual**: Verde saúde (#2E7D32) é a cor primária

## 10. Testes

Ao criar ou modificar código:

- Escreva testes antes ou junto com a implementação
- Teste casos de sucesso e falha
- Teste edge cases
- Mantenha cobertura de testes acima de 80% para lógica de negócio

## 11. Checklist Antes de Finalizar

Antes de considerar uma tarefa completa, verifique:

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
- [ ] Consultei `docs/KNOWN_ISSUES.md` antes de investigar problemas

## 12. Referências Rápidas

### Arquivos de Documentação

- **`AGENTS.md`** (este arquivo): Protocolo completo para agentes de IA
- **`docs/ARCHITECTURE.md`**: Arquitetura MVVM do projeto
- **`docs/DESIGN_SYSTEM.md`**: Design system completo
- **`docs/COMPONENT_LIBRARY.md`**: Biblioteca de componentes
- **`docs/DESIGN_PATTERNS.md`**: Padrões de design e UX
- **`docs/ACCESSIBILITY_GUIDE.md`**: Guia de acessibilidade
- **`docs/KNOWN_ISSUES.md`**: Erros conhecidos e limitações
- **`docs/DESIGN_DECISIONS.md`**: Decisões de design
- **`docs/COMPONENT_USAGE_EXAMPLES.md`**: Exemplos práticos
- **`docs/AI_CONTEXT.md`**: Contexto específico para IAs

### Estrutura de Arquivos Importantes

```
/
├── AGENTS.md                          # Protocolo para IAs (LEIA PRIMEIRO)
├── CHANGELOG.md                       # Histórico de mudanças
├── docs/
│   ├── ARCHITECTURE.md                # Arquitetura MVVM
│   ├── DESIGN_SYSTEM.md               # Design system
│   ├── COMPONENT_LIBRARY.md           # Biblioteca de componentes
│   ├── DESIGN_PATTERNS.md             # Padrões de design
│   ├── ACCESSIBILITY_GUIDE.md         # Acessibilidade
│   ├── KNOWN_ISSUES.md                # Erros conhecidos
│   ├── DESIGN_DECISIONS.md            # Decisões de design
│   ├── COMPONENT_USAGE_EXAMPLES.md    # Exemplos práticos
│   └── AI_CONTEXT.md                  # Contexto para IAs
└── src/
    ├── components/                     # Componentes reutilizáveis
    ├── screens/                       # Telas (Views)
    ├── viewmodels/                    # ViewModels
    ├── services/                      # Services
    ├── styles/
    │   └── theme.ts                   # Tema centralizado
    └── utils/
        └── animations.ts              # Sistema de animações
```

---

**Última atualização**: 2025-12-06
**Versão do Protocolo**: 2.0.0
