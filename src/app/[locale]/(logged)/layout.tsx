import {auth} from "@/auth";
import {redirect} from "next/navigation";
import ClientLayout from "./components/ClientLayout";
import {ReactNode} from "react";
import {getOpenAttendance} from "@/services/attendancesService";

export default async function Layout({children}: { children: ReactNode }) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }


    const openAttendance = session.user.roles.includes("Employee")
        ? await getOpenAttendance(session.user.id)
        : null;

    return <ClientLayout user={session.user} openAttendance={openAttendance}>{children}</ClientLayout>;
}
