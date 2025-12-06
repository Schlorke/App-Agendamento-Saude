# Arquitetura do Sistema

Este documento descreve a arquitetura do aplicativo de agendamento de consultas em saúde, desenvolvido com React Native, Expo e TypeScript.

## Visão Geral

O projeto utiliza a arquitetura **MVVM (Model-View-ViewModel)** para separar as responsabilidades e facilitar os testes. Esta arquitetura promove:

- **Separação de responsabilidades**: Cada camada tem uma função bem definida
- **Testabilidade**: Lógica de negócio isolada e facilmente testável
- **Manutenibilidade**: Mudanças em uma camada não afetam diretamente outras
- **Reutilização**: ViewModels e Services podem ser reutilizados em diferentes Views

## Estrutura de Camadas

### 1. View (Camada de Apresentação)

**Localização**: `/src/screens` e `/src/components`

**Responsabilidades**:

- Renderizar a interface do usuário
- Capturar interações do usuário (toques, inputs, etc.)
- Exibir estados de loading, erros e sucesso
- Navegação entre telas

**Regras**:

- ❌ **NUNCA** deve chamar Services diretamente
- ❌ **NUNCA** deve conter lógica de negócio
- ✅ **DEVE** chamar apenas ViewModels
- ✅ **DEVE** ser "burra" - apenas exibe dados e repassa eventos

**Exemplo**:

```typescript
// ✅ CORRETO: View chama ViewModel
const LoginScreen = () => {
  const viewModel = new LoginViewModel();
  const result = await viewModel.login(cpf, senha);
  // ... exibe resultado
};

// ❌ ERRADO: View chamando Service diretamente
const LoginScreen = () => {
  const usuario = await dataService.buscarUsuarioPorCPF(cpf);
  // ...
};
```

### 2. ViewModel (Camada de Lógica de Apresentação)

**Localização**: `/src/viewmodels`

**Responsabilidades**:

- Gerenciar estado da UI (loading, errors, dados)
- Validar inputs do usuário
- Orquestrar chamadas a Services
- Transformar dados do Model para formato adequado à View
- Executar ações da View (login, agendamento, cancelamento, etc.)

**Regras**:

- ✅ **DEVE** ser a única camada que a View conhece
- ✅ **DEVE** chamar Services para obter dados
- ✅ **DEVE** conter toda a lógica de estado da UI
- ❌ **NÃO DEVE** conter lógica de negócio complexa (isso vai para Services)

**Estrutura Típica**:

```typescript
class LoginViewModel {
  private _loading: boolean = false;
  private _error: string | null = null;

  get loading(): boolean {
    return this._loading;
  }
  get error(): string | null {
    return this._error;
  }

  async login(cpf: string, senha: string): Promise<LoginResult> {
    // Validação
    // Chamada ao Service
    // Tratamento de erros
    // Retorno formatado
  }
}
```

**ViewModels Existentes**:

- `LoginViewModel`: Gerencia autenticação de usuário
- `RegisterViewModel`: Gerencia cadastro de novos usuários
- `ScheduleViewModel`: Gerencia agendamento de consultas
- `CancelAppointmentViewModel`: Gerencia cancelamento de consultas

### 3. Model (Camada de Dados e Lógica de Negócio)

**Localização**: `/src/services` e `/src/data`

**Responsabilidades**:

- Acesso a dados (banco de dados, APIs, storage)
- Lógica de negócio (validações complexas, cálculos, transformações)
- Persistência de dados
- Cache e otimizações de acesso a dados

**Regras**:

- ✅ **DEVE** ser chamado apenas por ViewModels
- ✅ **DEVE** conter lógica de negócio reutilizável
- ❌ **NÃO DEVE** conhecer nada sobre a UI

**Services Existentes**:

- `dataService.ts`: Acesso ao banco de dados mockado (`db.json`)
  - Busca de usuários, especialidades, profissionais
  - Operações CRUD de consultas
  - Validações de disponibilidade
- `storageService.ts`: Persistência local usando AsyncStorage
  - Armazenamento de sessão de usuário
  - Cache de dados

**Estrutura de Dados**:
O banco de dados é simulado através do arquivo `/src/data/db.json` contendo:

