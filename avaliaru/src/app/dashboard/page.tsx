import { auth } from "@/auth";
import DashboardClient from "./client";

export default async function DashboardPage() {
    const session = await auth();

    return (
        <DashboardClient session={session} />
    );
}