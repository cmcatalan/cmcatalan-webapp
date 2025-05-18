import { domainApi } from "@/types";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

interface ViewDepartmentPageProps {
  params: Promise<{ departmentId: string }>;
}

export default async function ViewDepartment({ params }: ViewDepartmentPageProps) {
  const t = await getTranslations("Crud.ViewDepartment");
  const departmentId = (await params).departmentId;
  const { data } = await domainApi.GET("/Departments/{id}", {
    params: {
      path: {
        id: departmentId,
      },
    },
  });

  if (!data?.id || !data?.workCenterId) redirect("/admin/departments");

  const { data: workCenterData } = await domainApi.GET("/WorkCenters/{id}", {
    params: {
      path: {
        id: data?.workCenterId,
      },
    },
  });

  if (!workCenterData?.name) redirect("/admin/departments");

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border-1 border-gray-200 rounded-2xl space-y-6">
      <h1 className="text-2xl font-bold text-center">{t("title")}</h1>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium">{t("id")}</p>
          <p className="text-base font-semibold">{data.id}</p>
        </div>
        <div>
          <p className="text-sm font-medium">{t("name")}</p>
          <p className="text-base font-semibold">{data.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium">{t("workCenter")}</p>
          <p className="text-base font-semibold">{workCenterData?.name}</p>
        </div>
      </div>
    </div>
  );
}
