import db from '../data/db.json';

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

/**
 * Serviço para acessar dados do mock database
 */
class DataService {
  /**
   * Busca um usuário por CPF
   */
  async buscarUsuarioPorCPF(cpf: string): Promise<Usuario | null> {
    await simulateNetworkDelay(300);
    const database = db as Database;
    const usuario = database.usuarios.find(
      (u) => u.cpf === cpf.replace(/\D/g, '')
    );
    return usuario || null;
  }

  /**
   * Busca um usuário por ID
   */
  async buscarUsuarioPorId(id: string): Promise<Usuario | null> {
    await simulateNetworkDelay(200);
    const database = db as Database;
    const usuario = database.usuarios.find((u) => u.id === id);
    return usuario || null;
  }

  /**
   * Cria um novo usuário
   */
  async criarUsuario(usuario: Omit<Usuario, 'id'>): Promise<Usuario> {
    await simulateNetworkDelay(400);
    const database = db as Database;
    const novoUsuario: Usuario = {
      ...usuario,
      id: String(database.usuarios.length + 1),
    };
    database.usuarios.push(novoUsuario);
    return novoUsuario;
  }

  /**
   * Verifica se um CPF já está cadastrado
   */
  async cpfJaCadastrado(cpf: string): Promise<boolean> {
    await simulateNetworkDelay(200);
    const database = db as Database;
    const cpfLimpo = cpf.replace(/\D/g, '');
    return database.usuarios.some((u) => u.cpf === cpfLimpo);
  }

  /**
   * Busca todas as especialidades
   */
  async buscarEspecialidades(): Promise<Especialidade[]> {
    await simulateNetworkDelay(300);
    const database = db as Database;
    return database.especialidades;
  }

  /**
   * Busca profissionais por especialidade
   */
  async buscarProfissionaisPorEspecialidade(
    especialidadeId: string
  ): Promise<Profissional[]> {
    await simulateNetworkDelay(300);
    const database = db as Database;
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
    const database = db as Database;
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
    const database = db as Database;
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
    return novaConsulta;
  }

  /**
   * Busca consultas de um usuário
   */
  async buscarConsultasPorUsuario(usuarioId: string): Promise<Consulta[]> {
    await simulateNetworkDelay(400);
    const database = db as Database;
    return database.consultas.filter((c) => c.usuarioId === usuarioId);
  }

  /**
   * Busca uma consulta por ID
   */
  async buscarConsultaPorId(consultaId: string): Promise<Consulta | null> {
    await simulateNetworkDelay(200);
    const database = db as Database;
    const consulta = database.consultas.find((c) => c.id === consultaId);
    return consulta || null;
  }

  /**
   * Cancela uma consulta
   */
  async cancelarConsulta(consultaId: string): Promise<Consulta> {
    await simulateNetworkDelay(300);
    const database = db as Database;
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
    const database = db as Database;
    const usuario = database.usuarios.find((u) => u.id === usuarioId);

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    Object.assign(usuario, dados);
    return usuario;
  }

  /**
   * Busca todas as notícias
   */
  async buscarNoticias(): Promise<Noticia[]> {
    await simulateNetworkDelay(300);
    const database = db as Database;
    return database.noticias || [];
  }

  /**
   * Busca todas as farmácias de plantão
   */
  async buscarFarmacias(): Promise<Farmacia[]> {
    await simulateNetworkDelay(300);
    const database = db as Database;
    return database.farmacias || [];
  }

  /**
   * Busca todos os medicamentos
   */
  async buscarMedicamentos(): Promise<Medicamento[]> {
    await simulateNetworkDelay(300);
    const database = db as Database;
    return database.medicamentos || [];
  }
}

export default new DataService();
