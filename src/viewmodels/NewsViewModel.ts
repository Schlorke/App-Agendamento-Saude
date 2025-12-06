import dataService from '../services/dataService';
import type { Noticia } from '../services/dataService';

/**
 * ViewModel para gerenciar lógica de notícias e campanhas de saúde
 */
class NewsViewModel {
  private _loading: boolean = false;
  private _error: string | null = null;

  /**
   * Estado de carregamento
   */
  get loading(): boolean {
    return this._loading;
  }

  /**
   * Mensagem de erro atual
   */
  get error(): string | null {
    return this._error;
  }

  /**
   * Busca todas as notícias
   */
  async buscarNoticias(): Promise<Noticia[]> {
    try {
      this._loading = true;
      this._error = null;
      return await dataService.buscarNoticias();
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      this._error =
        error instanceof Error
          ? error.message
          : 'Erro ao carregar notícias. Tente novamente.';
      return [];
    } finally {
      this._loading = false;
    }
  }

  /**
   * Limpa o estado de erro
   */
  clearError(): void {
    this._error = null;
  }
}

export default NewsViewModel;
