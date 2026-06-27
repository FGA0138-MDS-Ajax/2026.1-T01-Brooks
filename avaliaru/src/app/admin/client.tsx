"use client";

import AdminPage from "@/components/AdminPage/AdminPage";
import type { UsuarioAdmin } from "@/actions/adminActions/usuarios";
import type { Session } from "next-auth";

export default function AdminClient({
  session,
  usuarios,
}: {
  session: Session;
  usuarios: UsuarioAdmin[];
}) {
  return <AdminPage session={session} usuariosIniciais={usuarios} />;
}
