import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { useAuth } from '../../hooks/useAuth';
import EditProfileViewModel from '../../viewmodels/EditProfileViewModel';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import { theme } from '../../styles/theme';
import {
  formatTelefone,
  formatCPF,
  formatDataNascimento,
  formatDataParaEdicao,
  formatDataParaBanco,
} from '../../utils/validation';
import type { AppScreenProps } from '../../navigation/types';

/**
 * @component EditProfileScreen
 * @description Tela para editar informações do perfil do usuário. Permite editar nome, CPF, data de nascimento, telefone e endereço. Também permite excluir a conta.
 *
 * @props
 *   - `navigation`: {AppScreenProps<'EditProfile'>} - Objeto de navegação do React Navigation.
 *
 * @state
 *   - `nome`: {string} - Valor do campo nome.
 *   - `cpf`: {string} - Valor do campo CPF.
 *   - `dataNascimento`: {string} - Valor do campo data de nascimento (formato DD/MM/YYYY).
 *   - `telefone`: {string} - Valor do campo telefone.
 *   - `endereco`: {string} - Valor do campo endereço.
 *   - `loading`: {boolean} - Indica se a atualização está em andamento.
 *   - `errors`: {object} - Objeto contendo erros de validação por campo.
 *   - `toast`: {object} - Estado do toast de notificação (visible, type, message).
 *   - `showExcluirModal`: {boolean} - Controla a visibilidade do modal de confirmação de exclusão (usado na web).
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Criação inicial do componente com suporte a edição de telefone e endereço.
 *   - 2025-12-06 - IA - Adicionados campos para editar nome e CPF. Adicionada opção de excluir conta.
 *   - 2025-12-06 - IA - Corrigido problema de scroll travado na web/Chrome DevTools: o problema era `overflow: hidden` bloqueando o scroll. Solução: usar `overflowY: 'auto'` no container, `height: '100vh'` para viewport fixo, e `minHeight: '100%'` no scrollContent.
 *   - 2025-12-06 - IA - Adicionado campo de data de nascimento com formatação DD/MM/YYYY durante digitação e conversão automática para YYYY-MM-DD ao salvar.
 *   - 2025-12-06 - IA - Substituídos Alert.alert por Toast para feedback de sucesso/erro nas operações de atualização e exclusão de conta.
 *   - 2025-12-06 - IA - Corrigido problema de confirmação de exclusão na web usando Modal customizado ao invés de Alert.alert, mantendo Alert.alert nativo no mobile.
 *   - 2025-12-06 - IA - Melhorado modal de exclusão de conta: removida borda vermelha no topo e adicionado ícone de alerta (AlertTriangle) antes do título.
 *   - 2025-12-06 - IA - Adicionado useEffect para atualizar campos quando o usuário mudar, garantindo sincronização com dados atualizados do contexto. Garantido que alterações no perfil surtam efeito imediatamente em todas as telas do aplicativo.
 */
