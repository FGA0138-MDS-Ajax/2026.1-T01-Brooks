import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDbMethods = vi.hoisted(() => ({
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  onConflictDoNothing: vi.fn().mockReturnThis(),
  execute: vi.fn().mockResolvedValue({ success: true }),
  all: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/lib/db/db', () => ({
  db: mockDbMethods,
}));

import { buscarRestricoesEstudante, buscarRestricoesEstudanteBanco } from '../buscarRestricoesEstudante';

describe('buscarRestricoesEstudante', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve buscar as linhas brutas do banco de dados (buscarRestricoesEstudanteBanco)', async () => {
    const mockData = [{ fkEstudante: 'user1', fkRestricao: '1' }];
    mockDbMethods.all.mockResolvedValueOnce(mockData);

    const result = await buscarRestricoesEstudanteBanco({ fkEstudante: 'user1' });
    
    expect(result).toEqual(mockData);
    expect(mockDbMethods.select).toHaveBeenCalled();
    expect(mockDbMethods.where).toHaveBeenCalled();
  });

  it('deve retornar apenas a lista de IDs mapeada (buscarRestricoesEstudante)', async () => {
    const mockData = [
      { fkEstudante: 'user1', fkRestricao: 'gluten' },
      { fkEstudante: 'user1', fkRestricao: 'lactose' }
    ];
    mockDbMethods.all.mockResolvedValueOnce(mockData);

    // Testando a função principal que limpa os dados com .map()
    const result = await buscarRestricoesEstudante('user1');
    
    // O resultado esperado aqui é a lista mapeada!
    expect(result).toEqual(['gluten', 'lactose']);
  });
});