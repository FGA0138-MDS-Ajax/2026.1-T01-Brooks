# AvaliaRU

Projeto web desenvolvido com Next.js.

## Como iniciar o projeto

1. Crie o arquivo `.env.local` na raiz do projeto.
2. Combine com o grupo quais variáveis de ambiente serão necessárias para o funcionamento da aplicação.
3. Instale as dependências:

```bash
npm install
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Depois disso, o projeto ficará disponível em modo de desenvolvimento.

## Organização das pastas

- `/src/db`: arquivos e rotinas relacionados ao banco de dados.
- `/src/push_notifications`: implementação das notificações push.
- `/src/utils`: funções e códigos úteis compartilhados pelo projeto.
- `/src/types`: tipos e definições de tipos usados na aplicação.

## Observações

Antes de subir a aplicação, verifique se o arquivo `.env.local` está configurado corretamente e se todas as variáveis de ambiente esperadas pelo projeto foram definidas.


## Inicialização do banco de dados
```bash
    npx drizzle-kit generate #.../avaliaru/$
    npx drizzle-kit migrate #.../avaliaru/$
```

## Páginas e acesso

| Perfil | /dashboard | /gestao | /admin |
|---|---|---|---|
| Gestor Ru | Não | Sim | Não
| Aluno | Sim | Não | Não
| Admin | Não | Sim | Sim

## Banco de dados

Para que o banco de dados funcione corretamente com as tabelas corretas, faça o seguinte.

Se ainda não instalou os pacotes do projeto, (```Confira se você está na pasta /avaliaru ```) rode: 

```bash
$ npm -i
```

E para criar a migração e criar as tabela no arquivo .db, rode o seguinte comando (```Confira se você está na pasta /avaliaru ```):

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Testes

1. Certifique-se de ter o `.env.local` configurado e o banco correto definido em `DATABASE_URL`.

    Exemplo mínimo:

    ```env
    DATABASE_URL=file:./dev.db
    AUTH_URL=http://localhost:3000
    AUTH_SECRET=seu_secret_aqui
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Gere e aplique migrations antes de rodar testes que dependem do banco:

    ```bash
    npx drizzle-kit generate
    npx drizzle-kit migrate
    ```

4. Execute o teste de action diretamente com `tsx`:

    ```bash
    npx tsx src/actions/cardapioActions/__tests__/cadastrarCardapio.test.ts
    ```

    Ou, para o teste de prato do dia existente:

    ```bash
    npx tsx src/actions/pratoActions/__tests__/cadastrarPratoDoDia.test.ts
    ```

5. Se quiser forçar outro arquivo de banco, use `DATABASE_URL` na execução:

    ```bash
    DATABASE_URL=file:./avaliaru.db npx tsx src/actions/cardapioActions/__tests__/cadastrarCardapio.test.ts
    ```

### Observações sobre testes

- Os arquivos de teste estão organizados em `src/actions/*/__tests__/`.
- Os testes de script usam a lógica de banco isolada (`inserirCardapioNoBanco`, `inserirPratoDoDiaNoBanco`) e não dependem de UI.
- Em ambiente de teste, `revalidatePath()` pode ser ignorado sem afetar o resultado do insert.
- Verifique o banco correto ao abrir o viewer: se `DATABASE_URL=file:./dev.db`, abra `dev.db`.
