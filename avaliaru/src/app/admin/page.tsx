import { auth } from "@/auth";
import AdminClient from "./client";

export default async function AdminPage() {
    const session = await auth();

    return (
        <AdminClient session={session} />
    );
}