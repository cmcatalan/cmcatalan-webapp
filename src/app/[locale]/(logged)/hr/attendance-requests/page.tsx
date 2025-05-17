import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {getCompanyUsers} from "@/services/usersService";
import {FaClock, FaGear, FaRegClock, FaUser} from "react-icons/fa6";
import {getManualAttendanceRequests} from "@/services/manualAttendanceRequestsService";
import {formatInTimeZone} from "date-fns-tz";
import {defaultTimeZone, getLocaleForDateTime} from "@/utils/datetime";
import {getLocale, getTranslations} from "next-intl/server";
import FinishAttendanceRow from "@/app/[locale]/(logged)/hr/attendance-requests/components/FinishAttendanceRow";

export default async function AttendanceRequestsPage() {
    const session = await auth();
    if (!session?.user.id) return redirect("/");

    const t = await getTranslations("ManualAttendanceRequests");

    const users = await getCompanyUsers(session?.user.company);
    const manualAttendanceRequests = await getManualAttendanceRequests(session?.user.company, process.env.PENDING_MANUALATTENDANCESTATUSID!);
    if (manualAttendanceRequests.length === 0) {
        return <div className="md:max-w-screen-md md:mx-auto space-y-2">
            <h1 className="font-bold sm:text-2xl">{t("title")}</h1>
            <p>{t("empty")}</p>
        </div>;
    }

    const localeStr = await getLocale();
    const locale = getLocaleForDateTime(localeStr);

    const mappedData = manualAttendanceRequests.map((request) => {
        const user = users.find((user) => user.id === request.userId);
        return {
            requestId: request.id as string,
            userName: `${user?.firstName} ${user?.lastName}`.trim(),
            startDate: formatInTimeZone(new Date(request.checkIn!), defaultTimeZone, "Pp", {locale: locale}),
            endDate: formatInTimeZone(new Date(request.checkOut!), defaultTimeZone, "Pp", {locale: locale})
        };
    })

    return (
        <div className="md:max-w-screen-md md:mx-auto space-y-2">
            <h1 className="font-bold sm:text-2xl">{t("title")}</h1>
            <div className="rounded-lg shadow p-4 border">
                <ul className="space-y-2">
                    <li key="first" className="grid grid-cols-4 gap-2 text-center text-sm font-medium">
                        <div className="flex flex-col items-center space-y-2">
                            <span className="flex flex-col sm:flex-row items-center">
                                <FaUser/>
                                <span className="ml-1">{t("user")}</span>
                            </span>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <span className="flex flex-col sm:flex-row items-center">
                                <FaClock/>
                                <span className="ml-1">{t("startDate")}</span>
                            </span>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <span className="flex flex-col sm:flex-row items-center">
                                <FaRegClock/>
                                <span className="ml-1">{t("endDate")}</span>
                            </span>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <span className="flex flex-col sm:flex-row items-center">
                                <FaGear/>
                                <span className="ml-1">{t("actions")}</span>
                            </span>
                        </div>
                    </li>
                    {
                        mappedData.map((request) => {
                            return <FinishAttendanceRow
                                key={request.requestId}
                                requestId={request.requestId}
                                userName={request.userName}
                                startDate={request.startDate}
                                endDate={request.endDate}
                                acceptStatusId={process.env.ACCEPTED_MANUALATTENDANCESTATUSID!}
                                rejectStatusId={process.env.REJECTED_MANUALATTENDANCESTATUSID!}
                            />
                        })
                    }
                </ul>
            </div>
        </div>
    );
}