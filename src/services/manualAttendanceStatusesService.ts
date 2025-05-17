"use server";

import {domainApi} from "@/types";
import {ManualAttendanceStatus} from "@/interfaces/Domain";
import {getListTranslations} from "@/services/tableTranslationsService";

export async function getManualAttendanceStatuses(): Promise<ManualAttendanceStatus[]> {
    const {data} = await domainApi.GET("/ManualAttendanceStatuses");
    if (!data) return [];
    const tableTranslations = await getListTranslations("manual_attendance_statuses", "name");

    return data.map((a) => {
        const translatedName = tableTranslations.find(
            (translation) => translation.rowId === a.id
        )?.value;

        return {
            ...a,
            name: translatedName ?? a.name,
        };
    }) as ManualAttendanceStatus[];
}

