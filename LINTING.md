# Configuração de Prettier e ESLint

Prettier e ESLint foram instalados e configurados no projeto para garantir qualidade e consistência do código.

## 📦 Pacotes Instalados

### Prettier

- `prettier`: Formatador de código

### ESLint

- `eslint`: Linter principal
- `@typescript-eslint/parser`: Parser TypeScript para ESLint
- `@typescript-eslint/eslint-plugin`: Plugin TypeScript
- `eslint-config-prettier`: Desabilita regras do ESLint que conflitam com Prettier
- `eslint-plugin-prettier`: Executa Prettier como regra do ESLint
- `eslint-plugin-react`: Regras para React
- `eslint-plugin-react-hooks`: Regras para React Hooks
- `eslint-plugin-react-native`: Regras específicas para React Native

## 📝 Scripts Disponíveis

```bash
# Formatar código automaticamente
npm run format

# Verificar formatação (sem modificar)
npm run format:check

# Executar ESLint
npm run lint

# Executar ESLint e corrigir automaticamente
npm run lint:fix
```

## ⚙️ Configurações

### Prettier (`.prettierrc.js`)

- Single quotes
- Semicolons
- Tab width: 2
- Print width: 80
- Trailing commas: ES5

### ESLint (`.eslintrc.json`)

- Extends: ESLint recomendado, TypeScript, React, React Hooks, Prettier
- Regras personalizadas para TypeScript e React Native
- Avisos para `any` e variáveis não utilizadas
- Validação de hooks do React

## 📁 Arquivos Ignorados

Os seguintes arquivos/diretórios são ignorados pelo linting:

- `node_modules/`
- `.expo/`
- `dist/`, `build/`, `coverage/`
- `jest.config.js`, `jest.setup.js` (configurações especiais)

## 🔧 Uso Recomendado

1. **Antes de commitar**: Execute `npm run format` e `npm run lint:fix`
2. **Integração com IDE**: Configure seu editor para formatar ao salvar
3. **CI/CD**: Adicione `npm run lint` e `npm run format:check` no pipeline

## 💡 Dicas

- Use `// eslint-disable-next-line` para desabilitar regras específicas quando necessário
- Variáveis não utilizadas que começam com `_` são ignoradas
- O namespace em `src/navigation/types.ts` está permitido (necessário para React Navigation)
