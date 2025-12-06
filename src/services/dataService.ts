import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../data/db.json';

/**
 * @component DataService
 * @description Serviço responsável por simular o backend com um banco em memória, agora persistido em AsyncStorage (funciona em Expo e Web). Todas as operações de dados passam por aqui para manter o padrão MVVM.
 *
 * @props
 *   - Nenhuma prop. Instância singleton exportada para uso pelos ViewModels.
 *
 * @state
 *   - `databaseCache`: {Database | null} - Cache em memória para evitar re-leituras do storage.
 *
 * @known_issues
 *   - Operações simultâneas em abas diferentes do navegador podem sobrescrever mudanças, pois não há locking.
 *
 * @changelog
 *   - 2025-12-06 - IA - Adicionada persistência em AsyncStorage, cache em memória e método de reset para testes.
 */

/**
 * Interface para a estrutura do banco de dados JSON
 */
interface Database {
  usuarios: Usuario[];
  especialidades: Especialidade[];
  profissionais: Profissional[];
  consultas: Consulta[];
  horarios: string[];
  noticias?: Noticia[];
  farmacias?: Farmacia[];
  medicamentos?: Medicamento[];
}

/**
 * Interface para os tipos do banco de dados
 */
export interface Usuario {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  senhaHash: string;
  telefone?: string;
  endereco?: string;
}

export interface Especialidade {
  id: string;
  nome: string;
  descricao: string;
}

export interface Profissional {
  id: string;
  nome: string;
  especialidadeId: string;
  crm: string;
}

export interface Consulta {
  id: string;
  usuarioId: string;
  especialidadeId: string;
  profissionalId: string;
  data: string;
  horario: string;
  status: 'agendada' | 'realizada' | 'cancelada';
  criadaEm: string;
}

export interface Noticia {
  id: string;
  titulo: string;
  conteudo: string;
  data: string;
  imagem: string | null;
}

export interface Farmacia {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  plantao: boolean;
  horario: string;
}

export interface Medicamento {
  id: string;
  nome: string;
  descricao: string;
  dosagem: string;
}

/**
 * Simula delay de rede para testar performance em conexões lentas
 */
const simulateNetworkDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const STORAGE_DB_KEY = '@health_app:database';
let databaseCache: Database | null = null;

const cloneDatabase = (database: Database): Database =>
  JSON.parse(JSON.stringify(database));

/**
 * Serviço para acessar dados do mock database
 */
class DataService {
  /**
   * Garante que o banco esteja carregado em cache
   */
  private async getDatabase(): Promise<Database> {
    if (databaseCache) {
      return databaseCache;
    }

    const stored = await AsyncStorage.getItem(STORAGE_DB_KEY);
    if (stored) {
      databaseCache = JSON.parse(stored) as Database;
      return databaseCache;
    }

    const initial = cloneDatabase(db as Database);
    databaseCache = initial;
    await AsyncStorage.setItem(STORAGE_DB_KEY, JSON.stringify(initial));
    return initial;
  }

  /**
   * Persiste o banco atualizado
   */
  private async persistDatabase(database: Database): Promise<void> {
    databaseCache = database;
    await AsyncStorage.setItem(STORAGE_DB_KEY, JSON.stringify(database));
  }

  /**
   * Reseta o banco para o estado inicial (útil para testes e desenvolvimento)
   * Remove todos os dados cadastrados e restaura os dados iniciais do db.json
   */
  async resetDatabase(): Promise<void> {
    const initial = cloneDatabase(db as Database);
    databaseCache = initial;
    await AsyncStorage.setItem(STORAGE_DB_KEY, JSON.stringify(initial));
  }

  /**
   * Limpa completamente o banco de dados (remove todos os dados)
   * Útil para desenvolvimento e testes
   */
  async limparDatabase(): Promise<void> {
    databaseCache = null;
    await AsyncStorage.removeItem(STORAGE_DB_KEY);
  }

  /**
   * Importa um banco de dados completo (útil para migrar dados entre navegadores)
   * @param database - Banco de dados a ser importado
   */
  async importarDatabase(database: Database): Promise<void> {
    await this.persistDatabase(database);
  }

  /**
   * Exporta o banco de dados atual (útil para backup ou migração)
   * @returns Banco de dados atual
   */
  async exportarDatabase(): Promise<Database> {
    return await this.getDatabase();
  }

  /**
   * Busca um usuário por CPF
   * @param cpf - CPF do usuário (aceita formatado ou não formatado)
   * @returns Usuário encontrado ou null
   */
  async buscarUsuarioPorCPF(cpf: string): Promise<Usuario | null> {
    await simulateNetworkDelay(300);
    const database = await this.getDatabase();
    // Limpa formatação de ambos os lados para garantir comparação correta
    const cpfLimpo = cpf.replace(/\D/g, '');
    const usuario = database.usuarios.find(
      (u) => u.cpf.replace(/\D/g, '') === cpfLimpo
    );
    return usuario || null;
  }

  /**
   * Busca um usuário por ID
   */
  async buscarUsuarioPorId(id: string): Promise<Usuario | null> {
    await simulateNetworkDelay(200);
    const database = await this.getDatabase();
    const usuario = database.usuarios.find((u) => u.id === id);
    return usuario || null;
  }

  /**
   * Cria um novo usuário
   */
  async criarUsuario(usuario: Omit<Usuario, 'id'>): Promise<Usuario> {
    await simulateNetworkDelay(400);
    const database = await this.getDatabase();
    const novoUsuario: Usuario = {
      ...usuario,
      id: String(database.usuarios.length + 1),
    };
    database.usuarios.push(novoUsuario);
    await this.persistDatabase(database);
    return novoUsuario;
  }

