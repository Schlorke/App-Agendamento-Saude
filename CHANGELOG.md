# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Sistema completo de documentação enterprise
  - `AGENTS.md` - Guia completo para agentes de IA (localizado na raiz para fácil descoberta)
  - `/docs/ARCHITECTURE.md` - Documentação da arquitetura MVVM
  - `/docs/DESIGN_SYSTEM.md` - Sistema de design visual
- `CHANGELOG.md` - Registro de mudanças do projeto
- Blocos de documentação JSDoc em todos os componentes `.tsx`

### Changed

- `README.md` - Reestruturado com formato profissional e links para documentação
- `AGENTS.md` - Movido de `/docs/` para a raiz do projeto para facilitar descoberta por IAs e IDEs

### Fixed

- Corrigido erro de linting no arquivo `temp-template/package/metro.config.js` adicionando `temp-template/` aos padrões ignorados do ESLint
- Corrigido erro de permissão ao fazer `git add` adicionando `.gradle/` e `temp-template/` ao `.gitignore`
- Adicionado `.gitattributes` para normalizar line endings (LF/CRLF) automaticamente
- Adicionado `android/` e `ios/` ao `.gitignore` para ignorar diretórios nativos gerados pelo `expo prebuild`
- Corrigidos warnings do npm alterando script `build` para usar `pnpm` ao invés de `npm`, eliminando avisos sobre configurações de ambiente desconhecidas
- Removido aviso do script `prebuild` sobre possível falha do Expo SDK 54
- Resolvido aviso do Android `userInterfaceStyle` instalando `expo-system-ui`

### Removed

- Removida pasta `temp-template/` que não estava sendo utilizada no projeto (template temporário do Expo)

### Security
