/**
 * AvaliaRU - Painel do Gestor
 * Lógica do front-end e interações dinâmicas.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Configuração da Navegação por Abas
  const links = document.querySelectorAll('.menu-lateral a');
  const sections = document.querySelectorAll('main > section.caixa');

  function showSection(targetId) {
    sections.forEach(section => {
      if ('#' + section.id === targetId) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });

    links.forEach(link => {
      if (link.getAttribute('href') === targetId) {
        link.classList.add('ativo');
      } else {
        link.classList.remove('ativo');
      }
    });
  }

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      showSection(targetId);
      history.pushState(null, null, targetId);
    });
  });

  // Mostra a seção inicial com base no hash da URL ou padrão para #cadastro
  const initialHash = window.location.hash || '#cadastro';
  showSection(initialHash);
});
