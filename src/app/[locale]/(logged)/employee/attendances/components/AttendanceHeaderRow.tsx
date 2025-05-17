import {FaClock, FaHourglassEnd, FaRegClock} from "react-icons/fa6";
import {getTranslations} from "next-intl/server";

export default async function AttendanceHeaderRow() {
    const t = await getTranslations("Attendances");
    return (
        <li key="first" className="grid grid-cols-3 gap-2 text-center text-sm font-medium">
            <div className="flex flex-col items-center space-y-2">
            <span className="flex flex-col sm:flex-row items-center">
                <FaRegClock/>
                <span className="ml-1">{t("startTime")}</span>
            </span>
            </div>
            <div className="flex flex-col items-center space-y-2">
                <span className="flex flex-col sm:flex-row items-center">
                    <FaClock/>
                <span className="ml-1">{t("endTime")}</span>
                </span>
            </div>
            <div className="flex flex-col items-center space-y-2">
                <span className="flex flex-col sm:flex-row items-center">
                    <FaHourglassEnd/>
                <span className="ml-1">{t("time")}</span>
                </span>
            </div>
        </li>)
}