- `usuarios`: Lista de usuários cadastrados
- `especialidades`: Especialidades médicas disponíveis
- `profissionais`: Profissionais de saúde
- `consultas`: Consultas agendadas
- `horarios`: Horários disponíveis para agendamento

## Fluxo de Dados

### Exemplo: Fluxo de Login

```
1. Usuário preenche CPF e senha na LoginScreen (View)
   ↓
2. Usuário clica em "Entrar"
   ↓
3. LoginScreen chama LoginViewModel.login(cpf, senha)
   ↓
4. LoginViewModel valida inputs
   ↓
5. LoginViewModel chama dataService.buscarUsuarioPorCPF(cpf)
   ↓
6. dataService retorna usuário (ou null)
   ↓
7. LoginViewModel verifica senha usando hash
   ↓
8. LoginViewModel retorna LoginResult para LoginScreen
   ↓
9. LoginScreen exibe resultado (sucesso ou erro)
   ↓
10. Se sucesso, LoginScreen chama storageService.salvarSessao()
    ↓
11. Navegação redireciona para AppStack
```

## Navegação

**Localização**: `/src/navigation`

O projeto utiliza **React Navigation** com navegação condicional baseada em autenticação:

- **AuthStack**: Stack de navegação para telas de autenticação (Login, Register)
- **AppStack**: Tab Navigator para telas principais do app (Home, Schedule, History, Profile)
- **Navigation (index.tsx)**: Componente raiz que decide qual stack exibir baseado no estado de autenticação

**Fluxo de Navegação**:

```
App.tsx
  └── Navigation (index.tsx)
      ├── useAuth() verifica autenticação
      ├── Se não autenticado → AuthStack
      └── Se autenticado → AppStack
```

## Hooks Customizados

**Localização**: `/src/hooks`

- `useAuth.ts`: Hook para gerenciar estado de autenticação global
  - Fornece `isAuthenticated`, `usuario`, `login()`, `logout()`
  - Utiliza `storageService` para persistir sessão

## Utilitários

**Localização**: `/src/utils`

- `validation.ts`: Funções de validação (CPF, data, senha)
- `hash.ts`: Funções de hash de senhas (SHA-256)

## Tema e Estilos

**Localização**: `/src/styles`

- `theme.ts`: Tema centralizado com cores, tipografia, espaçamentos e sombras
- Todos os componentes devem usar o tema ao invés de valores hardcoded

## Testes

**Localização**: `/__tests__`

A estrutura de testes espelha a estrutura de `src`:

- `__tests__/components/`: Testes de componentes
- `__tests__/screens/`: Testes de telas
- `__tests__/viewmodels/`: Testes de ViewModels
- `__tests__/utils/`: Testes de utilitários

**Ferramentas**:

- Jest: Framework de testes
- React Testing Library: Testes de componentes React

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                        View Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Screens    │  │  Components  │  │  Navigation  │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │   ViewModel Layer  │
                    │  ┌─────────────┐  │
                    │  │ LoginVM     │  │
                    │  │ RegisterVM  │  │
                    │  │ ScheduleVM  │  │
                    │  │ CancelVM    │  │
                    │  └──────┬──────┘  │
                    └─────────┼─────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Model Layer      │
                    │  ┌──────────────┐ │
                    │  │ dataService  │ │
                    │  │ storageService│ │
                    │  └──────┬───────┘ │
                    └─────────┼─────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Data Layer       │
                    │  ┌──────────────┐ │
                    │  │  db.json     │ │
                    │  │ AsyncStorage │ │
                    │  └──────────────┘ │
                    └───────────────────┘
```

## Princípios de Design

1. **Single Responsibility**: Cada classe/função tem uma única responsabilidade
2. **Dependency Inversion**: Camadas superiores dependem de abstrações, não de implementações
3. **Separation of Concerns**: UI, lógica e dados são completamente separados
4. **Testability**: Cada camada pode ser testada independentemente

## Próximos Passos Arquiteturais

- [ ] Implementar reatividade nos ViewModels (usando observables)
- [ ] Adicionar camada de cache para otimização
- [ ] Implementar tratamento de erros global
- [ ] Adicionar logging estruturado
- [ ] Migrar de JSON mock para API real quando necessário

---

**Última atualização**: 2024-01-15
**Versão da Arquitetura**: 1.0.0
