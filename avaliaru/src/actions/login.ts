"use server";

import { signIn } from "@/auth";
import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function loginUser(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    throw new Error("Credenciais inválidas");
  }

  const [user] = await db
    .select({ perfil: users.perfil })
    .from(users)
    .where(eq(users.email, email));

  const redirectTo =
    user?.perfil === "gestorru"
      ? "/gestao"
      : user?.perfil === "adm"
        ? "/admin"
        : "/dashboard";

  const result = await signIn("credentials", {
    email,
    password,
    redirectTo,
  });

  if (result)
  console.log("Login result:", result);
}