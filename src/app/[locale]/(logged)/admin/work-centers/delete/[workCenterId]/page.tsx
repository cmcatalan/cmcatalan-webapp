import { domainApi } from "@/types";
import { redirect } from "next/navigation";

interface DeleteWorkCenterPageProps {
  params: Promise<{ workCenterId: string }>;
}

export default async function DeleteWorkCenter({ params }: DeleteWorkCenterPageProps) {
  const workCenterId = (await params).workCenterId;
  await domainApi.DELETE("/WorkCenters/{id}", {
    params: {
      path: {
        id: workCenterId,
      },
    },
  });

  redirect("/admin/work-centers");
}
