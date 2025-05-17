import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {Role, roleMenus} from "@/config/menuConfig";

export default async function HomePage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const menuSections = (session.user.roles as Role[]).filter((role) => roleMenus[role]).map((role) => roleMenus[role]);
    redirect(menuSections[0]?.items[0]?.href ?? "/dashboard");
}
