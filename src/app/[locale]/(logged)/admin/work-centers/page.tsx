import {domainApi} from "@/types";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {WorkCenter} from "@/interfaces/Domain";
import ClientTable from "../../components/ClientTable";
import {Button} from "@heroui/react";
import Link from "next/link";
import {FaEye, FaPencil, FaPlus, FaTrash} from "react-icons/fa6";
import {getLocale, getTranslations} from "next-intl/server";

export default async function WorkCentersPage() {
    const session = await auth();
    if (!session?.user.id) return redirect("/");

    const {data} = await domainApi.GET("/WorkCenters", {
        params: {
            query: {
                CompanyId: session.user.company,
            },
        },
    });

    const locale = await getLocale();

    const items = (data ?? ([] as WorkCenter[]))
        .filter((x) => !x.deletedAt)
        .map((workCenter) => ({
            name: workCenter.name,
            actions: (
                <div className="space-x-1 flex flex-row justify-center">
                    <Button color="primary" size="sm" isIconOnly aria-label="view" as={Link}
                            href={`/${locale}/admin/work-centers/${workCenter.id}`}>
                        <FaEye/>
                    </Button>
                    <Button color="warning" size="sm" isIconOnly aria-label="edit" as={Link}
                            href={`/${locale}/admin/work-centers/edit/${workCenter.id}`}>
                        <FaPencil/>
                    </Button>
                    <Button color="danger" size="sm" isIconOnly aria-label="delete"
                            href={`/${locale}/admin/work-centers/delete/${workCenter.id}`}>
                        <FaTrash/>
                    </Button>
                </div>
            ),
        }));

    const t = await getTranslations("Tables.workCenters");

    return (
        <div className="space-y-4">
            <div>
                <h1 className="font-semibold text-lg text-center">{t("title")} </h1>
            </div>
            <div className="flex flex-row justify-center">
                <Button color="primary" startContent={<FaPlus/>} size="md" href={`/${locale}/admin/work-centers/add`} as={Link}>
                    {t("add")}
                </Button>
            </div>

            <ClientTable items={items} tableName="workCenters"/>
        </div>
    );
}
