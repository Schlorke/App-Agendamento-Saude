import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { useAuth } from '../../hooks/useAuth';
import dataService from '../../services/dataService';
import CancelAppointmentViewModel from '../../viewmodels/CancelAppointmentViewModel';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';
import Skeleton from '../../components/Skeleton';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';
import { theme } from '../../styles/theme';
import type { AppScreenProps } from '../../navigation/types';
import type { Consulta, Profissional } from '../../services/dataService';
import db from '../../data/db.json';

/**
 * @component HistoryScreen
 * @description Tela de histórico de consultas do usuário. Exibe consultas passadas e futuras com filtros por status.
 *
 * @props
 *   - Nenhuma prop direta. Utiliza apenas o hook `useAuth` para obter dados do usuário.
 *
 * @state
 *   - `consultas`: {Consulta[]} - Lista de todas as consultas do usuário.
 *   - `loading`: {boolean} - Indica se as consultas estão sendo carregadas.
 *   - `filtro`: {'todas' | 'agendadas' | 'realizadas' | 'canceladas'} - Filtro ativo para exibir consultas por status.
 *   - `cancelandoId`: {string | null} - ID da consulta que está sendo cancelada no momento.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Adicionado bloco de documentação JSDoc completo.
 *   - 2025-12-06 - IA - Adicionadas labels e hints de acessibilidade nos filtros de histórico.
 *   - 2025-12-06 - IA - Corrigido cancelamento de consultas: substituído Alert.alert por Toast, adicionados logs de debug, corrigida criação de nova referência do objeto ao cancelar para garantir que React detecte mudanças. Agora o cancelamento persiste corretamente e a lista é recarregada automaticamente.
 *   - 2025-12-06 - IA - Corrigido problema crítico de cancelamento: substituído Alert.alert (que não funciona bem na web) por Modal customizado do design system. Agora o modal de confirmação aparece corretamente e a consulta cancelada é removida imediatamente da lista quando o filtro está em "agendadas", garantindo feedback visual instantâneo.
 *   - 2025-12-06 - IA - Ajustado modal de cancelamento: removida borda vermelha no topo e simplificados textos dos botões para "Não" e "Sim".
 */
