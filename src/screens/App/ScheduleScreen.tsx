/**
 * @component ScheduleScreen
 * @description Tela de agendamento de consultas médicas com calendário moderno e inteligente.
 * Permite selecionar especialidade, profissional, data via calendário e horário.
 *
 * @props
 *   - `navigation`: {AppScreenProps<'Schedule'>} - Objeto de navegação do React Navigation.
 *
 * @state
 *   - `especialidades`: {Especialidade[]} - Lista de especialidades médicas disponíveis.
 *   - `profissionais`: {Profissional[]} - Lista de profissionais da especialidade selecionada.
 *   - `horarios`: {string[]} - Lista de horários disponíveis para a data selecionada.
 *   - `especialidadeSelecionada`: {string} - ID da especialidade selecionada.
 *   - `profissionalSelecionado`: {string} - ID do profissional selecionado.
 *   - `dataSelecionada`: {Date | null} - Data selecionada no calendário.
 *   - `horarioSelecionado`: {string} - Horário selecionado no formato HH:MM.
 *   - `mostrarPickerEspecialidade`: {boolean} - Controla exibição do picker de especialidades.
 *   - `mostrarPickerProfissional`: {boolean} - Controla exibição do picker de profissionais.
 *   - `mostrarPickerHorario`: {boolean} - Controla exibição do picker de horários.
 *   - `mostrarCalendario`: {boolean} - Controla exibição do calendário.
 *   - `loading`: {boolean} - Indica se o processo de agendamento está em andamento.
 *   - `carregando`: {boolean} - Indica se dados estão sendo carregados.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Adicionado bloco de documentação JSDoc completo.
 *   - 2025-12-06 - IA - Corrigido display do dropdown: substituído map por FlatList para melhor performance.
 *   - 2025-12-06 - IA - Refatoração completa: removido ScrollView que causava erro de VirtualizedList, implementado calendário moderno, melhorada UX/UI com animações e formatação de data para dia/mês/ano.
 *   - 2025-12-06 - IA - Corrigido problema de scroll: adicionado ScrollView dentro do KeyboardAvoidingView com keyboardShouldPersistTaps="handled" para permitir scroll quando o teclado está aberto, tanto no navegador quanto no dispositivo móvel.
 *   - 2025-12-06 - IA - Corrigido artefato visual: removida borda inferior da última opção nos pickers de especialidade, profissional e horário para melhorar a aparência visual dos diálogos de agendamento.
 *   - 2025-12-06 - IA - Corrigido scroll e artefatos visuais nas modais: substituído View por ScrollView em todos os pickers (especialidade, profissional e horário) para permitir scroll funcional. Adicionado overflow: 'hidden' no pickerModal e ajustes nos estilos para eliminar artefatos visuais.
 *   - 2025-12-06 - IA - Implementado sistema de Toast para feedback de agendamento: substituído Alert.alert por Toast component para melhor UX. Adicionados logs de debug para verificar salvamento de agendamentos. Toast exibe mensagens de sucesso/erro com animações suaves.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Calendar, Clock, ChevronDown, X } from 'lucide-react-native';
import { useAuth } from '../../hooks/useAuth';
import ScheduleViewModel from '../../viewmodels/ScheduleViewModel';
import Button from '../../components/Button';
import Card from '../../components/Card';
import CalendarComponent from '../../components/Calendar';
import Toast from '../../components/Toast';
import { theme } from '../../styles/theme';
import { fadeIn, slideUp } from '../../utils/animations';
import type { AppScreenProps } from '../../navigation/types';
import type { Especialidade, Profissional } from '../../services/dataService';

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
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');

  const [mostrarPickerEspecialidade, setMostrarPickerEspecialidade] =
    useState(false);
  const [mostrarPickerProfissional, setMostrarPickerProfissional] =
    useState(false);
  const [mostrarPickerHorario, setMostrarPickerHorario] = useState(false);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Estado para Toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

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
      setDataSelecionada(null); // Reseta data
      setHorarioSelecionado(''); // Reseta horário
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [especialidadeSelecionada]);

  // Carrega horários quando profissional e data são selecionados
  useEffect(() => {
    if (profissionalSelecionado && dataSelecionada) {
      const dataFormatada = formatarDataParaAPI(dataSelecionada);
      carregarHorarios(dataFormatada, profissionalSelecionado);
      setHorarioSelecionado(''); // Reseta seleção de horário
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profissionalSelecionado, dataSelecionada]);

  // Anima abertura do calendário
  useEffect(() => {
    if (mostrarCalendario) {
      fadeAnim.setValue(0);
      slideAnim.setValue(20);
      Animated.parallel([
        fadeIn(fadeAnim, 250),
        slideUp(slideAnim, 20, 250),
      ]).start();
    }
  }, [mostrarCalendario, fadeAnim, slideAnim]);

  const carregarEspecialidades = async () => {
    try {
      setCarregando(true);
      const especialidadesData = await viewModel.carregarEspecialidades();
      setEspecialidades(especialidadesData);
    } catch {
      setToastMessage('Não foi possível carregar as especialidades');
      setToastType('error');
      setToastVisible(true);
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
      setToastMessage('Não foi possível carregar os profissionais');
      setToastType('error');
      setToastVisible(true);
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
      setToastMessage('Não foi possível carregar os horários');
      setToastType('error');
      setToastVisible(true);
    } finally {
      setCarregando(false);
    }
  };

  // Formata data para exibição (DD/MM/YYYY)
  const formatarDataParaExibicao = (date: Date | null): string => {
    if (!date) return 'Selecione uma data';
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  // Formata data para API (YYYY-MM-DD)
  const formatarDataParaAPI = (date: Date): string => {
    const ano = date.getFullYear();
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const dia = date.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  const handleDataSelecionada = (date: Date) => {
    setDataSelecionada(date);
    setMostrarCalendario(false);
  };

  const handleAgendar = async () => {
    if (!usuario) {
      setToastMessage('Usuário não encontrado');
      setToastType('error');
      setToastVisible(true);
      return;
    }

    if (!dataSelecionada) {
      setToastMessage('Selecione uma data');
      setToastType('error');
      setToastVisible(true);
      return;
    }

    setLoading(true);

    try {
      console.log('Iniciando agendamento...', {
        usuarioId: usuario.id,
        especialidadeId: especialidadeSelecionada,
        profissionalId: profissionalSelecionado,
        data: formatarDataParaAPI(dataSelecionada),
        horario: horarioSelecionado,
      });

      const resultado = await viewModel.agendarConsulta({
        usuarioId: usuario.id,
        especialidadeId: especialidadeSelecionada,
        profissionalId: profissionalSelecionado,
        data: formatarDataParaAPI(dataSelecionada),
        horario: horarioSelecionado,
      });

      console.log('Resultado do agendamento:', resultado);

      if (resultado.success) {
        console.log('Consulta agendada com sucesso:', resultado.consulta);
        setToastMessage('Consulta agendada com sucesso!');
        setToastType('success');
        setToastVisible(true);

        // Limpa o formulário após um pequeno delay para o toast aparecer
        setTimeout(() => {
          setEspecialidadeSelecionada('');
          setProfissionalSelecionado('');
          setDataSelecionada(null);
          setHorarioSelecionado('');
          navigation.navigate('History');
        }, 2000);
      } else {
        console.error('Erro ao agendar:', resultado.error);
        setToastMessage(
          resultado.error || 'Não foi possível agendar a consulta'
        );
        setToastType('error');
        setToastVisible(true);
      }
    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
      setToastMessage('Ocorreu um erro ao agendar a consulta');
      setToastType('error');
      setToastVisible(true);
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

  // Renderiza picker de especialidades
  const renderPickerEspecialidade = () => (
    <Modal
      visible={mostrarPickerEspecialidade}
      transparent
      animationType="none"
      onRequestClose={() => setMostrarPickerEspecialidade(false)}
    >
      <TouchableWithoutFeedback
        onPress={() => setMostrarPickerEspecialidade(false)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.pickerModal}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>
                  Selecione a Especialidade
                </Text>
                <TouchableOpacity
                  onPress={() => setMostrarPickerEspecialidade(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Fechar"
                >
                  <X size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              <ScrollView
                style={styles.pickerList}
                contentContainerStyle={styles.pickerListContent}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {especialidades.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.pickerOption,
                      index === especialidades.length - 1 &&
                        styles.pickerOptionLast,
                      especialidadeSelecionada === item.id &&
                        styles.pickerOptionSelected,
                    ]}
                    onPress={() => {
                      setEspecialidadeSelecionada(item.id);
                      setMostrarPickerEspecialidade(false);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Selecionar especialidade ${item.nome}`}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        especialidadeSelecionada === item.id &&
                          styles.pickerOptionTextSelected,
                      ]}
                    >
                      {item.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  // Renderiza picker de profissionais
  const renderPickerProfissional = () => (
    <Modal
      visible={mostrarPickerProfissional}
      transparent
      animationType="none"
      onRequestClose={() => setMostrarPickerProfissional(false)}
    >
      <TouchableWithoutFeedback
        onPress={() => setMostrarPickerProfissional(false)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.pickerModal}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Selecione o Profissional</Text>
                <TouchableOpacity
                  onPress={() => setMostrarPickerProfissional(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Fechar"
                >
                  <X size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              <ScrollView
                style={styles.pickerList}
                contentContainerStyle={styles.pickerListContent}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {profissionais.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.pickerOption,
                      index === profissionais.length - 1 &&
                        styles.pickerOptionLast,
                      profissionalSelecionado === item.id &&
                        styles.pickerOptionSelected,
                    ]}
                    onPress={() => {
                      setProfissionalSelecionado(item.id);
                      setMostrarPickerProfissional(false);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Selecionar profissional ${item.nome}`}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        profissionalSelecionado === item.id &&
                          styles.pickerOptionTextSelected,
                      ]}
                    >
                      {item.nome}
                    </Text>
                    <Text style={styles.pickerOptionSubtext}>
                      CRM: {item.crm}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  // Renderiza picker de horários
  const renderPickerHorario = () => (
    <Modal
      visible={mostrarPickerHorario}
      transparent
      animationType="none"
      onRequestClose={() => setMostrarPickerHorario(false)}
    >
      <TouchableWithoutFeedback onPress={() => setMostrarPickerHorario(false)}>
        <View style={styles.modalBackdrop}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.pickerModal}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Selecione o Horário</Text>
                <TouchableOpacity
                  onPress={() => setMostrarPickerHorario(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Fechar"
                >
                  <X size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              <ScrollView
                style={styles.pickerList}
                contentContainerStyle={styles.pickerListContent}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {horarios.length === 0 ? (
                  <View style={styles.pickerEmpty}>
                    <Text style={styles.pickerEmptyText}>
                      Nenhum horário disponível para esta data
                    </Text>
                  </View>
                ) : (
                  horarios.map((item, index) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.pickerOption,
                        index === horarios.length - 1 &&
                          styles.pickerOptionLast,
                        horarioSelecionado === item &&
                          styles.pickerOptionSelected,
                      ]}
                      onPress={() => {
                        setHorarioSelecionado(item);
                        setMostrarPickerHorario(false);
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Selecionar horário ${item}`}
                    >
                      <View style={styles.horarioOption}>
                        <Clock size={18} color={theme.colors.primary} />
                        <Text
                          style={[
                            styles.pickerOptionText,
                            horarioSelecionado === item &&
                              styles.pickerOptionTextSelected,
                          ]}
                        >
                          {item}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Especialidade */}
        <Card style={styles.card}>
          <Text style={styles.label}>Especialidade *</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() =>
              setMostrarPickerEspecialidade(!mostrarPickerEspecialidade)
            }
            accessibilityRole="button"
            accessibilityLabel="Selecionar especialidade"
          >
            <Text
              style={[
                styles.pickerText,
                !especialidadeSelecionada && styles.pickerPlaceholder,
              ]}
            >
              {especialidadeNome}
            </Text>
            <ChevronDown
              size={20}
              color={
                especialidadeSelecionada
                  ? theme.colors.text
                  : theme.colors.textSecondary
              }
            />
          </TouchableOpacity>
        </Card>

        {/* Profissional */}
        {especialidadeSelecionada && (
          <Card style={styles.card}>
            <Text style={styles.label}>Profissional *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() =>
                setMostrarPickerProfissional(!mostrarPickerProfissional)
              }
              disabled={!especialidadeSelecionada || carregando}
              accessibilityRole="button"
              accessibilityLabel="Selecionar profissional"
            >
              {carregando ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <>
                  <Text
                    style={[
                      styles.pickerText,
                      !profissionalSelecionado && styles.pickerPlaceholder,
                    ]}
                  >
                    {profissionalNome}
                  </Text>
                  <ChevronDown
                    size={20}
                    color={
                      profissionalSelecionado
                        ? theme.colors.text
                        : theme.colors.textSecondary
                    }
                  />
                </>
              )}
            </TouchableOpacity>
          </Card>
        )}

        {/* Data */}
        {profissionalSelecionado && (
          <Card style={styles.card}>
            <Text style={styles.label}>Data *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setMostrarCalendario(true)}
              accessibilityRole="button"
              accessibilityLabel="Selecionar data"
              accessibilityHint="Abre o calendário para seleção de data"
            >
              <View style={styles.dateButtonContent}>
                <Calendar
                  size={20}
                  color={
                    dataSelecionada
                      ? theme.colors.primary
                      : theme.colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.pickerText,
                    !dataSelecionada && styles.pickerPlaceholder,
                  ]}
                >
                  {formatarDataParaExibicao(dataSelecionada)}
                </Text>
              </View>
            </TouchableOpacity>
          </Card>
        )}

        {/* Horário */}
        {dataSelecionada && horarios.length > 0 && (
          <Card style={styles.card}>
            <Text style={styles.label}>Horário *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setMostrarPickerHorario(!mostrarPickerHorario)}
              accessibilityRole="button"
              accessibilityLabel="Selecionar horário"
            >
              <View style={styles.dateButtonContent}>
                <Clock
                  size={20}
                  color={
                    horarioSelecionado
                      ? theme.colors.primary
                      : theme.colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.pickerText,
                    !horarioSelecionado && styles.pickerPlaceholder,
                  ]}
                >
                  {horarioSelecionado || 'Selecione um horário'}
                </Text>
                <ChevronDown
                  size={20}
                  color={
                    horarioSelecionado
                      ? theme.colors.text
                      : theme.colors.textSecondary
                  }
                />
              </View>
            </TouchableOpacity>
          </Card>
        )}

        {/* Botão de Agendar */}
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

        {/* Modais de Picker */}
        {renderPickerEspecialidade()}
        {renderPickerProfissional()}
        {renderPickerHorario()}

        {/* Toast de Notificação */}
        <Toast
          visible={toastVisible}
          type={toastType}
          message={toastMessage}
          position="top"
          duration={3000}
          onDismiss={() => setToastVisible(false)}
        />

        {/* Modal do Calendário */}
        <Modal
          visible={mostrarCalendario}
          transparent
          animationType="none"
          onRequestClose={() => setMostrarCalendario(false)}
        >
          <TouchableWithoutFeedback onPress={() => setMostrarCalendario(false)}>
            <View style={styles.modalBackdrop}>
              <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                <Animated.View
                  style={[
                    styles.calendarModal,
                    {
                      opacity: fadeAnim,
                      transform: [{ translateY: slideAnim }],
                    },
                  ]}
                >
                  <View style={styles.calendarHeader}>
                    <Text style={styles.calendarTitle}>Selecione a Data</Text>
                    <TouchableOpacity
                      onPress={() => setMostrarCalendario(false)}
                      accessibilityRole="button"
                      accessibilityLabel="Fechar calendário"
                    >
                      <X size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                  </View>
                  <CalendarComponent
                    selectedDate={dataSelecionada}
                    onDateSelect={handleDataSelecionada}
                    minDate={new Date()}
                    maxDate={
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() + 1)
                      )
                    }
                  />
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
  scrollContent: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl * 2,
  },
  card: {
    marginBottom: 0,
  },
  label: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    minHeight: 50,
  },
  pickerText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  pickerPlaceholder: {
    color: theme.colors.textSecondary,
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  agendarButton: {
    marginTop: theme.spacing.md,
  },
  // Estilos para modais de picker
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  pickerModal: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
    overflow: 'hidden',
    ...theme.shadow.large,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pickerTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  pickerList: {
    maxHeight: 400,
  },
  pickerListContent: {
    paddingBottom: 0,
  },
  pickerOption: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pickerOptionLast: {
    borderBottomWidth: 0,
  },
  pickerOptionSelected: {
    backgroundColor: theme.colors.primaryLight + '20',
  },
  pickerOptionText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  pickerOptionTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  pickerOptionSubtext: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  pickerEmpty: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderBottomWidth: 0,
  },
  pickerEmptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  horarioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  // Estilos para modal do calendário
  calendarModal: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    width: '100%',
    maxWidth: 400,
    padding: theme.spacing.md,
    ...theme.shadow.large,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  calendarTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
});

export default ScheduleScreen;
