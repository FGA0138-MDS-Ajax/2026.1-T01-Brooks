import UserPage from "@/components/UserPage";
import { Session } from "next-auth";

export default function GestorClient({ session }: { session: Session }) {
    return <UserPage session={session} />;
}