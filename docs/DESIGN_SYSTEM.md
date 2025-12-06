# Design System: Saúde Acessível

Este documento define a identidade visual, componentes e diretrizes de design do aplicativo de agendamento de consultas em saúde.

## 1. Filosofia Visual

Nossa identidade visual se baseia em três pilares fundamentais:

### Confiança

O design transmite segurança e profissionalismo, essenciais em um contexto de saúde. Elementos visuais são consistentes e previsíveis.

### Simplicidade

Interface limpa e direta, sem elementos desnecessários. Cada elemento tem um propósito claro e facilita a compreensão.

### Acessibilidade

Design pensado para usuários com pouca afinidade tecnológica. Textos claros, contrastes adequados, elementos grandes e fáceis de tocar.

## 2. Paleta de Cores

A paleta de cores foi escolhida para transmitir confiança, saúde e bem-estar, mantendo alta legibilidade e contraste.

### Cores Primárias

| Cor              | Hex       | Uso                                                    | Psicologia                                                                              |
| :--------------- | :-------- | :----------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| **Verde Saúde**  | `#2E7D32` | Botões principais, headers, elementos de ação primária | Representa saúde, bem-estar, natureza e renovação. Transmite confiança e tranquilidade. |
| **Verde Escuro** | `#1B5E20` | Estados hover/pressed de botões primários              | Versão mais intensa do verde, usada para feedback visual.                               |
| **Verde Claro**  | `#4CAF50` | Estados de sucesso, confirmações                       | Versão mais suave, usada para feedback positivo.                                        |

### Cores Secundárias

| Cor      | Hex       | Uso                                    | Psicologia                                                                   |
| :------- | :-------- | :------------------------------------- | :--------------------------------------------------------------------------- |
| **Azul** | `#1976D2` | Botões secundários, links, informações | Transmite confiança, calma e profissionalismo. Usado para ações secundárias. |

### Cores de Fundo

| Cor                 | Hex       | Uso                               |
| :------------------ | :-------- | :-------------------------------- |
| **Fundo Principal** | `#F5F5F5` | Background geral das telas        |
| **Superfície**      | `#FFFFFF` | Cards, inputs, elementos elevados |
| **Borda**           | `#E0E0E0` | Bordas de inputs, divisores       |

### Cores de Texto

| Cor                  | Hex       | Uso                         |
| :------------------- | :-------- | :-------------------------- |
| **Texto Principal**  | `#212121` | Textos principais, títulos  |
| **Texto Secundário** | `#757575` | Textos de apoio, legendas   |
| **Texto Claro**      | `#FFFFFF` | Textos sobre fundos escuros |

### Cores de Estado

| Cor              | Hex       | Uso                                     | Psicologia                                                       |
| :--------------- | :-------- | :-------------------------------------- | :--------------------------------------------------------------- |
| **Erro**         | `#D32F2F` | Mensagens de erro, validações negativas | Alerta imediato, chama atenção para problemas.                   |
| **Aviso**        | `#F57C00` | Avisos, informações importantes         | Atenção sem alarme, usado para informações que requerem cuidado. |
| **Sucesso**      | `#388E3C` | Confirmações, ações bem-sucedidas       | Positividade, reforça ações corretas do usuário.                 |
| **Desabilitado** | `#BDBDBD` | Elementos desabilitados                 | Indica claramente que um elemento não está disponível.           |

## 3. Tipografia

### Fonte

- **Família**: Roboto (ou fonte padrão do sistema operacional)
- **Fallback**: System default (San Francisco no iOS, Roboto no Android)

### Hierarquia Tipográfica

| Nome           | Tamanho |      Peso       | Line Height | Uso                                     |
| :------------- | :-----: | :-------------: | :---------: | :-------------------------------------- |
| **H1**         |  32px   |      Bold       |    40px     | Títulos principais de telas             |
| **H2**         |  24px   |      Bold       |    32px     | Títulos de seções                       |
| **H3**         |  20px   | Semi-bold (600) |    28px     | Subtítulos, títulos de cards            |
| **Body**       |  16px   |     Regular     |    24px     | Texto principal, parágrafos             |
| **Body Small** |  14px   |     Regular     |    20px     | Textos de apoio, descrições             |
| **Caption**    |  12px   |     Regular     |    16px     | Legendas, notas, informações auxiliares |

### Princípios de Tipografia

- **Contraste**: Sempre usar cores de texto com contraste mínimo de 4.5:1 (WCAG AA)
- **Legibilidade**: Evitar textos muito longos em uma única linha (máximo 75 caracteres)
- **Hierarquia**: Usar tamanhos diferentes para criar hierarquia visual clara
- **Espaçamento**: Manter espaçamento adequado entre linhas para facilitar leitura

## 4. Espaçamento

Sistema de espaçamento baseado em múltiplos de 4px para consistência visual:

| Nome    | Valor | Uso                                             |
| :------ | :---: | :---------------------------------------------- |
| **XS**  |  4px  | Espaçamento mínimo entre elementos relacionados |
| **SM**  |  8px  | Espaçamento entre elementos próximos            |
| **MD**  | 16px  | Espaçamento padrão entre seções                 |
| **LG**  | 24px  | Espaçamento entre grupos de elementos           |
| **XL**  | 32px  | Espaçamento entre seções principais             |
| **XXL** | 48px  | Espaçamento entre telas ou áreas grandes        |

## 5. Bordas e Raios

