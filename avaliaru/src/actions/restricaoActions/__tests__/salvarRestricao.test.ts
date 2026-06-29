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

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import { salvarRestricaoBanco } from '../salvarRestricao';

describe('salvarRestricaoBanco', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve inserir restrição com onConflictDoNothing', async () => {
    mockDbMethods.execute.mockResolvedValueOnce({ success: true });

    const result = await salvarRestricaoBanco({ restricaoId: '1', fkEstudante: 'user1' });
    
    expect(result).toEqual({ success: true });
    expect(mockDbMethods.insert).toHaveBeenCalled();
  });

  it('deve lançar um erro quando ocorrer uma falha no banco de dados', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockDbMethods.execute.mockRejectedValueOnce(new Error('Database connection failed'));

    await expect(salvarRestricaoBanco({ restricaoId: '1', fkEstudante: 'user1' }))
      .rejects.toThrow('Erro ao salvar no banco de dados.');
      
    expect(mockDbMethods.insert).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});