const EditProfileScreen: React.FC<AppScreenProps<'EditProfile'>> = ({
  navigation,
}) => {
  const { usuario, atualizarUsuario, logout } = useAuth();
  const [nome, setNome] = useState(usuario?.nome || '');
  const [cpf, setCpf] = useState(usuario?.cpf ? formatCPF(usuario.cpf) : '');
  const [dataNascimento, setDataNascimento] = useState(
    usuario?.dataNascimento ? formatDataParaEdicao(usuario.dataNascimento) : ''
  );
  const [telefone, setTelefone] = useState(usuario?.telefone || '');
  const [endereco, setEndereco] = useState(usuario?.endereco || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    nome?: string;
    cpf?: string;
    dataNascimento?: string;
    telefone?: string;
    endereco?: string;
  }>({});
  const [toast, setToast] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }>({
    visible: false,
    type: 'info',
    message: '',
  });
  const [showExcluirModal, setShowExcluirModal] = useState(false);

  /**
   * Atualiza os campos quando o usuário mudar
   * Isso garante que se o usuário for atualizado em outra tela,
   * os campos sejam atualizados aqui também
   */
  useEffect(() => {
    if (usuario) {
      setNome(usuario.nome || '');
      setCpf(usuario.cpf ? formatCPF(usuario.cpf) : '');
      setDataNascimento(
        usuario.dataNascimento
          ? formatDataParaEdicao(usuario.dataNascimento)
          : ''
      );
      setTelefone(usuario.telefone || '');
      setEndereco(usuario.endereco || '');
    }
  }, [usuario]);

  /**
   * Valida e formata o CPF enquanto o usuário digita
   */
  const handleCpfChange = (text: string) => {
    const cpfLimpo = text.replace(/\D/g, '');

    if (cpfLimpo.length <= 11) {
      setCpf(cpfLimpo);
      setErrors((prev) => ({ ...prev, cpf: '' }));

      if (cpfLimpo.length === 11) {
        setCpf(formatCPF(cpfLimpo));
      }
    }
  };

  /**
   * Formata a data de nascimento enquanto o usuário digita
   * Formato: DD/MM/YYYY
   */
  const handleDataNascimentoChange = (text: string) => {
    const dataFormatada = formatDataNascimento(text);
    setDataNascimento(dataFormatada);
    setErrors((prev) => ({ ...prev, dataNascimento: '' }));
  };

  /**
   * Formata o telefone enquanto o usuário digita
   * Formato: (00) 00000-0000 para celular ou (00) 0000-0000 para fixo
   */
  const handleTelefoneChange = (text: string) => {
    const telefoneFormatado = formatTelefone(text);
    setTelefone(telefoneFormatado);
  };

  const viewModel = new EditProfileViewModel();

  const handleSalvar = async () => {
    if (!usuario) {
      setToast({
        visible: true,
        type: 'error',
        message: 'Usuário não encontrado',
      });
      return;
    }

    // Limpa erros anteriores
    setErrors({});

    try {
      setLoading(true);
      // Converte data de DD/MM/YYYY para YYYY-MM-DD
      const dataNascimentoFormatada = dataNascimento
        ? formatDataParaBanco(dataNascimento)
        : undefined;

      const resultado = await viewModel.atualizarPerfil(usuario.id, {
        nome: nome.trim(),
        cpf: cpf,
        dataNascimento: dataNascimentoFormatada,
        telefone: telefone.trim(),
        endereco: endereco.trim(),
      });

      if (resultado.success && resultado.usuario) {
        // Atualiza o estado do usuário
        await atualizarUsuario(resultado.usuario);
        setToast({
          visible: true,
          type: 'success',
          message: 'Perfil atualizado com sucesso!',
        });

        // Navega de volta após um pequeno delay para o usuário ver o toast
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      } else {
        // Define erros específicos por campo
        if (resultado.error?.includes('Nome')) {
          setErrors((prev) => ({ ...prev, nome: resultado.error }));
        } else if (resultado.error?.includes('CPF')) {
          setErrors((prev) => ({ ...prev, cpf: resultado.error }));
        } else if (
          resultado.error?.includes('Data') ||
          resultado.error?.includes('nascimento')
        ) {
          setErrors((prev) => ({ ...prev, dataNascimento: resultado.error }));
        } else {
          setToast({
            visible: true,
            type: 'error',
            message: resultado.error || 'Não foi possível atualizar o perfil',
          });
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setToast({
        visible: true,
        type: 'error',
        message: 'Ocorreu um erro ao atualizar o perfil',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirConta = () => {
    if (!usuario) {
      return;
    }

    if (Platform.OS === 'web') {
      // Na web, usa Modal customizado pois Alert.alert pode não funcionar corretamente
      setShowExcluirModal(true);
    } else {
      // No mobile, usa Alert.alert nativo
      Alert.alert(
        'Excluir Conta',
        'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todas as suas consultas serão removidas.',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: confirmarExclusao,
          },
        ]
      );
    }
  };

  const confirmarExclusao = async () => {
    if (!usuario) {
      return;
    }

    // Fecha o modal se estiver aberto (web)
    if (showExcluirModal) {
      setShowExcluirModal(false);
    }

    try {
      setLoading(true);
      const resultado = await viewModel.excluirConta(usuario.id);

      if (resultado.success) {
        // Faz logout e redireciona para login
        await logout();
        // A navegação será feita automaticamente pelo Navigation
      } else {
        setToast({
          visible: true,
          type: 'error',
          message: resultado.error || 'Não foi possível excluir a conta',
        });
      }
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      setToast({
        visible: true,
        type: 'error',
        message: 'Ocorreu um erro ao excluir a conta',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fecha o toast
   */
  const handleToastDismiss = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
        alwaysBounceVertical={false}
        bounces={false}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          <View style={styles.form}>
            <Input
              label="Nome Completo *"
              value={nome}
              onChangeText={setNome}
              placeholder="Digite seu nome completo"
              error={errors.nome}
              autoCapitalize="words"
            />

            <Input
              label="CPF *"
              value={cpf}
              onChangeText={handleCpfChange}
              placeholder="000.000.000-00"
              error={errors.cpf}
              keyboardType="numeric"
              maxLength={14}
            />

            <Input
              label="Data de Nascimento *"
              value={dataNascimento}
              onChangeText={handleDataNascimentoChange}
              placeholder="DD/MM/YYYY"
              error={errors.dataNascimento}
              keyboardType="numeric"
              maxLength={10}
            />

            <Input
              label="Telefone"
              value={telefone}
              onChangeText={handleTelefoneChange}
              placeholder="(00) 00000-0000"
              keyboardType="phone-pad"
              error={errors.telefone}
              autoCapitalize="none"
              maxLength={15}
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
                title="Excluir Conta"
                onPress={handleExcluirConta}
                variant="outline"
                fullWidth
                style={styles.deleteButton}
                textStyle={styles.deleteButtonText}
                disabled={loading}
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
        </View>
      </ScrollView>

      <Toast
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        position="top"
        duration={3000}
        onDismiss={handleToastDismiss}
      />

      {Platform.OS === 'web' && (
        <Modal
          visible={showExcluirModal}
          variant="alert"
          title="Excluir Conta"
          message="Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todas as suas consultas serão removidas."
          icon={AlertTriangle}
          showTopBorder={false}
          primaryAction={{
            label: 'Excluir',
            onPress: confirmarExclusao,
          }}
          secondaryAction={{
            label: 'Cancelar',
            onPress: () => setShowExcluirModal(false),
          }}
          onClose={() => setShowExcluirModal(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    ...(Platform.OS === 'web' && {
      height: '100vh' as unknown as number,
      maxHeight: '100vh' as unknown as number,
      overflowY: 'auto',
      overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch',
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 3,
    minHeight: '100%',
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  form: {
    width: '100%',
    gap: theme.spacing.md,
  },
  actions: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  cancelButton: {
    // Sem margem extra - o gap do actions já cuida do espaçamento
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
  deleteButtonText: {
    color: theme.colors.error,
  },
});

export default EditProfileScreen;
