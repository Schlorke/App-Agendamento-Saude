import dataService, { Consulta } from '../../src/services/dataService';
import db from '../../src/data/db.json';

describe('dataService.cancelarConsulta', () => {
  const addedIds: string[] = [];

  afterEach(() => {
    const database = db as { consultas: Consulta[] };
    addedIds.forEach((id) => {
      const index = database.consultas.findIndex((c) => c.id === id);
      if (index !== -1) {
        database.consultas.splice(index, 1);
      }
    });
    addedIds.length = 0;
  });

  it('bloqueia cancelamento com menos de 24h de antecedência', async () => {
    const database = db as { consultas: Consulta[] };
    const agora = new Date();
    agora.setHours(agora.getHours() + 2);
    const consultaProxima: Consulta = {
      id: 'test-cancel-<24h>',
      usuarioId: '1',
      especialidadeId: '1',
      profissionalId: '1',
      data: agora.toISOString().split('T')[0],
      horario: `${String(agora.getHours()).padStart(2, '0')}:${String(
        agora.getMinutes()
      ).padStart(2, '0')}`,
      status: 'agendada',
      criadaEm: new Date().toISOString(),
    };

    database.consultas.push(consultaProxima);
    addedIds.push(consultaProxima.id);

    await expect(
      dataService.cancelarConsulta(consultaProxima.id)
    ).rejects.toThrow('24 horas');
  });

  it('permite cancelamento quando há mais de 24h de antecedência', async () => {
    const database = db as { consultas: Consulta[] };
    const futura = new Date();
    futura.setHours(futura.getHours() + 30);
    const consultaFutura: Consulta = {
      id: 'test-cancel->24h>',
      usuarioId: '1',
      especialidadeId: '1',
      profissionalId: '1',
      data: futura.toISOString().split('T')[0],
      horario: `${String(futura.getHours()).padStart(2, '0')}:${String(
        futura.getMinutes()
      ).padStart(2, '0')}`,
      status: 'agendada',
      criadaEm: new Date().toISOString(),
    };

    database.consultas.push(consultaFutura);
    addedIds.push(consultaFutura.id);

    const resultado = await dataService.cancelarConsulta(consultaFutura.id);
    expect(resultado.status).toBe('cancelada');
  });
});
