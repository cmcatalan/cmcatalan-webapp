import { userApi } from "@/types";
import { redirect } from "next/navigation";

interface DeleteUserPageProps {
  params: Promise<{ userId: string }>;
}

export default async function DeleteDepartment({ params }: DeleteUserPageProps) {
  const userId = (await params).userId;
  await userApi.DELETE("/api/User/{id}", {
    params: {
      path: {
        id: userId,
      },
    },
  });

  redirect("/admin/users");
}
