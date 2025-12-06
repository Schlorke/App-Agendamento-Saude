import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Platform,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import ScheduleViewModel from '../../viewmodels/ScheduleViewModel';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { theme } from '../../styles/theme';
import type { AppScreenProps } from '../../navigation/types';
import type { Especialidade, Profissional } from '../../services/dataService';

/**
 * @component ScheduleScreen
 * @description Tela de agendamento de consultas médicas. Permite selecionar especialidade, profissional, data e horário.
 *
 * @props
 *   - `navigation`: {AppScreenProps<'Schedule'>} - Objeto de navegação do React Navigation, permite navegar para outras telas do AppStack.
 *
 * @state
 *   - `especialidades`: {Especialidade[]} - Lista de especialidades médicas disponíveis.
 *   - `profissionais`: {Profissional[]} - Lista de profissionais da especialidade selecionada.
 *   - `horarios`: {string[]} - Lista de horários disponíveis para a data selecionada.
 *   - `especialidadeSelecionada`: {string} - ID da especialidade selecionada.
 *   - `profissionalSelecionado`: {string} - ID do profissional selecionado.
 *   - `data`: {string} - Data selecionada no formato YYYY-MM-DD.
 *   - `horarioSelecionado`: {string} - Horário selecionado no formato HH:MM.
 *   - `mostrarPickerEspecialidade`: {boolean} - Controla exibição do picker de especialidades.
 *   - `mostrarPickerProfissional`: {boolean} - Controla exibição do picker de profissionais.
 *   - `mostrarPickerHorario`: {boolean} - Controla exibição do picker de horários.
 *   - `loading`: {boolean} - Indica se o processo de agendamento está em andamento.
 *   - `carregando`: {boolean} - Indica se dados estão sendo carregados (especialidades, profissionais, horários).
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Adicionado bloco de documentação JSDoc completo.
 *   - 2025-12-06 - IA - Corrigido display do dropdown: substituído map por FlatList para melhor performance, adicionado overflow hidden, sombras/elevation para z-index adequado, removida borda do último item da lista, e melhorada acessibilidade com labels apropriados.
 */
