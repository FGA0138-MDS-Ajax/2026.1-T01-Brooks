import UserPage from "@/components/UserPage";
import { Session } from "next-auth";

export default function AdminClient({ session }: { session: Session }) {
    return <UserPage session={session} />;
}