const HistoryScreen: React.FC<AppScreenProps<'History'>> = () => {
  const { usuario } = useAuth();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<
    'todas' | 'agendadas' | 'realizadas' | 'canceladas'
  >('agendadas');
  const [cancelandoId, setCancelandoId] = useState<string | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Estado para Modal de confirmação
  const [modalCancelarVisible, setModalCancelarVisible] = useState(false);
  const [consultaParaCancelar, setConsultaParaCancelar] =
    useState<Consulta | null>(null);

  // Estado para Toast
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');

  const cancelViewModel = new CancelAppointmentViewModel();

  // Mapa de profissionais para buscar nomes por ID
  const profissionaisMap = React.useMemo(() => {
    const map = new Map<string, string>();
    (db as { profissionais: Profissional[] }).profissionais.forEach((p) => {
      map.set(p.id, p.nome);
    });
    return map;
  }, []);

  useEffect(() => {
    carregarConsultas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  // Debug: monitora mudanças no estado do modal
  useEffect(() => {
    console.log('🔍 Estado do modal mudou:', {
      modalCancelarVisible,
      consultaParaCancelar: consultaParaCancelar?.id,
    });
  }, [modalCancelarVisible, consultaParaCancelar]);

  const carregarConsultas = async () => {
    if (!usuario) return;

    try {
      setLoading(true);
      const consultasDoUsuario = await dataService.buscarConsultasPorUsuario(
        usuario.id
      );
      console.log('Consultas carregadas:', consultasDoUsuario);
      console.log(
        'Consultas agendadas:',
        consultasDoUsuario.filter((c) => c.status === 'agendada')
      );
      setConsultas(consultasDoUsuario);
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    } finally {
      setLoading(false);
    }
  };

  const consultasFiltradas = useMemo(() => {
    console.log('🔄 Recalculando filtro. Total consultas:', consultas.length);
    console.log('Filtro ativo:', filtro);
    console.log('Force update:', forceUpdate);
    const filtradas = consultas.filter((consulta) => {
      if (filtro === 'todas') return true;
      // Mapear filtros (plural) para status (singular)
      const statusMap: Record<
        'agendadas' | 'realizadas' | 'canceladas',
        'agendada' | 'realizada' | 'cancelada'
      > = {
        agendadas: 'agendada',
        realizadas: 'realizada',
        canceladas: 'cancelada',
      };
      const statusEsperado = statusMap[filtro as keyof typeof statusMap];
      const resultado = consulta.status === statusEsperado;
      return resultado;
    });
    console.log('✅ Consultas filtradas:', filtradas.length);
    console.log(
      '✅ IDs das consultas filtradas:',
      filtradas.map((c) => c.id)
    );
    return filtradas;
  }, [consultas, filtro, forceUpdate]);

  const formatarData = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusVariant = (
    status: string
  ): 'primary' | 'success' | 'error' | 'neutral' => {
    switch (status) {
      case 'agendada':
        return 'primary';
      case 'realizada':
        return 'success';
      case 'cancelada':
        return 'error';
      default:
        return 'neutral';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'agendada':
        return 'Agendada';
      case 'realizada':
        return 'Realizada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const handleCancelarConsulta = (consulta: Consulta) => {
    console.log('🔴 BOTÃO CANCELAR CLICADO!');
    console.log('Consulta:', consulta);
    console.log('ID:', consulta.id);
    console.log('Status:', consulta.status);
    console.log('cancelandoId:', cancelandoId);

    // Verifica se já está cancelando outra consulta
    if (cancelandoId !== null) {
      console.log('⚠️ Já está cancelando outra consulta');
      return;
    }

    // Abre modal de confirmação
    console.log('📝 Definindo consulta para cancelar e abrindo modal...');
    setConsultaParaCancelar(consulta);
    setModalCancelarVisible(true);
    console.log('✅ Modal deve estar visível agora');
  };

  const confirmarCancelamento = async () => {
    if (!consultaParaCancelar) return;

    const consulta = consultaParaCancelar;
    setModalCancelarVisible(false);

    try {
      setCancelandoId(consulta.id);
      console.log('=== INICIANDO CANCELAMENTO ===');
      console.log('ID:', consulta.id);
      console.log('Dados:', JSON.stringify(consulta, null, 2));

      const resultado = await cancelViewModel.cancelarConsulta(consulta.id);

      console.log('=== RESULTADO ===');
      console.log('Success:', resultado.success);
      console.log('Error:', resultado.error);
      console.log('Consulta:', resultado.consulta);

      if (resultado.success) {
        console.log('✅ SUCESSO! Consulta cancelada.');

        // Atualiza a consulta na lista localmente primeiro para feedback imediato
        setConsultas((prevConsultas) => {
          return prevConsultas.map((c) =>
            c.id === consulta.id ? { ...c, status: 'cancelada' as const } : c
          );
        });

        // Força re-render do filtro
        setForceUpdate((prev) => prev + 1);

        setToastMessage('Consulta cancelada com sucesso!');
        setToastType('success');
        setToastVisible(true);

        // Recarrega do banco após um pequeno delay para garantir sincronização
        setTimeout(async () => {
          await carregarConsultas();
        }, 300);
      } else {
        console.error('❌ ERRO:', resultado.error);
        setToastMessage(
          resultado.error || 'Não foi possível cancelar a consulta'
        );
        setToastType('error');
        setToastVisible(true);
      }
    } catch (error) {
      console.error('❌ EXCEÇÃO:', error);
      setToastMessage('Ocorreu um erro ao cancelar a consulta');
      setToastType('error');
      setToastVisible(true);
    } finally {
      setCancelandoId(null);
      setConsultaParaCancelar(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <Skeleton variant="text" width="30%" height={40} />
          <Skeleton variant="text" width="30%" height={40} />
          <Skeleton variant="text" width="30%" height={40} />
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          <Skeleton variant="listItem" />
          <Skeleton variant="listItem" />
          <Skeleton variant="listItem" />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filtro === 'todas' && styles.filterButtonActive,
          ]}
          onPress={() => setFiltro('todas')}
          accessibilityRole="button"
          accessibilityLabel="Mostrar todas as consultas"
          accessibilityHint="Exibe consultas agendadas, realizadas e canceladas"
        >
          <Text
            style={[
              styles.filterText,
              filtro === 'todas' && styles.filterTextActive,
            ]}
          >
            Todas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filtro === 'agendadas' && styles.filterButtonActive,
          ]}
          onPress={() => setFiltro('agendadas')}
          accessibilityRole="button"
          accessibilityLabel="Mostrar consultas agendadas"
          accessibilityHint="Filtra apenas consultas com status agendada"
        >
          <Text
            style={[
              styles.filterText,
              filtro === 'agendadas' && styles.filterTextActive,
            ]}
          >
            Agendadas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filtro === 'realizadas' && styles.filterButtonActive,
          ]}
          onPress={() => setFiltro('realizadas')}
          accessibilityRole="button"
          accessibilityLabel="Mostrar consultas realizadas"
          accessibilityHint="Filtra apenas consultas já realizadas"
        >
          <Text
            style={[
              styles.filterText,
              filtro === 'realizadas' && styles.filterTextActive,
            ]}
          >
            Realizadas
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Toast de Notificação */}
        <Toast
          visible={toastVisible}
          type={toastType}
          message={toastMessage}
          position="top"
          duration={3000}
          onDismiss={() => setToastVisible(false)}
        />

        {consultasFiltradas.length === 0 ? (
          <EmptyState
            icon="📋"
            title="Nenhuma consulta encontrada"
            description={
              filtro === 'todas'
                ? 'Você ainda não possui consultas registradas.'
                : `Não há consultas ${filtro === 'agendadas' ? 'agendadas' : filtro === 'realizadas' ? 'realizadas' : 'canceladas'}.`
            }
          />
        ) : (
          consultasFiltradas.map((consulta) => (
            <Card key={consulta.id} style={styles.consultaCard}>
              <View style={styles.consultaHeader}>
                <View style={styles.consultaInfo}>
                  <Text style={styles.consultaData}>
                    {formatarData(consulta.data)} às {consulta.horario}
                  </Text>
                  {profissionaisMap.get(consulta.profissionalId) && (
                    <Text style={styles.consultaProfissional}>
                      {profissionaisMap.get(consulta.profissionalId)}
                    </Text>
                  )}
                </View>
                <Badge
                  text={getStatusText(consulta.status)}
                  variant={getStatusVariant(consulta.status)}
                  size="small"
                />
              </View>
              {consulta.status === 'agendada' && (
                <View style={styles.actionsContainer}>
                  <Button
                    title={
                      cancelandoId === consulta.id
                        ? 'Cancelando...'
                        : 'Cancelar'
                    }
                    onPress={() => {
                      console.log('🔴 BOTÃO PRESSIONADO - Início');
                      handleCancelarConsulta(consulta);
                      console.log('🔴 BOTÃO PRESSIONADO - Fim');
                    }}
                    disabled={
                      cancelandoId !== null && cancelandoId !== consulta.id
                    }
                    variant="outline"
                    style={styles.cancelButton}
                    accessibilityLabel="Cancelar consulta"
                    accessibilityHint="Abre modal de confirmação para cancelar esta consulta"
                  />
                </View>
              )}
            </Card>
          ))
        )}
      </ScrollView>

      {/* Modal de Confirmação de Cancelamento - FORA do ScrollView para garantir z-index correto */}
      <Modal
        visible={modalCancelarVisible}
        variant="alert"
        title="Cancelar Consulta"
        message={
          consultaParaCancelar
            ? `Tem certeza que deseja cancelar a consulta do dia ${formatarData(consultaParaCancelar.data)} às ${consultaParaCancelar.horario}?`
            : ''
        }
        icon={AlertTriangle}
        showTopBorder={false}
        primaryAction={{
          label: 'Sim',
          onPress: confirmarCancelamento,
        }}
        secondaryAction={{
          label: 'Não',
          onPress: () => {
            setModalCancelarVisible(false);
            setConsultaParaCancelar(null);
          },
        }}
        onClose={() => {
          setModalCancelarVisible(false);
          setConsultaParaCancelar(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  filterButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  filterTextActive: {
    color: theme.colors.textLight,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  consultaCard: {
    marginBottom: theme.spacing.md,
  },
  consultaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  consultaInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  consultaData: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  consultaProfissional: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  actionsContainer: {
    marginTop: theme.spacing.md,
  },
  cancelButton: {
    borderColor: theme.colors.error,
    marginTop: theme.spacing.md,
  },
});

export default HistoryScreen;
