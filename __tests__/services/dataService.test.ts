import AsyncStorage from '@react-native-async-storage/async-storage';
import dataService from '../../src/services/dataService';

describe('dataService.cancelarConsulta', () => {
  const formatHorario = (date: Date): string => {
    return `${String(date.getHours()).padStart(2, '0')}:${String(
      date.getMinutes()
    ).padStart(2, '0')}`;
  };

  const criarConsultaDinamica = async (horasNoFuturo: number) => {
    const alvo = new Date();
    alvo.setHours(alvo.getHours() + horasNoFuturo);

    return dataService.criarConsulta({
      usuarioId: '1',
      especialidadeId: '1',
      profissionalId: '1',
      data: alvo.toISOString().split('T')[0],
      horario: formatHorario(alvo),
    });
  };

  beforeEach(async () => {
    await AsyncStorage.clear();
    await dataService.resetDatabase();
  });

  it('bloqueia cancelamento com menos de 24h de antecedencia', async () => {
    const consultaProxima = await criarConsultaDinamica(2);

    await expect(
      dataService.cancelarConsulta(consultaProxima.id)
    ).rejects.toThrow('24 horas');
  });

  it('permite cancelamento quando ha mais de 24h de antecedencia', async () => {
    const consultaFutura = await criarConsultaDinamica(30);
    const resultado = await dataService.cancelarConsulta(consultaFutura.id);
    expect(resultado.status).toBe('cancelada');
  });
});
