# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **RF04 - Validação de 24h no cancelamento**: Implementada validação que bloqueia cancelamentos com menos de 24 horas de antecedência
- **RF06 - Tela de Notícias/Campanhas**: Criada `NewsScreen.tsx` com `NewsViewModel.ts` para exibir notícias e campanhas de saúde
- **RF07 - Tela de Farmácias de Plantão**: Criada `PharmaciesScreen.tsx` com `PharmaciesViewModel.ts` para listar farmácias de plantão
- **RF08 - Notificações Push**: Implementado serviço completo de notificações com `notificationService.ts` usando expo-notifications
  - Notificações de confirmação ao agendar consulta
  - Notificações de lembrete 1 dia antes da consulta
  - Cancelamento automático de notificações ao cancelar consulta
- **RF09 - Edição de Perfil**: Criada `EditProfileScreen.tsx` com `EditProfileViewModel.ts` para editar telefone e endereço
- **RF10 - Tela de Medicamentos**: Criada `MedicationsScreen.tsx` com `MedicationsViewModel.ts` para exibir informações sobre medicamentos
- Métodos no `dataService.ts`:
  - `buscarNoticias()` - Busca todas as notícias
  - `buscarFarmacias()` - Busca todas as farmácias de plantão
  - `buscarMedicamentos()` - Busca todos os medicamentos
  - `buscarConsultaPorId()` - Busca uma consulta por ID
- Interfaces TypeScript para novos tipos:
  - `Noticia`, `Farmacia`, `Medicamento` em `dataService.ts`
- Testes unitários para novos ViewModels:
  - `NewsViewModel.test.ts`
  - `PharmaciesViewModel.test.ts`
  - `MedicationsViewModel.test.ts`
  - `EditProfileViewModel.test.ts`
  - Testes de validação de 24h em `CancelAppointmentViewModel.test.ts`
- Navegação atualizada:
  - Adicionadas rotas `News`, `Pharmacies`, `Medications`, `EditProfile` no `AppStack`
  - Botões de navegação na `HomeScreen` para as novas telas
- Sistema completo de documentação enterprise
  - `AGENTS.md` - Guia completo para agentes de IA (localizado na raiz para fácil descoberta)
  - `/docs/ARCHITECTURE.md` - Documentação da arquitetura MVVM
  - `/docs/DESIGN_SYSTEM.md` - Sistema de design visual
- `CHANGELOG.md` - Registro de mudanças do projeto
- Blocos de documentação JSDoc em todos os componentes `.tsx`

### Changed

- `AppStack.tsx` - Convertido para Stack Navigator contendo Tab Navigator e novas rotas secundárias
- `CancelAppointmentViewModel.ts` - Adicionada validação de 24h antes de cancelar consulta
- `ScheduleViewModel.ts` - Integrado com serviço de notificações para agendar notificações ao criar consulta
- `ProfileScreen.tsx` - Implementada navegação para `EditProfileScreen`
- `App.tsx` - Adicionada configuração de handlers de notificações e solicitação de permissões
- `README.md` - Reestruturado com formato profissional e links para documentação
- `AGENTS.md` - Movido de `/docs/` para a raiz do projeto para facilitar descoberta por IAs e IDEs

### Fixed

- Corrigido erro de linting no arquivo `temp-template/package/metro.config.js` adicionando `temp-template/` aos padrões ignorados do ESLint
- Corrigido erro de permissão ao fazer `git add` adicionando `.gradle/` e `temp-template/` ao `.gitignore`
- Corrigido scripts do `package.json` que usavam `expo` diretamente: atualizados para usar `pnpm exec expo` para garantir uso da versão instalada localmente
- Adicionado `.gitattributes` para normalizar line endings (LF/CRLF) automaticamente
- Adicionado `android/` e `ios/` ao `.gitignore` para ignorar diretórios nativos gerados pelo `expo prebuild`
- Corrigidos warnings do npm alterando script `build` para usar `pnpm` ao invés de `npm`, eliminando avisos sobre configurações de ambiente desconhecidas
- Removido aviso do script `prebuild` sobre possível falha do Expo SDK 54
- Resolvido aviso do Android `userInterfaceStyle` instalando `expo-system-ui`
- Corrigidos problemas de linting markdown no `DESIGN_SYSTEM.md`: convertidas ênfases em títulos adequados e resolvidos títulos duplicados adicionando contexto específico

### Removed

- Removida pasta `temp-template/` que não estava sendo utilizada no projeto (template temporário do Expo)

### Security
