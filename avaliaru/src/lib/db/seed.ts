import { restricaoAlimentar } from './schema'; // Importe seu schema

import { db } from './db';

async function main() {
  console.log('Adicionando registros das restrições alimentares...');

  // Insira seus registros iniciais aqui
  await db.insert(restricaoAlimentar).values([
    { codigo: 'cogumelo', emoji: '🍄', nome: 'Cogumelo', descricao: 'Pratos com cogumelos.' },
    { codigo: 'leite', emoji: '🥛', nome: 'Leite e derivados', descricao: 'Leite, queijo, manteiga e creme.' },
    { codigo: 'mel', emoji: '🍯', nome: 'Mel', descricao: 'Preparações com mel.' },
    { codigo: 'pimenta', emoji: '🌶️', nome: 'Pimenta', descricao: 'Molhos e temperos apimentados.' },
    { codigo: 'soja', emoji: '🌱', nome: 'Soja', descricao: 'Proteína, bebida ou molho de soja.' },
    { codigo: 'gluten', emoji: '🌾', nome: 'Trigo/Glúten', descricao: 'Pães, massas, torradas e trigo.' },
    { codigo: 'amendoim', emoji: '🥜', nome: 'Amendoim', descricao: 'Pasta de amendoim e derivados.' },
    { codigo: 'oleaginosa', emoji: '🌰', nome: 'Oleaginosa', descricao: 'Castanhas, nozes e semelhantes.' },
    { codigo: 'ovo', emoji: '🥚', nome: 'Ovo', descricao: 'Omelete, ovos mexidos e preparações.' },
    { codigo: 'suino', emoji: '🐷', nome: 'Suíno', descricao: 'Carne suína, feijoada e derivados.' }
  ]);

  process.exit(0);
}

main().catch((err) => {
  console.error('Erro ao popular o banco de dados:', err);
  process.exit(1);
});
