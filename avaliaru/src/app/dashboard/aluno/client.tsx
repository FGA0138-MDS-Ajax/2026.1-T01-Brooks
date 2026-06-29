import UserPage from "@/components/UserPage";
import { Session } from "next-auth";

export default function AlunoClient({ session }: { session: Session }) {
    return <UserPage session={session} />;
}