"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { usuarioPerfis, type UsuarioPerfil } from "@/types/types";
import bcrypt from "bcryptjs";
import { asc, eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type UsuarioAdmin = {
  id: string;
  nome: string;
  email: string;
  perfil: UsuarioPerfil;
};

export type CadastroUsuarioAdmin = {
  nome: string;
  email: string;
  senha: string;
  perfil: UsuarioPerfil;
};

async function exigirAdministrador() {
  const session = await auth();

  if (!session?.user || session.user.perfil !== "adm") {
    throw new Error("Acesso permitido apenas para administradores.");
  }
}

export async function buscarUsuariosAdmin(): Promise<UsuarioAdmin[]> {
  await exigirAdministrador();

  const usuarios = await db
    .select({
      id: users.id,
      nome: users.name,
      email: users.email,
      perfil: users.perfil,
    })
    .from(users)
    .orderBy(asc(users.name));

  return usuarios.map((usuario) => ({
    id: usuario.id,
    nome: usuario.nome || "Usuario AvaliaRU",
    email: usuario.email || "E-mail nao informado",
    perfil: usuario.perfil,
  }));
}

export async function cadastrarUsuarioAdmin(
  dados: CadastroUsuarioAdmin,
): Promise<UsuarioAdmin> {
  await exigirAdministrador();

  const nome = dados.nome.trim();
  const email = dados.email.trim().toLocaleLowerCase("pt-BR");
  const senha = dados.senha;

  if (!nome || !email || !senha) {
    throw new Error("Preencha todos os campos obrigatorios.");
  }

  if (!email.includes("@")) {
    throw new Error("Informe um e-mail valido.");
  }

  if (senha.length < 8) {
    throw new Error("A senha deve ter pelo menos 8 caracteres.");
  }

  if (!usuarioPerfis.includes(dados.perfil)) {
    throw new Error("Selecione um perfil valido.");
  }

  const [usuarioExistente] = await db
    .select({ id: users.id, email: users.email, name: users.name })
    .from(users)
    .where(or(eq(users.email, email), eq(users.name, nome)));

  if (usuarioExistente?.email === email) {
    throw new Error("Este e-mail ja esta em uso.");
  }

  if (usuarioExistente?.name === nome) {
    throw new Error("Ja existe uma conta com este nome.");
  }

  const id = crypto.randomUUID();
  const passwordHash = await bcrypt.hash(senha, 10);

  await db.insert(users).values({
    id,
    name: nome,
    email,
    passwordHash,
    perfil: dados.perfil,
  });

  revalidatePath("/admin");

  return { id, nome, email, perfil: dados.perfil };
}
