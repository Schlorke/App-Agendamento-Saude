import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import {
  Calendar,
  ClipboardList,
  Megaphone,
  Pill,
  Syringe,
  UserCircle,
} from 'lucide-react-native';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../styles/theme';
import Card from '../../components/Card';
import { fadeIn, slideUp, staggerFadeIn } from '../../utils/animations';
import type { AppScreenProps } from '../../navigation/types';

/**
 * @component HomeScreen
 * @description Tela inicial do aplicativo após autenticação. Exibe boas-vindas personalizadas e menu de navegação rápida.
 *
 * @props
 *   - `navigation`: {AppScreenProps<'Home'>} - Objeto de navegação do React Navigation, permite navegar para outras telas do AppStack.
 *
 * @state
 *   - Nenhum estado interno. Utiliza apenas o hook `useAuth` para obter dados do usuário.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Adicionado bloco de documentação JSDoc completo.
 *   - 2025-12-06 - IA - Adicionadas labels e hints de acessibilidade nos itens do menu.
 *   - 2025-12-06 - IA - Melhorada UX com animações de entrada e uso de Card component.
 *   - 2025-12-06 - IA - Substituídos emojis por ícones Lucide com coloração da identidade visual.
 */
const HomeScreen: React.FC<AppScreenProps<'Home'>> = ({ navigation }) => {
  const { usuario } = useAuth();

  // Animações de entrada
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const welcomeTranslateY = useRef(new Animated.Value(20)).current;

  const menuItems = useMemo(
    () => [
      {
        Icon: Calendar,
        iconColor: theme.colors.primary,
        title: 'Agendar Consulta',
        description: 'Agende sua consulta médica',
        route: 'Schedule' as const,
        accessibilityLabel: 'Ir para agendamento de consulta',
        accessibilityHint:
          'Abre a tela para escolher especialidade, profissional e horário',
      },
      {
        Icon: ClipboardList,
        iconColor: theme.colors.warning,
        title: 'Histórico',
        description: 'Veja suas consultas agendadas e passadas',
        route: 'History' as const,
        accessibilityLabel: 'Ver histórico de consultas',
        accessibilityHint:
          'Abre a tela com consultas agendadas, realizadas e canceladas',
      },
      {
        Icon: Megaphone,
        iconColor: theme.colors.primary,
        title: 'Notícias e Campanhas',
        description: 'Fique por dentro das campanhas de saúde',
        route: 'News' as const,
        accessibilityLabel: 'Abrir notícias e campanhas de saúde',
        accessibilityHint: 'Lista campanhas e notícias disponíveis',
      },
      {
        Icon: Pill,
        iconColor: theme.colors.error,
        title: 'Farmácias de Plantão',
        description: 'Encontre farmácias abertas 24 horas',
        route: 'Pharmacies' as const,
        accessibilityLabel: 'Ver farmácias de plantão',
        accessibilityHint: 'Mostra farmácias abertas e contatos',
      },
      {
        Icon: Syringe,
        iconColor: theme.colors.secondary,
        title: 'Medicamentos',
        description: 'Informações sobre medicamentos disponíveis',
        route: 'Medications' as const,
        accessibilityLabel: 'Consultar medicamentos disponíveis',
        accessibilityHint: 'Exibe lista de medicamentos e dosagens',
      },
      {
        Icon: UserCircle,
        iconColor: theme.colors.primary,
        title: 'Perfil',
        description: 'Visualize e edite seus dados',
        route: 'Profile' as const,
        accessibilityLabel: 'Acessar perfil do usuário',
        accessibilityHint: 'Mostra dados do perfil e permite editar',
      },
    ],
    []
  );

  const menuAnimations = React.useMemo(
    () =>
      menuItems.map(() => ({
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(20),
      })),
    [menuItems]
  );

  useEffect(() => {
    // Animar welcome section
    Animated.parallel([
      fadeIn(welcomeOpacity, 300),
      slideUp(welcomeTranslateY, 20, 300),
    ]).start();

    // Animar menu items com stagger
    menuAnimations.forEach((anim, index) => {
      staggerFadeIn(index, anim.opacity, 50, 250).start();
      Animated.timing(anim.translateY, {
        toValue: 0,
        duration: 250,
        delay: 50 * index,
        useNativeDriver: true,
      }).start();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.welcomeSection,
            {
              opacity: welcomeOpacity,
              transform: [{ translateY: welcomeTranslateY }],
            },
          ]}
        >
          <Text style={styles.welcomeText}>Bem-vindo(a),</Text>
          <Text style={styles.userName}>{usuario?.nome || 'Usuário'}</Text>
        </Animated.View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <Animated.View
              key={item.route}
              style={{
                opacity: menuAnimations[index].opacity,
                transform: [{ translateY: menuAnimations[index].translateY }],
              }}
            >
              <Card
                onPress={() => navigation.navigate(item.route)}
                style={styles.menuItem}
                accessibilityLabel={item.accessibilityLabel}
                accessibilityHint={item.accessibilityHint}
              >
                <View style={styles.menuItemHeader}>
                  <item.Icon
                    size={24}
                    {...({
                      style: { stroke: item.iconColor, strokeWidth: 2 },
                    } as unknown as Record<string, unknown>)}
                  />
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                </View>
                <Text style={styles.menuItemDescription}>
                  {item.description}
                </Text>
              </Card>
            </Animated.View>
          ))}
        </View>
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
  welcomeSection: {
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadow.small,
  },
  welcomeText: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  userName: {
    ...theme.typography.h1,
    color: theme.colors.primary,
  },
  menuSection: {
    gap: theme.spacing.md,
  },
  menuItem: {
    marginBottom: 0,
  },
  menuItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  menuItemTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    flex: 1,
  },
  menuItemDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
});

export default HomeScreen;
