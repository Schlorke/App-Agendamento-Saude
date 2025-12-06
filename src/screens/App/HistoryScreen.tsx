import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import dataService from '../../services/dataService';
import CancelAppointmentViewModel from '../../viewmodels/CancelAppointmentViewModel';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import EmptyState from '../../components/EmptyState';
import Skeleton from '../../components/Skeleton';
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
                    onPress={() => handleCancelarConsulta(consulta)}
                    disabled={cancelandoId !== null}
                    variant="outline"
                    style={styles.cancelButton}
                  />
                </View>
              )}
            </Card>
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
