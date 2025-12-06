import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MedicationsViewModel from '../../viewmodels/MedicationsViewModel';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import Skeleton from '../../components/Skeleton';
import { theme } from '../../styles/theme';
import type { AppScreenProps } from '../../navigation/types';
import type { Medicamento } from '../../services/dataService';

/**
 * @component MedicationsScreen
 * @description Tela que exibe informações sobre medicamentos disponíveis. Lista todos os medicamentos com nome, descrição e dosagem.
 *
 * @props
 *   - Nenhuma prop direta. Utiliza apenas o hook de navegação.
 *
 * @state
 *   - `medicamentos`: {Medicamento[]} - Lista de todos os medicamentos disponíveis.
 *   - `loading`: {boolean} - Indica se os medicamentos estão sendo carregados.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Criação inicial do componente com suporte a listagem de medicamentos.
 */
const MedicationsScreen: React.FC<AppScreenProps<'Medications'>> = () => {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const viewModel = new MedicationsViewModel();

  useEffect(() => {
    carregarMedicamentos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregarMedicamentos = async () => {
    try {
      setLoading(true);
      const medicamentosData = await viewModel.buscarMedicamentos();
      setMedicamentos(medicamentosData);
    } catch (error) {
      console.error('Erro ao carregar medicamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {loading ? (
          <>
            <Skeleton variant="card" height={120} />
            <Skeleton variant="card" height={120} />
            <Skeleton variant="card" height={120} />
          </>
        ) : medicamentos.length === 0 ? (
          <EmptyState
            icon="💉"
            title="Nenhum medicamento disponível"
            description="Não há medicamentos cadastrados no momento."
          />
        ) : (
          medicamentos.map((medicamento) => (
            <Card key={medicamento.id} style={styles.card}>
              <Text style={styles.nome}>{medicamento.nome}</Text>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Dosagem:</Text>
                <Text style={styles.value}>{medicamento.dosagem}</Text>
              </View>
              <Text style={styles.descricao}>{medicamento.descricao}</Text>
            </Card>
          ))
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
  nome: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
  },
  label: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginRight: theme.spacing.xs,
  },
  value: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  descricao: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    lineHeight: 22,
  },
});

export default MedicationsScreen;
