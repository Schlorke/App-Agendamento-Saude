import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PharmaciesViewModel from '../../viewmodels/PharmaciesViewModel';
import Card from '../../components/Card';
import Loading from '../../components/Loading';
import { theme } from '../../styles/theme';
import type { AppScreenProps } from '../../navigation/types';
import type { Farmacia } from '../../services/dataService';

/**
 * @component PharmaciesScreen
 * @description Tela que exibe farmácias de plantão. Lista todas as farmácias disponíveis com nome, endereço, telefone e horário de funcionamento.
 *
 * @props
 *   - Nenhuma prop direta. Utiliza apenas o hook de navegação.
 *
 * @state
 *   - `farmacias`: {Farmacia[]} - Lista de todas as farmácias de plantão disponíveis.
 *   - `loading`: {boolean} - Indica se as farmácias estão sendo carregadas.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Criação inicial do componente com suporte a listagem de farmácias de plantão.
 */
const PharmaciesScreen: React.FC<AppScreenProps<'Pharmacies'>> = () => {
  const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
  const [loading, setLoading] = useState(true);
  const viewModel = new PharmaciesViewModel();

  useEffect(() => {
    carregarFarmacias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregarFarmacias = async () => {
    try {
      setLoading(true);
      const farmaciasData = await viewModel.buscarFarmacias();
      setFarmacias(farmaciasData);
    } catch (error) {
      console.error('Erro ao carregar farmácias:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Carregando farmácias..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {farmacias.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhuma farmácia de plantão disponível no momento
            </Text>
          </View>
        ) : (
          farmacias.map((farmacia) => (
            <Card key={farmacia.id} style={styles.card}>
              <Text style={styles.nome}>{farmacia.nome}</Text>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Endereço:</Text>
                <Text style={styles.value}>{farmacia.endereco}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Telefone:</Text>
                <Text style={styles.value}>{farmacia.telefone}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Horário:</Text>
                <Text style={styles.value}>{farmacia.horario}</Text>
              </View>
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
    flexWrap: 'wrap',
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
    flex: 1,
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
});

export default PharmaciesScreen;
