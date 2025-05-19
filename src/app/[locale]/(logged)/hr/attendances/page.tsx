import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {getLocale, getTranslations} from "next-intl/server";
import {getCompanyUsers} from "@/services/usersService";
import {getAttendances} from "@/services/attendancesService";
import {formatInTimeZone, toZonedTime} from "date-fns-tz";
import {defaultHourFormat, defaultTimeZone, getLocaleForDateTime, timeCounter} from "@/utils/datetime";
import {FaArrowLeft, FaArrowRight, FaClock, FaHourglassEnd, FaRegClock, FaUser} from "react-icons/fa6";
import {addDays, differenceInMinutes, format} from "date-fns";
import {orderBy} from "lodash";
import Link from "next/link";
import {Button} from "@heroui/react";
import {TZDate} from "@date-fns/tz";

interface AttendancesPageProps {
    searchParams: Promise<{ date?: string }>
}

export default async function AttendancesPage({searchParams}: AttendancesPageProps) {
    const session = await auth();
    if (!session?.user.id) return redirect("/");

    const {date} = await searchParams;

    const t = await getTranslations("Attendances");

    const users = await getCompanyUsers(session?.user.company);

    let parsedDate = new Date();

    const haveDate = date && !isNaN(new Date(date).getTime());
    if (!haveDate) {
        const now = new TZDate(new Date(), defaultTimeZone);
        const d = encodeURI(format(now, "yyyy-MM-dd"));
        redirect(`/hr/attendances?date=${d}`);
    }

    if (haveDate) {
        const splits = date.split("-");
        const year = parseInt(splits[0]!);
        const month = parseInt(splits[1]!) - 1;
        const day = parseInt(splits[2]!);

        parsedDate = new TZDate(year, month, day, 0, 0, 0, 0, defaultTimeZone);
    }

    const parsedStart = haveDate ? parsedDate : toZonedTime(parsedDate, defaultTimeZone);
    parsedStart.setHours(0, 0, 0, 0);
    const start = parsedStart.toISOString();

    const parsedEnd = haveDate ? parsedDate : toZonedTime(parsedDate, defaultTimeZone);
    parsedEnd.setHours(23, 59, 59, 999);
    const end = parsedStart.toISOString();

    const attendances = await getAttendances(session?.user.company, start, end);
    const localeStr = await getLocale();
    const locale = getLocaleForDateTime(localeStr);

    const mappedData = attendances?.map((a) => {
        const user = users.find((user) => user.id === a.userId);
        let time = "";

        if (a.checkOut) {
            const minDiff = differenceInMinutes(a.checkOut, a.checkIn!);
            const sumHours = Math.floor(minDiff / 60);
            const sumMinutes = minDiff % 60;
            time = timeCounter(sumHours, sumMinutes);
        }

        return {
            id: a.id,
            firstName: user?.firstName ?? " ",
            lastName: user?.lastName ?? " ",
            startDate: formatInTimeZone(new Date(a.checkIn!), defaultTimeZone, defaultHourFormat, {locale: locale}),
            endDate: a.checkOut
                ? formatInTimeZone(new Date(a.checkOut!), defaultTimeZone, defaultHourFormat, {locale: locale})
                : "",
            elapsedTime: time,
        };
    });

    const formattedDate = formatInTimeZone(parsedStart, defaultTimeZone, "PPPP", {locale: locale});
    const ordered = orderBy(mappedData, ["startDate"], ["desc"]);

    const minusDay = encodeURI(format(addDays(parsedStart, -1), "yyyy-MM-dd"));
    const plusDay = encodeURI(format(addDays(parsedStart, 1), "yyyy-MM-dd"));

    const todayStart = toZonedTime(new Date(), defaultTimeZone);
    todayStart.setHours(0, 0, 0, 0);
    const isAvailableTomorrow = parsedStart < todayStart;

    return (
        <div className="md:max-w-screen-md md:mx-auto space-y-2">
            <h1 className="font-bold sm:text-2xl mb-2">{t("dayTitle")}</h1>
            <div className="font-semibold space-x-2 flex flex-row items-center mb-2 w-full justify-center">
                <Button isIconOnly aria-label={t("ariaPreviousDay")} size="sm" as={Link}
                        href={`?date=${minusDay}`}>
                    <FaArrowLeft/>
                </Button>
                <span>{formattedDate}</span>
                {isAvailableTomorrow &&
                    <Button isIconOnly aria-label={t("ariaNextDay")} size="sm"
                            href={`?date=${plusDay}`} as={Link}>
                        <FaArrowRight/>
                    </Button>
                }
            </div>
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
                                <span className="ml-1">{t("startTime")}</span>
                            </span>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <span className="flex flex-col sm:flex-row items-center">
                                <FaRegClock/>
                                <span className="ml-1">{t("endTime")}</span>
                            </span>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                            <span className="flex flex-col sm:flex-row items-center">
                                <FaHourglassEnd/>
                                <span className="ml-1">{t("time")}</span>
                            </span>
                        </div>
                    </li>
                    {ordered?.map((a) => {
                            return (
                                <li key={a.id}
                                    className="grid grid-cols-4 gap-2 text-sm w-full p-2 border rounded-md mx-auto shadow-sm">
                                    <div className="flex flex-col justify-center items-center truncate">
                                        <p>{a.firstName}</p>
                                        <p>{a.lastName}</p>
                                    </div>
                                    <div
                                        className="flex items-center justify-center">{a.startDate}</div>
                                    <div className="flex items-center justify-center">{a.endDate ? a.endDate :
                                        <span className="flex items-center gap-1 text-sm ">
                                            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse"/>
                                            <span className="ml-1">{t("ongoing")}</span>
                                        </span>}
                                    </div>
                                    <div className="flex items-center justify-center">{a.elapsedTime}</div>
                                </li>)
                        }
                    )}
                </ul>
            </div>
        </div>
    );
}