# AvaliaRU

**Uma experiência mais informada, segura e participativa no Restaurante Universitário da FCTE.**

O AvaliaRU é uma aplicação web criada pelo Grupo Brooks na disciplina de Métodos de Desenvolvimento de Software da Universidade de Brasília. A proposta transforma a publicação passiva do cardápio em um canal de interação entre estudantes e a gestão do Restaurante Universitário.

<div class="home-actions" markdown>
[Conhecer o produto](produto.md){ .md-button .md-button--primary }
[Ver arquitetura](arquitetura.md){ .md-button }
[Consultar documentos](documentos.md){ .md-button }
</div>

## O problema

O cardápio institucional informa o que será servido, mas não registra preferências, avaliações ou restrições individuais. Isso limita o planejamento dos estudantes e reduz a quantidade de informações disponíveis para a gestão do RU estimar demanda e aceitação dos pratos.

## A proposta

O AvaliaRU reúne cardápio, preferências e feedback em uma única plataforma. O objetivo é apoiar decisões mais conscientes dos estudantes e produzir dados que possam contribuir para o planejamento do restaurante e a redução de desperdícios.

<div class="feature-grid" markdown>
<div class="feature-item" markdown>
### Cardápio interativo
Consulta semanal das refeições e opções oferecidas pelo RU.
</div>
<div class="feature-item" markdown>
### Favoritos e restrições
Preferências pessoais e alertas relacionados à alimentação do estudante.
</div>
<div class="feature-item" markdown>
### Avaliações
Notas e comentários para acompanhar a aceitação dos pratos.
</div>
<div class="feature-item" markdown>
### Gestão
Cadastro de pratos, cardápios e perfis de acesso do sistema.
</div>
</div>

## Perfis do sistema

| Perfil | Responsabilidades principais |
|---|---|
| **Estudante** | Consultar cardápio, registrar favoritos e restrições e avaliar refeições. |
| **Gestor RU** | Cadastrar pratos e cardápios e acompanhar informações das refeições. |
| **Administrador** | Gerenciar contas, perfis de acesso e rotinas administrativas. |

!!! info "Desenvolvimento incremental"
    O produto está em evolução. Algumas funcionalidades já possuem integração com persistência e autenticação, enquanto outras ainda passam por validação de interface e integração com o backend.

## Documentação

Esta página organiza os principais artefatos do projeto. Os documentos completos de Visão de Produto e Projeto e de Arquitetura permanecem disponíveis em PDF na seção [Documentos oficiais](documentos.md).
