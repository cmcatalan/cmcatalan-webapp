import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {getUserAttendances} from "@/services/attendancesService";
import {groupBy, sumBy} from 'lodash';
import {formatInTimeZone, toZonedTime} from 'date-fns-tz';
import {ca, enGB, es, Locale} from 'date-fns/locale';
import {getLocale, getTranslations} from "next-intl/server";
import AttendanceRow from "@/app/[locale]/(logged)/employee/attendances/components/AttendanceRow";
import {defaultTimeZone, getMondayOfWeek, timeCounter} from "@/utils/datetime";
import AttendanceHeaderRow from "@/app/[locale]/(logged)/employee/attendances/components/AttendanceHeaderRow";
import {differenceInMinutes, format, getWeek, setWeek} from "date-fns";
import Link from "next/link";
import {Button} from "@heroui/react";
import {FaArrowLeft, FaArrowRight, FaPlus} from "react-icons/fa6";

interface AttendancesPageProps {
    searchParams: Promise<{ week?: string }>
}

export default async function AttendancesPage({searchParams}: AttendancesPageProps) {
    const session = await auth();
    if (!session?.user.id) return redirect("/");

    const timeZone = defaultTimeZone;
    const currentDate = new Date();
    let mondayInZone = getMondayOfWeek(currentDate, timeZone);
    const {week: searchParamsWeek} = await searchParams;
    const receivedWeek = parseInt(searchParamsWeek ?? '');
    const currentWeek = getWeek(mondayInZone);

    if (receivedWeek && !isNaN(receivedWeek)) {
        if (receivedWeek < currentWeek)
            mondayInZone = setWeek(mondayInZone, receivedWeek);
    }

    const sundayInZone = new Date(mondayInZone);
    sundayInZone.setDate(mondayInZone.getDate() + 6);
    sundayInZone.setHours(23, 59, 59, 999);

    const attendances = await getUserAttendances(session.user.id, mondayInZone.toUTCString(), sundayInZone.toUTCString());
    const localeStr = await getLocale();
    const localeMap: Record<string, Locale> = {
        es,
        en: enGB,
        ca,
    };
    const locale = localeMap[localeStr]!;

    const grouped = groupBy(attendances, a =>
        toZonedTime(new Date(a.checkIn!), timeZone).getDay()
    );

    const sum = sumBy(attendances?.filter(a => a.checkOut), a => differenceInMinutes(new Date(a.checkOut!), new Date(a.checkIn!)));
    const sumHours = Math.floor(sum / 60);
    const sumMinutes = sum % 60;
    const sumTime = timeCounter(sumHours, sumMinutes);
    const mondayStr = format(mondayInZone, 'dd/MM/yyyy');
    const sundayStr = format(sundayInZone, 'dd/MM/yyyy');
    const week = getWeek(mondayInZone);
    const isAvailableNextWeek = week < currentWeek;

    const t = await getTranslations("Attendances");

    return (
        <div className="md:max-w-screen-md md:mx-auto">
            <Button className="mb-2" aria-label={t("ariaPreviousWeek")} color="primary" startContent={<FaPlus/>}
                    as={Link} href="/employee/attendances/add">
                {t("add")}
            </Button>
            <div className="flex flex-col xs:flex-row items-center justify-between mb-4">
                <div className="font-semibold space-x-2 flex flex-row items-center mb-2">
                    <Button isIconOnly aria-label={t("ariaPreviousWeek")} size="sm" as={Link}
                            href={`?week=${week - 1}`}>
                        <FaArrowLeft/>
                    </Button>
                    <span>{mondayStr} - {sundayStr}</span>
                    {isAvailableNextWeek &&
                        <Button isIconOnly aria-label={t("ariaNextWeek")} size="sm" as={Link}
                                href={`?week=${week + 1}`}>
                            <FaArrowRight/>
                        </Button>
                    }

                </div>
                <h1 className="font-bold sm:text-2xl">{t("weekTitle", {week})}</h1>
                <p>{t("ariaTotalWorkedTime")} {sumTime}</p>
            </div>
            <div className="space-y-6">
                {Object.entries(grouped).map(([day, entries]) => {
                    const currentDate = new Date(entries[0]!.checkIn!);
                    const dayName = formatInTimeZone(currentDate, timeZone, 'PPPP', {locale: locale});

                    return (
                        <div key={day} className="rounded-lg shadow p-4 border">
                            <div
                                className="flex justify-between sm:text-lg font-semibold mb-3 border-b pb-2">
                                <div>{dayName}</div>
                            </div>
                            <ul className="space-y-2">
                                <AttendanceHeaderRow/>
                                {entries.map((y, index) =>
                                    <AttendanceRow key={index} attendance={y} timeZone={timeZone}/>)}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}