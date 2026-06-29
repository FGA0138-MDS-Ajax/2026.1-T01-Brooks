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

import { removerRestricaoBanco } from '../removerRestricao';

describe('removerRestricaoBanco', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve realizar a exclusão e retornar sucesso', async () => {
    mockDbMethods.where.mockResolvedValueOnce({ success: true });
    
    const result = await removerRestricaoBanco({ restricaoId: '1', fkEstudante: 'user1' });
    
    expect(result).toEqual({ success: true });
    expect(mockDbMethods.delete).toHaveBeenCalled();
  });
});