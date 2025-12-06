import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import dataService from '../../services/dataService';
import CancelAppointmentViewModel from '../../viewmodels/CancelAppointmentViewModel';
import Button from '../../components/Button';
import { theme } from '../../styles/theme';
import type { AppScreenProps } from '../../navigation/types';
import type { Consulta } from '../../services/dataService';

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
 */
const HistoryScreen: React.FC<AppScreenProps<'History'>> = () => {
  const { usuario } = useAuth();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<
    'todas' | 'agendadas' | 'realizadas' | 'canceladas'
  >('todas');
  const [cancelandoId, setCancelandoId] = useState<string | null>(null);

  const cancelViewModel = new CancelAppointmentViewModel();

  useEffect(() => {
    carregarConsultas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  const carregarConsultas = async () => {
    if (!usuario) return;

    try {
      setLoading(true);
      const consultasDoUsuario = await dataService.buscarConsultasPorUsuario(
        usuario.id
      );
      setConsultas(consultasDoUsuario);
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    } finally {
      setLoading(false);
    }
  };

  const consultasFiltradas = consultas.filter((consulta) => {
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
    return consulta.status === statusMap[filtro as keyof typeof statusMap];
  });

  const formatarData = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada':
        return theme.colors.primary;
      case 'realizada':
        return theme.colors.success;
      case 'cancelada':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
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
    Alert.alert(
      'Cancelar Consulta',
      `Tem certeza que deseja cancelar a consulta do dia ${formatarData(consulta.data)} às ${consulta.horario}?`,
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancelandoId(consulta.id);
              const resultado = await cancelViewModel.cancelarConsulta(
                consulta.id
              );

              if (resultado.success) {
                Alert.alert('Sucesso', 'Consulta cancelada com sucesso!');
                // Recarrega a lista
                await carregarConsultas();
              } else {
                Alert.alert(
                  'Erro',
                  resultado.error || 'Não foi possível cancelar a consulta'
                );
              }
            } catch {
              Alert.alert('Erro', 'Ocorreu um erro ao cancelar a consulta');
            } finally {
              setCancelandoId(null);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
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
        {consultasFiltradas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma consulta encontrada</Text>
          </View>
        ) : (
          consultasFiltradas.map((consulta) => (
            <View key={consulta.id} style={styles.consultaCard}>
              <View style={styles.consultaHeader}>
                <Text style={styles.consultaData}>
                  {formatarData(consulta.data)} às {consulta.horario}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(consulta.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusText(consulta.status)}
                  </Text>
                </View>
              </View>
              {consulta.status === 'agendada' && (
                <View style={styles.actionsContainer}>
                  <Button
                    title={
                      cancelandoId === consulta.id
                        ? 'Cancelando...'
                        : 'Cancelar'
                    }
                    onPress={() => handleCancelarConsulta(consulta)}
                    disabled={cancelandoId !== null}
                    variant="outline"
                    style={styles.cancelButton}
                  />
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
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
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadow.small,
  },
  consultaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  consultaData: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  actionsContainer: {
    marginTop: theme.spacing.md,
  },
  cancelButton: {
    borderColor: theme.colors.error,
  },
});

export default HistoryScreen;
