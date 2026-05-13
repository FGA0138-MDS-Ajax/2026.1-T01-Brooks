# AvaliarU

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
