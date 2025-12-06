import dataService from '../services/dataService';
import type { Medicamento } from '../services/dataService';

/**
 * ViewModel para gerenciar lógica de medicamentos disponíveis
 */
class MedicationsViewModel {
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
   * Busca todos os medicamentos
   */
  async buscarMedicamentos(): Promise<Medicamento[]> {
    try {
      this._loading = true;
      this._error = null;
      return await dataService.buscarMedicamentos();
    } catch (error) {
      console.error('Erro ao buscar medicamentos:', error);
      this._error =
        error instanceof Error
          ? error.message
          : 'Erro ao carregar medicamentos. Tente novamente.';
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

export default MedicationsViewModel;