  /**
   * Verifica se um CPF já está cadastrado
   * @param cpf - CPF a verificar (aceita formatado ou não formatado)
   * @returns true se o CPF já estiver cadastrado, false caso contrário
   */
  async cpfJaCadastrado(cpf: string): Promise<boolean> {
    await simulateNetworkDelay(200);
    const database = await this.getDatabase();
    // Limpa formatação de ambos os lados para garantir comparação correta
    const cpfLimpo = cpf.replace(/\D/g, '');
    return database.usuarios.some((u) => u.cpf.replace(/\D/g, '') === cpfLimpo);
  }

  /**
   * Busca todas as especialidades
   */
  async buscarEspecialidades(): Promise<Especialidade[]> {
    await simulateNetworkDelay(300);
    const database = await this.getDatabase();
    return database.especialidades;
  }

  /**
   * Busca profissionais por especialidade
   */
  async buscarProfissionaisPorEspecialidade(
    especialidadeId: string
  ): Promise<Profissional[]> {
    await simulateNetworkDelay(300);
    const database = await this.getDatabase();
    return database.profissionais.filter(
      (p) => p.especialidadeId === especialidadeId
    );
  }

  /**
   * Busca horários disponíveis para uma data e profissional
   */
  async buscarHorariosDisponiveis(
    data: string,
    profissionalId: string
  ): Promise<string[]> {
    await simulateNetworkDelay(400);
    const database = await this.getDatabase();
    const consultasOcupadas = database.consultas.filter(
      (c) =>
        c.data === data &&
        c.profissionalId === profissionalId &&
        c.status !== 'cancelada'
    );
    const horariosOcupados = consultasOcupadas.map((c) => c.horario);
    const todosHorarios = database.horarios;
    return todosHorarios.filter((h) => !horariosOcupados.includes(h));
  }

  /**
   * Cria uma nova consulta
   */
  async criarConsulta(
    consulta: Omit<Consulta, 'id' | 'criadaEm' | 'status'>
  ): Promise<Consulta> {
    await simulateNetworkDelay(500);

    // Verifica se o horário já está ocupado
    const database = await this.getDatabase();
    const horarioOcupado = database.consultas.some(
      (c) =>
        c.data === consulta.data &&
        c.horario === consulta.horario &&
        c.profissionalId === consulta.profissionalId &&
        c.status !== 'cancelada'
    );

    if (horarioOcupado) {
      throw new Error('Horário já está ocupado');
    }

    const novaConsulta: Consulta = {
      ...consulta,
      id: String(database.consultas.length + 1),
      status: 'agendada',
      criadaEm: new Date().toISOString(),
    };

    database.consultas.push(novaConsulta);
    await this.persistDatabase(database);
    return novaConsulta;
  }

  /**
   * Busca consultas de um usuário
   */
  async buscarConsultasPorUsuario(usuarioId: string): Promise<Consulta[]> {
    await simulateNetworkDelay(400);
    const database = await this.getDatabase();
    return database.consultas.filter((c) => c.usuarioId === usuarioId);
  }

  /**
   * Busca uma consulta por ID
   */
  async buscarConsultaPorId(consultaId: string): Promise<Consulta | null> {
    await simulateNetworkDelay(200);
    const database = await this.getDatabase();
    const consulta = database.consultas.find((c) => c.id === consultaId);
    return consulta || null;
  }

  /**
   * Cancela uma consulta
   */
  async cancelarConsulta(consultaId: string): Promise<Consulta> {
    await simulateNetworkDelay(300);
    const database = await this.getDatabase();
    const consulta = database.consultas.find((c) => c.id === consultaId);

    if (!consulta) {
      throw new Error('Consulta não encontrada');
    }

    if (consulta.status === 'cancelada') {
      throw new Error('Consulta já foi cancelada');
    }

    if (consulta.status === 'realizada') {
      throw new Error('Não é possível cancelar uma consulta já realizada');
    }

    const dataConsulta = new Date(`${consulta.data}T${consulta.horario}:00`);
    const agora = new Date();
    const vinteQuatroHorasMs = 24 * 60 * 60 * 1000;

    if (dataConsulta.getTime() - agora.getTime() < vinteQuatroHorasMs) {
      throw new Error(
        'Não é possível cancelar uma consulta com menos de 24 horas de antecedência'
      );
    }

    consulta.status = 'cancelada';
    await this.persistDatabase(database);
    return consulta;
  }

  /**
   * Atualiza um usuário
   */
  async atualizarUsuario(
    usuarioId: string,
    dados: Partial<Omit<Usuario, 'id' | 'cpf' | 'senhaHash'>>
  ): Promise<Usuario> {
    await simulateNetworkDelay(300);
    const database = await this.getDatabase();
    const usuario = database.usuarios.find((u) => u.id === usuarioId);

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    Object.assign(usuario, dados);
    await this.persistDatabase(database);
    return usuario;
  }

  /**
   * Busca todas as notícias
   */
  async buscarNoticias(): Promise<Noticia[]> {
    await simulateNetworkDelay(300);
    const database = await this.getDatabase();
    return database.noticias || [];
  }

  /**
   * Busca todas as farmácias de plantão
   */
  async buscarFarmacias(): Promise<Farmacia[]> {
    await simulateNetworkDelay(300);
    const database = await this.getDatabase();
    return database.farmacias || [];
  }

  /**
   * Busca todos os medicamentos
   */
  async buscarMedicamentos(): Promise<Medicamento[]> {
    await simulateNetworkDelay(300);
    const database = await this.getDatabase();
    return database.medicamentos || [];
  }
}

export default new DataService();
