import { auth } from "@/auth";
import AddDepartmentForm from "./components/AddDepartmentForm";
import { redirect } from "next/navigation";
import { domainApi } from "@/types";
import { SelectContent } from "@/interfaces/SelectContent";

export default async function AddDepartmentPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
    return null;
  }

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

  return <AddDepartmentForm workCenters={workCenters} />;
}
