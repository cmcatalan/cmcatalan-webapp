import {userApi} from "@/types";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import ClientTable from "../../components/ClientTable";
import Link from "next/link";
import {Button} from "@heroui/react";
import {FaEye, FaPencil, FaPlus, FaTrash} from "react-icons/fa6";
import {getTranslations} from "next-intl/server";

export default async function UsersPage() {
    const session = await auth();
    if (!session?.user.id) return redirect("/");

    const {data} = await userApi.GET("/api/User", {
        params: {
            query: {
                CompanyId: session.user.company,
            },
        },
    });

    const users =
        data?.items
            ?.filter((x) => !x.deletedAt)
            .map((user) => ({
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                birthDate: user.birthDate?.split("T")[0],
                actions: (
                    <div className="space-x-1 flex flex-row justify-center">
                        <Button color="primary" size="sm" isIconOnly aria-label="view" as={Link}
                                href={`/admin/users/${user.id}`}>
                            <FaEye/>
                        </Button>
                        <Button color="warning" size="sm" isIconOnly aria-label="edit"
                                href={`/admin/users/edit/${user.id}`} as={Link}>
                            <FaPencil/>
                        </Button>
                        <Button color="danger" size="sm" isIconOnly aria-label="delete"
                                href={`/admin/users/delete/${user.id}`} as={Link}>
                            <FaTrash/>
                        </Button>
                    </div>
                ),
            })) ?? [];

    const t = await getTranslations("Tables.users");

    return (
        <div className="space-y-4">
            <div>
                <h1 className="font-semibold text-lg text-center">{t("title")} </h1>
            </div>
            <div className="flex flex-row justify-center">
                <Button color="primary" startContent={<FaPlus/>} size="md" href="/admin/users/add" as={Link}>
                    {t("add")}
                </Button>
            </div>
            <ClientTable tableName={"users"} items={users}/>
        </div>
    );
}
