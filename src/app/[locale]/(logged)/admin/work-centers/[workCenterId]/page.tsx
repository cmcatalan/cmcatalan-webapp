import {domainApi} from "@/types";
import {getTranslations} from "next-intl/server";
import {redirect} from "next/navigation";

interface ViewWorkCenterPageProps {
    params: Promise<{ workCenterId: string }>;
}

export default async function ViewWorkCenter({params}: ViewWorkCenterPageProps) {
    const t = await getTranslations("Crud.ViewWorkCenter");
    const workCenterId = (await params).workCenterId;
    const {data} = await domainApi.GET("/WorkCenters/{id}", {
        params: {
            path: {
                id: workCenterId,
            },
        },
    });

    if (!data) {
        redirect("/admin/work-centers");
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border-1 border-gray-200 rounded-2xl space-y-6">
            <h1 className="text-2xl font-bold text-center ">{t("title")}</h1>
            <div className="space-y-4">
                <div>
                    <p className="text-sm font-medium">{t("id")}</p>
                    <p className="text-base font-semibold ">{data.id}</p>
                </div>
                <div>
                    <p className="text-sm font-medium">{t("name")}</p>
                    <p className="text-base font-semibold ">{data.name}</p>
                </div>
            </div>
        </div>
    );
}
