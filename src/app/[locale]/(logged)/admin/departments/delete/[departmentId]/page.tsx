import { domainApi } from "@/types";
import { redirect } from "next/navigation";

interface DeleteDepartmentPageProps {
  params: Promise<{ departmentId: string }>;
}

export default async function DeleteDepartment({ params }: DeleteDepartmentPageProps) {
  const departmentId = (await params).departmentId;
  await domainApi.DELETE("/Departments/{id}", {
    params: {
      path: {
        id: departmentId,
      },
    },
  });

  redirect("/admin/departments");
}
