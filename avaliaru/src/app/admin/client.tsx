"use client";

import AdminPage from "@/components/AdminPage/AdminPage";
import type { Session } from "next-auth";

export default function AdminClient({ session }: { session: Session }) {
  return <AdminPage session={session} />;
}
