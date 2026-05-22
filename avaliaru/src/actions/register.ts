"use server";

import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

/**
 * Registra um novo usuário no sistema.
 * @param formData - Os dados do formulário de registro, contendo email, senha e nome do usuário. 
 * @returns { success: boolean } - Indica se o registro foi bem-sucedido.
 * @throws { Error } - Lança erros se o e-mail já estiver em uso ou se os dados forem inválidos.
 */
export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password) {
    throw new Error("E-mail e senha são obrigatórios.");
  }


  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser) {
    throw new Error("Este e-mail já está em uso.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    name,
    email,
    passwordHash: hashedPassword,
    perfil: "aluno", 
  });

  return redirect("/login");
}