import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import RegisterViewModel from '../../viewmodels/RegisterViewModel';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { theme } from '../../styles/theme';
import { formatCPF } from '../../utils/validation';
import type { AuthScreenProps } from '../../navigation/types';

/**
 * @component RegisterScreen
 * @description Tela de cadastro de novos usuários. Permite criar uma conta com validação completa de dados.
 *
 * @props
 *   - `navigation`: {AuthScreenProps<'Register'>} - Objeto de navegação do React Navigation, permite navegar para outras telas do AuthStack.
 *
 * @state
 *   - `nome`: {string} - Nome completo do usuário sendo digitado.
 *   - `cpf`: {string} - CPF do usuário sendo digitado (formatação automática aplicada).
 *   - `dataNascimento`: {string} - Data de nascimento no formato DD/MM/YYYY.
 *   - `senha`: {string} - Senha do usuário sendo digitada.
 *   - `confirmarSenha`: {string} - Confirmação da senha para validação.
 *   - `telefone`: {string} - Telefone do usuário (opcional).
 *   - `endereco`: {string} - Endereço do usuário (opcional).
 *   - `nomeError`: {string} - Mensagem de erro do campo nome.
 *   - `cpfError`: {string} - Mensagem de erro do campo CPF.
 *   - `dataError`: {string} - Mensagem de erro do campo data de nascimento.
 *   - `senhaError`: {string} - Mensagem de erro do campo senha.
 *   - `confirmarSenhaError`: {string} - Mensagem de erro do campo confirmar senha.
 *   - `loading`: {boolean} - Indica se o processo de cadastro está em andamento.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Adicionado bloco de documentação JSDoc completo.
 *   - 2025-12-06 - IA - Alterado formato de data de nascimento para DD/MM/YYYY com formatação automática e conversão para YYYY-MM-DD antes de enviar ao ViewModel.
 */
