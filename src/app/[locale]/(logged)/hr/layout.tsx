import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {ReactNode} from "react";

export default async function EmployeeLayout({children}: { children: ReactNode }) {
    const session = await auth();
    if (!session?.user || !session.user.roles.includes("HR"))
        redirect("/");

    return <>{children}</>;
}