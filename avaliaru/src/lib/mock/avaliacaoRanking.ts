import { PratoRanking, RatingDistribution } from "@/types/avaliacaoRanking";

export const pratosMock: PratoRanking[] = [
  {
    id: 1,
    nome: "Estrogonofe de Frango",
    nota: 4.8,
    votos: 320,
  },
  {
    id: 2,
    nome: "Feijoada",
    nota: 4.5,
    votos: 280,
  },
  {
    id: 3,
    nome: "Lasanha",
    nota: 4.4,
    votos: 250,
  },
  {
    id: 4,
    nome: "Frango Grelhado",
    nota: 4.2,
    votos: 180,
  },
];

export const distribuicaoMock: RatingDistribution[] = [
  { estrelas: 5, percentual: 90 },
  { estrelas: 4, percentual: 70 },
  { estrelas: 3, percentual: 40 },
  { estrelas: 2, percentual: 15 },
  { estrelas: 1, percentual: 5 },
];