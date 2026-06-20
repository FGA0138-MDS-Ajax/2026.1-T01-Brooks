# Qualidade e testes

## Estratégia

A qualidade do AvaliaRU deve ser observada por verificação técnica e validação com os usuários. O planejamento oficial contempla testes unitários, de integração, de sistema e de usabilidade.

## Cenários prioritários

| ID | Cenário | Critério principal |
|---|---|---|
| CT01 | Exibição do cardápio | Apresentar corretamente refeições e acompanhamentos. |
| CT02 | Alertas de restrição | Destacar pratos incompatíveis com as restrições cadastradas. |
| CT03 | Cadastro de favoritos | Registrar e recuperar as preferências do estudante. |
| CT04 | Notificação de favorito | Avisar quando um prato favorito estiver disponível. |
| CT05 | Registro de avaliação | Persistir nota e comentário e confirmar o envio. |
| CT06 | Usabilidade mobile | Manter navegação e controles sem quebra de layout. |

## Métricas planejadas

- débito técnico acumulado;
- densidade de defeitos por funcionalidade;
- cobertura de testes automatizados;
- tempo médio de resposta;
- taxa de sucesso das notificações;
- adesão dos usuários às funcionalidades de valor.

## Metas

| Métrica | Meta apresentada no documento de visão |
|---|---|
| Defeitos críticos | Zero na versão entregue. |
| Cobertura automatizada | Pelo menos 80% das funcionalidades críticas. |
| Tempo de resposta | Média de até 2 segundos nas operações críticas. |
| Notificações essenciais | Taxa de sucesso de pelo menos 98%. |

!!! warning "Evidências em consolidação"
    Os roteiros e metas estão definidos nos documentos oficiais. Resultados executados, capturas e ciclos de correção devem ser atualizados pela equipe conforme os testes forem realizados.

## Testes existentes

O repositório já possui testes iniciais de actions relacionados ao cadastro de cardápio e prato do dia. Esses testes ainda passam por estabilização. A evolução esperada inclui corrigir os cenários existentes e ampliar a cobertura para componentes, autenticação, favoritos, restrições e avaliações.
