import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import LoginViewModel from '../../viewmodels/LoginViewModel';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { theme } from '../../styles/theme';
import { formatCPF } from '../../utils/validation';
import type { AuthScreenProps } from '../../navigation/types';

/**
 * @component LoginScreen
 * @description Tela de autenticação do aplicativo. Permite que usuários façam login usando CPF e senha.
 *
 * @props
 *   - `navigation`: {AuthScreenProps<'Login'>} - Objeto de navegação do React Navigation, permite navegar para outras telas do AuthStack.
 *
 * @state
 *   - `cpf`: {string} - CPF do usuário sendo digitado (formatação automática aplicada).
 *   - `senha`: {string} - Senha do usuário sendo digitada.
 *   - `cpfError`: {string} - Mensagem de erro relacionada ao campo CPF (vazia se não houver erro).
 *   - `senhaError`: {string} - Mensagem de erro relacionada ao campo senha (vazia se não houver erro).
 *   - `loading`: {boolean} - Indica se o processo de login está em andamento.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Adicionado bloco de documentação JSDoc completo.
 */
const LoginScreen: React.FC<AuthScreenProps<'Login'>> = ({ navigation }) => {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login: loginAuth } = useAuth();
  const viewModel = new LoginViewModel();

  /**
   * Valida e formata o CPF enquanto o usuário digita
   */
  const handleCpfChange = (text: string) => {
    // Remove caracteres não numéricos
    const cpfLimpo = text.replace(/\D/g, '');

    // Limita a 11 dígitos
    if (cpfLimpo.length <= 11) {
      setCpf(cpfLimpo);
      setCpfError('');

      // Formata o CPF quando tiver 11 dígitos
      if (cpfLimpo.length === 11) {
        setCpf(formatCPF(cpfLimpo));
      }
    }
  };

  /**
   * Faz o login do usuário
   */
  const handleLogin = async () => {
    // Limpa erros anteriores
    setCpfError('');
    setSenhaError('');

    // Validações básicas
    if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
      setCpfError('CPF deve ter 11 dígitos');
      return;
    }

    if (!senha) {
      setSenhaError('Senha é obrigatória');
      return;
    }

    setLoading(true);

    try {
      // Limpa o CPF antes de enviar ao ViewModel
      const cpfLimpo = cpf.replace(/\D/g, '');
      const resultado = await viewModel.login(cpfLimpo, senha);

      if (resultado.success && resultado.usuario) {
        // Faz login usando o hook de autenticação
        await loginAuth(resultado.usuario);
        // Navegação será feita automaticamente pelo Navigation
      } else {
        Alert.alert(
          'Erro no login',
          resultado.error || 'Credenciais inválidas'
        );
        if (resultado.error?.includes('CPF')) {
          setCpfError(resultado.error);
        } else {
          setSenhaError(resultado.error || 'Credenciais inválidas');
        }
      }
    } catch {
      Alert.alert('Erro', 'Ocorreu um erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navega para a tela de cadastro
   */
  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled={Platform.OS !== 'web'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Bem-vindo</Text>
          <Text style={styles.subtitle}>
            Faça login para agendar suas consultas
          </Text>

          <View style={styles.form}>
            <Input
              label="CPF"
              placeholder="000.000.000-00"
              value={cpf}
              onChangeText={handleCpfChange}
              error={cpfError}
              keyboardType="numeric"
              maxLength={14}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Input
              label="Senha"
              placeholder="Digite sua senha"
              value={senha}
              onChangeText={setSenha}
              error={senhaError}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Button
              title="Entrar"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              fullWidth
              style={styles.loginButton}
            />

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Não tem uma conta? </Text>
              <Text
                style={styles.registerLink}
                onPress={handleNavigateToRegister}
              >
                Cadastrar
              </Text>
            </View>
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
    ...(Platform.OS === 'web' && {
      height: '100vh' as unknown as number,
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
    ...(Platform.OS === 'web' && {
      minHeight: '100vh' as unknown as number,
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: theme.spacing.md,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },
  registerText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  registerLink: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;
