import {domainApi} from "@/types";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {Department, WorkCenter} from "@/interfaces/Domain";
import ClientTable from "../../components/ClientTable";
import {Button} from "@heroui/react";
import Link from "next/link";
import {FaEye, FaPencil, FaPlus, FaTrash} from "react-icons/fa6";
import {getTranslations} from "next-intl/server";

export default async function DepartmentsPage() {
    const session = await auth();
    if (!session?.user.id) return redirect("/");

    const {data: workCentersData} = await domainApi.GET("/WorkCenters", {
        params: {
            query: {
                CompanyId: session.user.company,
            },
        },
    });

    const workCentersIds: string[] =
        (workCentersData ?? ([] as WorkCenter[])).filter((x) => x.id !== undefined).map((x) => x.id as string) ?? [];

    const {data: departmentsData} = await domainApi.GET("/Departments", {
        params: {
            query: {
                WorkCenterIds: workCentersIds.join(","),
            },
        },
    });

    const departments = (workCentersIds.length > 0 && departmentsData ? departmentsData : []) as Department[];

    const items = (departments ?? ([] as Department[]))
        .filter((x) => !x.deletedAt)
        .map((department) => ({
            name: department.name,
            workCenter: workCentersData?.find((x) => x.id === department.workCenterId)?.name,
            actions: (
                <div className="space-x-1 flex flex-row justify-center">
                    <Button color="primary" size="sm" isIconOnly aria-label="view" as={Link}
                            href={`/admin/departments/${department.id}`}>
                        <FaEye/>
                    </Button>
                    <Button color="warning" size="sm" isIconOnly aria-label="edit"
                            href={`/admin/departments/edit/${department.id}`} as={Link}>
                        <FaPencil/>
                    </Button>
                    <Button color="danger" size="sm" isIconOnly aria-label="delete" as={Link}
                            href={`/admin/departments/delete/${department.id}`}>
                        <FaTrash/>
                    </Button>
                </div>
            ),
        }));

    const t = await getTranslations("Tables.departments");

    return (
        <div className="space-y-4">
            <div>
                <h1 className="font-semibold text-lg text-center">{t("title")} </h1>
            </div>
            <div className="flex flex-row justify-center">
                <Button color="primary" startContent={<FaPlus/>} size="md" as={Link} href="/admin/departments/add">
                    {t("add")}
                </Button>
            </div>

            <ClientTable items={items} tableName="departments"/>
        </div>
    );
}