const ScheduleScreen: React.FC<AppScreenProps<'Schedule'>> = ({
  navigation,
}) => {
  const { usuario } = useAuth();
  const viewModel = new ScheduleViewModel();

  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [horarios, setHorarios] = useState<string[]>([]);

  const [especialidadeSelecionada, setEspecialidadeSelecionada] =
    useState<string>('');
  const [profissionalSelecionado, setProfissionalSelecionado] =
    useState<string>('');
  const [data, setData] = useState('');
  const [horarioSelecionado, setHorarioSelecionado] = useState('');

  const [mostrarPickerEspecialidade, setMostrarPickerEspecialidade] =
    useState(false);
  const [mostrarPickerProfissional, setMostrarPickerProfissional] =
    useState(false);
  const [mostrarPickerHorario, setMostrarPickerHorario] = useState(false);
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Carrega especialidades ao montar
  useEffect(() => {
    carregarEspecialidades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Carrega profissionais quando especialidade é selecionada
  useEffect(() => {
    if (especialidadeSelecionada) {
      carregarProfissionais(especialidadeSelecionada);
      setProfissionalSelecionado(''); // Reseta seleção de profissional
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [especialidadeSelecionada]);

  // Carrega horários quando profissional e data são selecionados
  useEffect(() => {
    if (profissionalSelecionado && data) {
      carregarHorarios(data, profissionalSelecionado);
      setHorarioSelecionado(''); // Reseta seleção de horário
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profissionalSelecionado, data]);

  const carregarEspecialidades = async () => {
    try {
      setCarregando(true);
      const especialidadesData = await viewModel.carregarEspecialidades();
      setEspecialidades(especialidadesData);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar as especialidades');
    } finally {
      setCarregando(false);
    }
  };

  const carregarProfissionais = async (especialidadeId: string) => {
    try {
      setCarregando(true);
      const profissionaisData =
        await viewModel.carregarProfissionais(especialidadeId);
      setProfissionais(profissionaisData);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os profissionais');
    } finally {
      setCarregando(false);
    }
  };

  const carregarHorarios = async (data: string, profissionalId: string) => {
    try {
      setCarregando(true);
      const horariosData = await viewModel.carregarHorariosDisponiveis(
        data,
        profissionalId
      );
      setHorarios(horariosData);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os horários');
    } finally {
      setCarregando(false);
    }
  };

  const handleAgendar = async () => {
    if (!usuario) {
      Alert.alert('Erro', 'Usuário não encontrado');
      return;
    }

    setLoading(true);

    try {
      const resultado = await viewModel.agendarConsulta({
        usuarioId: usuario.id,
        especialidadeId: especialidadeSelecionada,
        profissionalId: profissionalSelecionado,
        data,
        horario: horarioSelecionado,
      });

      if (resultado.success) {
        Alert.alert('Sucesso!', 'Consulta agendada com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              // Limpa o formulário
              setEspecialidadeSelecionada('');
              setProfissionalSelecionado('');
              setData('');
              setHorarioSelecionado('');
              navigation.navigate('History');
            },
          },
        ]);
      } else {
        Alert.alert(
          'Erro',
          resultado.error || 'Não foi possível agendar a consulta'
        );
      }
    } catch {
      Alert.alert('Erro', 'Ocorreu um erro ao agendar a consulta');
    } finally {
      setLoading(false);
    }
  };

  const especialidadeNome =
    especialidades.find((e) => e.id === especialidadeSelecionada)?.nome ||
    'Selecione uma especialidade';

  const profissionalNome =
    profissionais.find((p) => p.id === profissionalSelecionado)?.nome ||
    'Selecione um profissional';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.label}>Especialidade *</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() =>
              setMostrarPickerEspecialidade(!mostrarPickerEspecialidade)
            }
          >
            <Text
              style={[
                styles.pickerText,
                !especialidadeSelecionada && styles.pickerPlaceholder,
              ]}
            >
              {especialidadeNome}
            </Text>
          </TouchableOpacity>
          {mostrarPickerEspecialidade && (
            <View style={styles.pickerContainer}>
              <FlatList
                data={especialidades}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[
                      styles.pickerOption,
                      index === especialidades.length - 1 &&
                        styles.pickerOptionLast,
                    ]}
                    onPress={() => {
                      setEspecialidadeSelecionada(item.id);
                      setMostrarPickerEspecialidade(false);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Selecionar especialidade ${item.nome}`}
                  >
                    <Text style={styles.pickerOptionText}>{item.nome}</Text>
                  </TouchableOpacity>
                )}
                nestedScrollEnabled
              />
            </View>
          )}
        </Card>

        {especialidadeSelecionada && (
          <Card style={styles.card}>
            <Text style={styles.label}>Profissional *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() =>
                setMostrarPickerProfissional(!mostrarPickerProfissional)
              }
              disabled={!especialidadeSelecionada || carregando}
            >
              {carregando ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <Text
                  style={[
                    styles.pickerText,
                    !profissionalSelecionado && styles.pickerPlaceholder,
                  ]}
                >
                  {profissionalNome}
                </Text>
              )}
            </TouchableOpacity>
            {mostrarPickerProfissional && profissionais.length > 0 && (
              <View style={styles.pickerContainer}>
                <FlatList
                  data={profissionais}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      style={[
                        styles.pickerOption,
                        index === profissionais.length - 1 &&
                          styles.pickerOptionLast,
                      ]}
                      onPress={() => {
                        setProfissionalSelecionado(item.id);
                        setMostrarPickerProfissional(false);
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Selecionar profissional ${item.nome}`}
                    >
                      <Text style={styles.pickerOptionText}>{item.nome}</Text>
                      <Text style={styles.pickerOptionSubtext}>
                        CRM: {item.crm}
                      </Text>
                    </TouchableOpacity>
                  )}
                  nestedScrollEnabled
                />
              </View>
            )}
          </Card>
        )}

        {profissionalSelecionado && (
          <>
            <Card style={styles.card}>
              <Input
                label="Data *"
                placeholder="YYYY-MM-DD (ex: 2024-12-20)"
                value={data}
                onChangeText={setData}
                keyboardType="numeric"
                maxLength={10}
              />
            </Card>

            {data && horarios.length > 0 && (
              <Card style={styles.card}>
                <Text style={styles.label}>Horário *</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setMostrarPickerHorario(!mostrarPickerHorario)}
                >
                  <Text
                    style={[
                      styles.pickerText,
                      !horarioSelecionado && styles.pickerPlaceholder,
                    ]}
                  >
                    {horarioSelecionado || 'Selecione um horário'}
                  </Text>
                </TouchableOpacity>
                {mostrarPickerHorario && (
                  <View style={styles.pickerContainer}>
                    <FlatList
                      data={horarios}
                      keyExtractor={(item) => item}
                      renderItem={({ item, index }) => (
                        <TouchableOpacity
                          style={[
                            styles.pickerOption,
                            index === horarios.length - 1 &&
                              styles.pickerOptionLast,
                          ]}
                          onPress={() => {
                            setHorarioSelecionado(item);
                            setMostrarPickerHorario(false);
                          }}
                          accessibilityRole="button"
                          accessibilityLabel={`Selecionar horário ${item}`}
                        >
                          <Text style={styles.pickerOptionText}>{item}</Text>
                        </TouchableOpacity>
                      )}
                      nestedScrollEnabled
                    />
                  </View>
                )}
              </Card>
            )}
          </>
        )}

        {horarioSelecionado && (
          <Button
            title="Agendar Consulta"
            onPress={handleAgendar}
            loading={loading}
            disabled={loading}
            fullWidth
            style={styles.agendarButton}
          />
        )}
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
    gap: theme.spacing.md,
  },
  card: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    minHeight: 50,
    justifyContent: 'center',
  },
  pickerText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  pickerPlaceholder: {
    color: theme.colors.textSecondary,
  },
  pickerContainer: {
    marginTop: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    maxHeight: 200,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
      },
    }),
  },
  pickerOption: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pickerOptionLast: {
    borderBottomWidth: 0,
  },
  pickerOptionText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  pickerOptionSubtext: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  agendarButton: {
    marginTop: theme.spacing.lg,
  },
});

export default ScheduleScreen;
