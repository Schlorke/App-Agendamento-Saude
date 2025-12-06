import dataService from '../services/dataService';
import type { Farmacia } from '../services/dataService';

/**
 * ViewModel para gerenciar lógica de farmácias de plantão
 */
class PharmaciesViewModel {
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
   * Busca todas as farmácias de plantão
   */
  async buscarFarmacias(): Promise<Farmacia[]> {
    try {
      this._loading = true;
      this._error = null;
      return await dataService.buscarFarmacias();
    } catch (error) {
      console.error('Erro ao buscar farmácias:', error);
      this._error =
        error instanceof Error
          ? error.message
          : 'Erro ao carregar farmácias. Tente novamente.';
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

export default PharmaciesViewModel;