const RegisterScreen: React.FC<AuthScreenProps<'Register'>> = ({
  navigation,
}) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');

  const [nomeError, setNomeError] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [dataError, setDataError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [confirmarSenhaError, setConfirmarSenhaError] = useState('');

  const [loading, setLoading] = useState(false);

  const { login: loginAuth } = useAuth();
  const viewModel = new RegisterViewModel();

  // Fix para scroll na web - aplica estilos CSS diretamente
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // Aplica estilos globais para garantir scroll
      const style = document.createElement('style');
      style.textContent = `
        body {
          overflow: hidden !important;
        }
        #root > div {
          height: 100vh !important;
          overflow: hidden !important;
        }
        [data-testid="scroll-view"],
        div[style*="overflow"] {
          overflow-y: auto !important;
          overflow-x: hidden !important;
          height: 100% !important;
          -webkit-overflow-scrolling: touch !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
  }, []);

  /**
   * Valida e formata o CPF enquanto o usuário digita
   */
  const handleCpfChange = (text: string) => {
    const cpfLimpo = text.replace(/\D/g, '');

    if (cpfLimpo.length <= 11) {
      setCpf(cpfLimpo);
      setCpfError('');

      if (cpfLimpo.length === 11) {
        setCpf(formatCPF(cpfLimpo));
      }
    }
  };

  /**
   * Formata data de nascimento enquanto o usuário digita (DD/MM/YYYY)
   */
  const handleDataChange = (text: string) => {
    const apenasNumeros = text.replace(/\D/g, '');

    let formatado = apenasNumeros;
    if (apenasNumeros.length >= 5) {
      formatado = `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2, 4)}/${apenasNumeros.slice(4, 8)}`;
    } else if (apenasNumeros.length >= 3) {
      formatado = `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2)}`;
    }

    if (formatado.length <= 10) {
      setDataNascimento(formatado);
      setDataError('');
    }
  };

  /**
   * Cadastra o novo usuário
   */
  const handleRegister = async () => {
    // Limpa erros anteriores
    setNomeError('');
    setCpfError('');
    setDataError('');
    setSenhaError('');
    setConfirmarSenhaError('');

    // Validações
    if (!nome || nome.trim().length === 0) {
      setNomeError('Nome é obrigatório');
      return;
    }

    if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
      setCpfError('CPF deve ter 11 dígitos');
      return;
    }

    if (!dataNascimento || dataNascimento.length !== 10) {
      setDataError('Data de nascimento é obrigatória');
      return;
    }

    // Converte DD/MM/YYYY para YYYY-MM-DD
    const partesData = dataNascimento.split('/');
    if (
      partesData.length !== 3 ||
      partesData[0].length !== 2 ||
      partesData[1].length !== 2 ||
      partesData[2].length !== 4
    ) {
      setDataError('Data de nascimento inválida');
      return;
    }
    const dataFormatada = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;

    if (!senha || senha.length < 6) {
      setSenhaError('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (senha !== confirmarSenha) {
      setConfirmarSenhaError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      // Limpa o CPF antes de enviar ao ViewModel
      const cpfLimpo = cpf.replace(/\D/g, '');

      const resultado = await viewModel.cadastrar({
        nome,
        cpf: cpfLimpo,
        dataNascimento: dataFormatada,
        senha,
        telefone: telefone || undefined,
        endereco: endereco || undefined,
      });

      if (resultado.success && resultado.usuario) {
        Alert.alert(
          'Cadastro realizado!',
          'Seu cadastro foi realizado com sucesso.',
          [
            {
              text: 'OK',
              onPress: async () => {
                // Faz login automático após cadastro
                await loginAuth(resultado.usuario!);
                // Navegação será feita automaticamente
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Erro no cadastro',
          resultado.error || 'Não foi possível realizar o cadastro'
        );

        if (resultado.error?.includes('CPF')) {
          setCpfError(resultado.error);
        } else if (resultado.error?.includes('senha')) {
          setSenhaError(resultado.error);
        }
      }
    } catch {
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao realizar o cadastro. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navega para a tela de login
   */
  const handleNavigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
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
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha os dados para se cadastrar</Text>

        <View style={styles.form}>
          <Input
            label="Nome Completo *"
            placeholder="Digite seu nome completo"
            value={nome}
            onChangeText={setNome}
            error={nomeError}
            autoCapitalize="words"
          />

          <Input
            label="CPF *"
            placeholder="000.000.000-00"
            value={cpf}
            onChangeText={handleCpfChange}
            error={cpfError}
            keyboardType="numeric"
            maxLength={14}
          />

          <Input
            label="Data de Nascimento *"
            placeholder="DD/MM/YYYY"
            value={dataNascimento}
            onChangeText={handleDataChange}
            error={dataError}
            keyboardType="numeric"
            maxLength={10}
          />

          <Input
            label="Telefone"
            placeholder="(00) 00000-0000"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />

          <Input
            label="Endereço"
            placeholder="Rua, número - Cidade, Estado"
            value={endereco}
            onChangeText={setEndereco}
            multiline
          />

          <Input
            label="Senha *"
            placeholder="Mínimo 6 caracteres"
            value={senha}
            onChangeText={setSenha}
            error={senhaError}
            secureTextEntry
            autoCapitalize="none"
          />

          <Input
            label="Confirmar Senha *"
            placeholder="Digite a senha novamente"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            error={confirmarSenhaError}
            secureTextEntry
            autoCapitalize="none"
          />

          <Button
            title="Cadastrar"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            fullWidth
            style={styles.registerButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <Text style={styles.loginLink} onPress={handleNavigateToLogin}>
              Entrar
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    ...(Platform.OS === 'web' && {
      position: 'relative',
      height: '100%',
    }),
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
  },
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
    marginTop: theme.spacing.xl,
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
  registerButton: {
    marginTop: theme.spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  loginText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  loginLink: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;
