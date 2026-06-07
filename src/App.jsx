import { useState } from 'react';
import logo from './assets/logo-avaliaru.jpeg';

const restricoes = [
  { id: 'cogumelo', emoji: '🍄', nome: 'Cogumelo', descricao: 'Pratos com cogumelos.' },
  { id: 'leite', emoji: '🥛', nome: 'Leite e derivados', descricao: 'Leite, queijo, manteiga e creme.' },
  { id: 'mel', emoji: '🍯', nome: 'Mel', descricao: 'Preparações com mel.' },
  { id: 'pimenta', emoji: '🌶️', nome: 'Pimenta', descricao: 'Molhos e temperos apimentados.' },
  { id: 'soja', emoji: '🌱', nome: 'Soja', descricao: 'Proteína, bebida ou molho de soja.' },
  { id: 'gluten', emoji: '🌾', nome: 'Trigo/Glúten', descricao: 'Pães, massas, torradas e trigo.' },
  { id: 'amendoim', emoji: '🥜', nome: 'Amendoim', descricao: 'Pasta de amendoim e derivados.' },
  { id: 'oleaginosa', emoji: '🌰', nome: 'Oleaginosa', descricao: 'Castanhas, nozes e semelhantes.' },
  { id: 'ovo', emoji: '🥚', nome: 'Ovo', descricao: 'Omelete, ovos mexidos e preparações.' },
  { id: 'suino', emoji: '🐷', nome: 'Suíno', descricao: 'Carne suína, feijoada e derivados.' }
];

const preferencias = [
  { id: 'ovolacto', emoji: '🧀', nome: 'Ovolactovegetariano', descricao: 'Consome ovos, leite e derivados.' },
  { id: 'vegetariano-estrito', emoji: '🥗', nome: 'Vegetariano estrito', descricao: 'Não consome produtos de origem animal.' }
];

function OptionCard({ item, checked, onChange }) {
  return (
    <label className="option" htmlFor={item.id}>
      <input
        id={item.id}
        type="checkbox"
        checked={checked}
        onChange={() => onChange(item.id)}
      />
      <span className="emoji" aria-hidden="true">{item.emoji}</span>
      <div>
        <strong>{item.nome}</strong>
        <small>{item.descricao}</small>
      </div>
    </label>
  );
}

export default function App() {
  const [selecionados, setSelecionados] = useState([]);

  function alternarItem(id) {
    setSelecionados((atuais) =>
      atuais.includes(id) ? atuais.filter((item) => item !== id) : [...atuais, id]
    );
  }

  function limparFormulario() {
    setSelecionados([]);
  }

  function salvarRestricoes(event) {
    event.preventDefault();
    alert(`Restrições salvas: ${selecionados.length ? selecionados.join(', ') : 'nenhuma'}`);
  }

  return (
    <main className="page">
      <section className="container">
        <header className="top">
          <img src={logo} alt="Logo AvaliaRU" className="logo" />
          <div>
            <h1>Restrições Alimentares</h1>
            <p>Selecione os ingredientes que você não pode ou prefere não consumir.</p>
          </div>
        </header>

        <form className="card" onSubmit={salvarRestricoes}>
          <h2>Marque suas restrições</h2>

          <div className="grid">
            {restricoes.map((item) => (
              <OptionCard
                key={item.id}
                item={item}
                checked={selecionados.includes(item.id)}
                onChange={alternarItem}
              />
            ))}
          </div>

          <h2>Preferência alimentar</h2>

          <div className="grid two">
            {preferencias.map((item) => (
              <OptionCard
                key={item.id}
                item={item}
                checked={selecionados.includes(item.id)}
                onChange={alternarItem}
              />
            ))}
          </div>

          <div className="actions">
            <button type="button" className="btn secondary" onClick={limparFormulario}>
              Cancelar
            </button>
            <button type="submit" className="btn primary">
              Salvar restrições
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
