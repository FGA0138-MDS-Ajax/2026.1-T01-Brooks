import { buscarUsuariosAdmin } from "@/actions/adminActions/usuarios";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminClient from "./client";

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.perfil !== "adm") {
    redirect("/dashboard");
  }

  const usuarios = await buscarUsuariosAdmin();

  return <AdminClient session={session} usuarios={usuarios} />;
}
