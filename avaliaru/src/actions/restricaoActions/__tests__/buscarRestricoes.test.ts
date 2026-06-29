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

// 3. SÓ AGORA importamos a nossa Action
import { buscarRestricoesBanco } from '../buscarRestricoes';

describe('buscarRestricoesBanco', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar todas as restrições', async () => {
    const mockData = [{ id: '1', nome: 'Glúten' }];
    mockDbMethods.all.mockResolvedValueOnce(mockData);
    
    const result = await buscarRestricoesBanco();
    
    expect(result).toEqual(mockData);
  });
});