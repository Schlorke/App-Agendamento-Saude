import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import NewsViewModel from '../../viewmodels/NewsViewModel';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import Skeleton from '../../components/Skeleton';
import { theme } from '../../styles/theme';
import type { AppScreenProps } from '../../navigation/types';
import type { Noticia } from '../../services/dataService';

/**
 * @component NewsScreen
 * @description Tela que exibe notícias e campanhas de saúde. Lista todas as notícias disponíveis com título, conteúdo e data.
 *
 * @props
 *   - Nenhuma prop direta. Utiliza apenas o hook de navegação.
 *
 * @state
 *   - `noticias`: {Noticia[]} - Lista de todas as notícias disponíveis.
 *   - `loading`: {boolean} - Indica se as notícias estão sendo carregadas.
 *
 * @known_issues
 *   - Nenhum problema conhecido.
 *
 * @changelog
 *   - 2024-01-15 - IA - Criação inicial do componente com suporte a listagem de notícias.
 */
const NewsScreen: React.FC<AppScreenProps<'News'>> = () => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const viewModel = new NewsViewModel();

  useEffect(() => {
    carregarNoticias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregarNoticias = async () => {
    try {
      setLoading(true);
      const noticiasData = await viewModel.buscarNoticias();
      setNoticias(noticiasData);
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {loading ? (
          <>
            <Skeleton variant="card" height={150} />
            <Skeleton variant="card" height={150} />
            <Skeleton variant="card" height={150} />
          </>
        ) : noticias.length === 0 ? (
          <EmptyState
            icon="📰"
            title="Nenhuma notícia disponível"
            description="Não há notícias ou campanhas disponíveis no momento."
          />
        ) : (
          noticias.map((noticia) => (
            <Card key={noticia.id} style={styles.card}>
              <Text style={styles.titulo}>{noticia.titulo}</Text>
              <Text style={styles.data}>{formatarData(noticia.data)}</Text>
              <Text style={styles.conteudo}>{noticia.conteudo}</Text>
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
  titulo: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  data: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  conteudo: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 22,
  },
});

export default NewsScreen;
