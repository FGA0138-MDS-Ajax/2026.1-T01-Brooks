import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminClient from "./client";

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <AdminClient session={session} />;
}
