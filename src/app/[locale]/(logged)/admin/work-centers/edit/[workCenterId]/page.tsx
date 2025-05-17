import { domainApi } from "@/types";
import { redirect } from "next/navigation";
import EditWorkCenterForm from "./components/EditWorkCenterForm";

interface ViewWorkCenterPageProps {
  params: Promise<{ workCenterId: string }>;
}

export default async function EditWorkCenter({ params }: ViewWorkCenterPageProps) {
  const workCenterId = (await params).workCenterId;
  const { data } = await domainApi.GET("/WorkCenters/{id}", {
    params: {
      path: {
        id: workCenterId,
      },
    },
  });

  if (!data?.id) {
    redirect("/admin/work-centers");
  }

  return <EditWorkCenterForm id={data.id} name={data.name ?? ""} />;
}
