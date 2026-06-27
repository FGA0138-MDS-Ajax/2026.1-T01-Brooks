"use client";

import { Session } from "next-auth";
import GestorPage from "@/components/GestorPage/GestorPage";

export default function GestaoClient({ session }: { session: Session | null }) {
  return <GestorPage />;
}