| Nome      | Valor  | Uso                                                    |
| :-------- | :----: | :----------------------------------------------------- |
| **SM**    |  4px   | Elementos pequenos, badges                             |
| **MD**    |  8px   | Botões, inputs (padrão)                                |
| **LG**    |  12px  | Cards, containers maiores                              |
| **XL**    |  16px  | Modais, diálogos                                       |
| **Round** | 9999px | Elementos completamente arredondados (avatares, pills) |

## 6. Sombras

Sistema de elevação usando sombras para criar hierarquia visual:

### Sombra Pequena

- **Uso**: Cards simples, elementos levemente elevados
- **Elevação**: 1dp

### Sombra Média

- **Uso**: Cards principais, botões, inputs focados
- **Elevação**: 4dp

### Sombra Grande

- **Uso**: Modais, diálogos, elementos flutuantes
- **Elevação**: 8dp

## 7. Componentes

### Botões

#### Variantes

##### Primary (Padrão)

- Cor de fundo: Verde Saúde (`#2E7D32`)
- Cor do texto: Branco (`#FFFFFF`)
- Uso: Ações principais (Salvar, Confirmar, Entrar)

##### Secondary

- Cor de fundo: Azul (`#1976D2`)
- Cor do texto: Branco (`#FFFFFF`)
- Uso: Ações secundárias (Cancelar, Voltar)

##### Outline

- Cor de fundo: Transparente
- Borda: Verde Saúde (`#2E7D32`)
- Cor do texto: Verde Saúde (`#2E7D32`)
- Uso: Ações terciárias, ações menos importantes

#### Estados dos Botões

- **Default**: Estado normal do botão
- **Pressed**: Opacidade reduzida (0.7) ao toque
- **Disabled**: Cor cinza (`#BDBDBD`), opacidade 0.6, interação desabilitada
- **Loading**: Exibe `ActivityIndicator` no lugar do texto

#### Especificações dos Botões

- Altura mínima: 50px
- Padding horizontal: 24px
- Largura mínima: 120px
- Border radius: 8px (MD)

### Inputs

#### Estados dos Inputs

- **Default**: Borda cinza (`#E0E0E0`), fundo branco
- **Focused**: Borda verde (`#2E7D32`), pode adicionar sombra sutil
- **Error**: Borda vermelha (`#D32F2F`), mensagem de erro abaixo
- **Disabled**: Fundo cinza claro, texto cinza, interação desabilitada

#### Especificações dos Inputs

- Altura: 50px
- Padding horizontal: 16px
- Border radius: 8px (MD)
- Border width: 1px

### Cards

#### Especificações dos Cards

- Fundo: Branco (`#FFFFFF`)
- Border radius: 12px (LG)
- Padding: 24px (LG)
- Sombra: Média (elevação 4dp)
- Espaçamento entre cards: 16px (MD)

### Loading

#### Indicador

- Cor: Verde Saúde (`#2E7D32`)
- Tamanhos: `small` ou `large`
- Mensagem opcional abaixo do indicador

## 8. Acessibilidade

### Contraste

- Todos os textos devem ter contraste mínimo de 4.5:1 (WCAG AA)
- Textos grandes (18px+) podem ter contraste de 3:1 (WCAG AA Large Text)

### Tamanhos de Toque

- Elementos interativos devem ter área de toque mínima de 44x44px
- Espaçamento entre elementos clicáveis: mínimo 8px

### Labels de Acessibilidade

- Todos os elementos interativos devem ter `accessibilityLabel`
- Elementos complexos devem ter `accessibilityHint`
- Use `accessibilityRole` apropriado (button, text, header, etc.)

### Exemplo

```typescript
<TouchableOpacity
  accessibilityLabel="Botão de agendar consulta"
  accessibilityHint="Toque duas vezes para abrir a tela de agendamento"
  accessibilityRole="button"
>
```

## 9. Animações e Transições

### Princípios

- Animações devem ser sutis e não distrair
- Duração padrão: 200-300ms
- Usar easing natural (ease-in-out)

### Transições Comuns

- Navegação entre telas: fade ou slide
- Aparição de elementos: fade in
- Feedback de toque: scale (0.95) ou opacity (0.7)

## 10. Responsividade

### Breakpoints (Web)

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile First

- Design pensado primeiro para mobile
- Adaptações para telas maiores quando necessário

## 11. Ícones e Imagens

### Ícones

- Usar emojis simples para simplicidade e reconhecimento imediato
- Tamanho padrão: 24x24px
- Espaçamento ao lado do texto: 8px

### Imagens

- Formato preferido: PNG para ícones, JPG para fotos
- Otimização: Comprimir imagens antes de incluir no projeto
- Lazy loading: Carregar imagens sob demanda quando possível

## 12. Dark Mode (Futuro)

Embora não implementado atualmente, o design system está preparado para suportar dark mode no futuro através do tema centralizado.

## 13. Guia de Uso Rápido

### Criando um Novo Componente

1. Use o tema centralizado (`theme.ts`) para cores, espaçamentos e tipografia
2. Siga as especificações de componentes acima
3. Implemente estados (default, pressed, disabled, error)
4. Adicione labels de acessibilidade
5. Documente no cabeçalho do arquivo usando o formato JSDoc

### Exemplo de Uso do Tema

```typescript
import { theme } from '../styles/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    ...theme.shadow.medium,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
});
```

---

**Última atualização**: 2024-01-15
**Versão do Design System**: 1.0.0
