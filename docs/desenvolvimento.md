# Desenvolvimento

## Tecnologias

- **Next.js 16** e **React 19** para a aplicação web;
- **TypeScript** para tipagem e manutenção do código;
- **SQLite** como banco de dados;
- **Drizzle ORM** para modelagem e persistência;
- **NextAuth** para autenticação e sessões;
- **GitHub** para versionamento, revisão e integração do trabalho.

## Processo

O projeto utiliza desenvolvimento iterativo e incremental, organizado em Sprints semanais. A equipe combina práticas de Scrum para acompanhamento e revisão com práticas técnicas de XP, como integração contínua, refatoração e revisão por pares.

## Organização da equipe

| Área | Foco |
|---|---|
| Front-end | Interface, responsividade, acessibilidade e experiência dos perfis. |
| Back-end | Regras de negócio, actions, APIs e persistência. |
| Qualidade | Planejamento e execução de testes e validação dos requisitos. |
| Gestão e documentação | Sprints, acompanhamento, riscos e artefatos do projeto. |

## Estratégia de branches

1. Cada demanda é desenvolvida em uma branch própria.
2. Os commits registram mudanças pequenas e coerentes.
3. A entrega é submetida por Pull Request.
4. A equipe revisa antes da integração.
5. A branch `developer` concentra a versão de desenvolvimento.
6. A branch `main` deve receber apenas versões aprovadas para produção.

## Execução local

```bash
cd avaliaru
npm install
npm run dev
```

A aplicação também exige um arquivo `.env.local` com as configurações de banco e autenticação. Credenciais e bancos locais não devem ser versionados.

## Banco de dados

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
npm run db:seed
```

Esses comandos geram a estrutura, aplicam as migrações e cadastram os dados iniciais usados pelo ambiente de desenvolvimento.
