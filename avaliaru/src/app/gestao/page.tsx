import { auth } from "@/auth";
import GestaoClient from "./client";

export default async function GestaoPage() {
    const session = await auth();

    return (
        <GestaoClient session={session} />
    );
}