import { domainApi } from "@/types";
import { redirect } from "next/navigation";
import EditDepartmentForm from "./components/EditDepartmentForm";
import { SelectContent } from "@/interfaces/SelectContent";
import { auth } from "@/auth";

interface EditDepartmentPageProps {
  params: Promise<{ departmentId: string }>;
}

export default async function EditDepartment({ params }: EditDepartmentPageProps) {
  const session = await auth();
  if (!session?.user.id) return redirect("/");

  const departmentId = (await params).departmentId;
  const { data } = await domainApi.GET("/Departments/{id}", {
    params: {
      path: {
        id: departmentId,
      },
    },
  });

  const { data: workCentersData } = await domainApi.GET("/WorkCenters", {
    params: {
      query: {
        CompanyId: session.user.company,
      },
    },
  });

  const workCenters = workCentersData
    ?.filter((x) => !x.deletedAt)
    .map((item) => ({
      key: item.id,
      label: item.name,
    })) as SelectContent[];

  if (!data?.id || !data.workCenterId) {
    redirect("/admin/departments");
  }

  return (
    <EditDepartmentForm
      id={departmentId}
      name={data.name ?? ""}
      selectedWorkCenter={data.workCenterId}
      workCenters={workCenters}
    />
  );
}
