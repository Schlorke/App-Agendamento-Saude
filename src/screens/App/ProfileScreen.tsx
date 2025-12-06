import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import dataService from '../../services/dataService';
import { theme } from '../../styles/theme';
import { formatCPF } from '../../utils/validation';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import type { AppScreenProps } from '../../navigation/types';

/**
 * @component ProfileScreen
 * @description Tela de perfil do usuário. Exibe informações pessoais e permite editar perfil ou fazer logout.
 *
 * @props
 *   - `navigation`: {AppScreenProps<'Profile'>} - Objeto de navegação do React Navigation, permite navegar para EditProfileScreen.
 *
 * @state
 *   - `showLogoutModal`: {boolean} - Controla a visibilidade do modal de confirmação de logout (usado na web).
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Adicionado bloco de documentação JSDoc completo.
 *   - 2024-01-15 - IA - Implementada navegação para EditProfileScreen.
 *   - 2025-12-06 - IA - Corrigido problema de logout na web usando Modal ao invés de Alert.alert.
 *   - 2025-12-06 - IA - Corrigido exibição do CPF para sempre formatar antes de mostrar. Adicionado useFocusEffect para recarregar dados do usuário quando a tela receber foco, garantindo que alterações feitas em EditProfile sejam refletidas imediatamente.
 */
const ProfileScreen: React.FC<AppScreenProps<'Profile'>> = ({ navigation }) => {
  const { usuario, logout, atualizarUsuario } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  /**
   * Recarrega os dados do usuário quando a tela receber foco
   * Isso garante que qualquer alteração feita em EditProfile seja refletida aqui
   */
  useFocusEffect(
    useCallback(() => {
      const recarregarUsuario = async () => {
        if (usuario?.id) {
          try {
            const usuarioAtualizado = await dataService.buscarUsuarioPorId(
              usuario.id
            );
            if (usuarioAtualizado) {
              await atualizarUsuario(usuarioAtualizado);
            }
          } catch (error) {
            console.error('Erro ao recarregar usuário:', error);
          }
        }
      };
      recarregarUsuario();
    }, [usuario, atualizarUsuario])
  );

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      // Na web, usa Modal customizado pois Alert.alert pode não funcionar corretamente
      setShowLogoutModal(true);
    } else {
      // No mobile, usa Alert.alert nativo
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
    }
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {usuario?.nome?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <Text style={styles.userName}>{usuario?.nome || 'Usuário'}</Text>
            <Text style={styles.userCPF}>
              CPF: {usuario?.cpf ? formatCPF(usuario.cpf) : 'N/A'}
            </Text>
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
              onPress={() => navigation.navigate('EditProfile')}
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

      {Platform.OS === 'web' && (
        <Modal
          visible={showLogoutModal}
          variant="confirm"
          title="Sair"
          message="Tem certeza que deseja sair?"
          primaryAction={{
            label: 'Sair',
            onPress: confirmLogout,
          }}
          secondaryAction={{
            label: 'Cancelar',
            onPress: () => setShowLogoutModal(false),
          }}
          onClose={() => setShowLogoutModal(false)}
        />
      )}
    </>
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
