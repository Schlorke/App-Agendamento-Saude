import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../styles/theme';
import Button from '../../components/Button';
import type { AppScreenProps } from '../../navigation/types';

/**
 * @component ProfileScreen
 * @description Tela de perfil do usuário. Exibe informações pessoais e permite editar perfil ou fazer logout.
 *
 * @props
 *   - Nenhuma prop direta. Utiliza apenas o hook `useAuth` para obter dados do usuário e função de logout.
 *
 * @state
 *   - Nenhum estado interno. Componente puramente apresentacional que exibe dados do usuário.
 *
 * @known_issues
 *   - Funcionalidade de edição de perfil ainda não implementada (RF09 - Próxima funcionalidade).
 *
 * @changelog
 *   - 2024-01-15 - IA - Adicionado bloco de documentação JSDoc completo.
 */
const ProfileScreen: React.FC<AppScreenProps<'Profile'>> = () => {
  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {usuario?.nome?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{usuario?.nome || 'Usuário'}</Text>
          <Text style={styles.userCPF}>CPF: {usuario?.cpf || 'N/A'}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Data de Nascimento</Text>
            <Text style={styles.infoValue}>
              {usuario?.dataNascimento
                ? new Date(usuario.dataNascimento).toLocaleDateString('pt-BR')
                : 'N/A'}
            </Text>
          </View>

          {usuario?.telefone && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Telefone</Text>
              <Text style={styles.infoValue}>{usuario.telefone}</Text>
            </View>
          )}

          {usuario?.endereco && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Endereço</Text>
              <Text style={styles.infoValue}>{usuario.endereco}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionsSection}>
          <Button
            title="Editar Perfil"
            onPress={() => {
              // TODO: Implementar edição de perfil (RF09)
              Alert.alert(
                'Em breve',
                'A funcionalidade de edição será implementada em breve.'
              );
            }}
            variant="outline"
            fullWidth
          />

          <Button
            title="Sair"
            onPress={handleLogout}
            variant="outline"
            fullWidth
            style={styles.logoutButton}
          />
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
  profileSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadow.small,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    ...theme.typography.h1,
    color: theme.colors.textLight,
  },
  userName: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userCPF: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  infoSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadow.small,
  },
  infoItem: {
    marginBottom: theme.spacing.md,
  },
  infoLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  infoValue: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  actionsSection: {
    gap: theme.spacing.md,
  },
  logoutButton: {
    marginTop: theme.spacing.md,
  },
});

export default ProfileScreen;
