import {redirect} from "next/navigation";
import {auth} from "@/auth";
import AddManualAttendanceRequestForm
    from "@/app/[locale]/(logged)/employee/attendances/add/components/AddManualAttendanceRequestForm";


export default async function AddManualAttendanceRequestPage() {
    const session = await auth();
    if (!session?.user.id) redirect("/");

    return <AddManualAttendanceRequestForm/>;
}
