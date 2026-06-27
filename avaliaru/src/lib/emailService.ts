import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface ParametrosEmail {
  para: string;
  assunto: string;
  corpoHtml: string;
}

export async function enviarNotificacaoEmail({ para, assunto, corpoHtml }: ParametrosEmail) {
  const comando = new SendEmailCommand({
    Source: process.env.AWS_SES_EMAIL_SENDER,
    Destination: { ToAddresses: [para] },
    Message: {
      Subject: { Charset: "UTF-8", Data: assunto },
      Body: { Html: { Charset: "UTF-8", Data: corpoHtml } },
    },
  });

  try {
    const resposta = await sesClient.send(comando);
    console.log(`✉️ E-mail enviado com sucesso! MessageId: ${resposta.MessageId}`);
    return true; 
  } catch (erro) {
    console.error("❌ Erro ao disparar a notificação por e-mail:", erro);
    // Retorna false para não quebrar a rota principal do Next.js
    return false; 
  }
}