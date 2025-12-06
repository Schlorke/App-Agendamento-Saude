import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import EditProfileViewModel from '../../viewmodels/EditProfileViewModel';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { theme } from '../../styles/theme';
import type { AppScreenProps } from '../../navigation/types';

/**
 * @component EditProfileScreen
 * @description Tela para editar informações do perfil do usuário. Permite editar telefone e endereço.
 *
 * @props
 *   - `navigation`: {AppScreenProps<'EditProfile'>} - Objeto de navegação do React Navigation.
 *
 * @state
 *   - `telefone`: {string} - Valor do campo telefone.
 *   - `endereco`: {string} - Valor do campo endereço.
 *   - `loading`: {boolean} - Indica se a atualização está em andamento.
 *   - `errors`: {object} - Objeto contendo erros de validação por campo.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Criação inicial do componente com suporte a edição de telefone e endereço.
 */
const EditProfileScreen: React.FC<AppScreenProps<'EditProfile'>> = ({
  navigation,
}) => {
  const { usuario, atualizarUsuario } = useAuth();
  const [telefone, setTelefone] = useState(usuario?.telefone || '');
  const [endereco, setEndereco] = useState(usuario?.endereco || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    telefone?: string;
    endereco?: string;
  }>({});

  const viewModel = new EditProfileViewModel();

  const handleSalvar = async () => {
    if (!usuario) {
      Alert.alert('Erro', 'Usuário não encontrado');
      return;
    }

    // Limpa erros anteriores
    setErrors({});

    try {
      setLoading(true);
      const resultado = await viewModel.atualizarPerfil(usuario.id, {
        telefone: telefone.trim(),
        endereco: endereco.trim(),
      });

      if (resultado.success && resultado.usuario) {
        // Atualiza o estado do usuário
        await atualizarUsuario(resultado.usuario);
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert(
          'Erro',
          resultado.error || 'Não foi possível atualizar o perfil'
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar o perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Input
            label="Telefone"
            value={telefone}
            onChangeText={setTelefone}
            placeholder="(11) 98765-4321"
            keyboardType="phone-pad"
            error={errors.telefone}
            autoCapitalize="none"
          />

          <Input
            label="Endereço"
            value={endereco}
            onChangeText={setEndereco}
            placeholder="Rua, número - Cidade, Estado"
            error={errors.endereco}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <View style={styles.actions}>
            <Button
              title="Salvar"
              onPress={handleSalvar}
              loading={loading}
              disabled={loading}
              fullWidth
            />
            <Button
              title="Cancelar"
              onPress={() => navigation.goBack()}
              variant="outline"
              fullWidth
              style={styles.cancelButton}
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  form: {
    gap: theme.spacing.md,
  },
  actions: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  cancelButton: {
    marginTop: theme.spacing.sm,
  },
});

export default EditProfileScreen;
