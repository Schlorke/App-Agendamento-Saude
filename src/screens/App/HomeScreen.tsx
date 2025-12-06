import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../styles/theme';
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
 */
const HomeScreen: React.FC<AppScreenProps<'Home'>> = ({ navigation }) => {
  const { usuario } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Bem-vindo(a),</Text>
          <Text style={styles.userName}>{usuario?.nome || 'Usuário'}</Text>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Schedule')}
          >
            <Text style={styles.menuItemTitle}>📅 Agendar Consulta</Text>
            <Text style={styles.menuItemDescription}>
              Agende sua consulta médica
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('History')}
          >
            <Text style={styles.menuItemTitle}>📋 Histórico</Text>
            <Text style={styles.menuItemDescription}>
              Veja suas consultas agendadas e passadas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('News')}
          >
            <Text style={styles.menuItemTitle}>📰 Notícias e Campanhas</Text>
            <Text style={styles.menuItemDescription}>
              Fique por dentro das campanhas de saúde
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Pharmacies')}
          >
            <Text style={styles.menuItemTitle}>💊 Farmácias de Plantão</Text>
            <Text style={styles.menuItemDescription}>
              Encontre farmácias abertas 24 horas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Medications')}
          >
            <Text style={styles.menuItemTitle}>💉 Medicamentos</Text>
            <Text style={styles.menuItemDescription}>
              Informações sobre medicamentos disponíveis
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.menuItemTitle}>👤 Perfil</Text>
            <Text style={styles.menuItemDescription}>
              Visualize e edite seus dados
            </Text>
          </TouchableOpacity>
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
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadow.medium,
  },
  menuItemTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  menuItemDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
});

export default HomeScreen;
