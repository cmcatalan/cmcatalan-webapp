"use server"

import {checkIn, checkOut} from "@/services/attendancesService";

export interface AttendanceActionResponse {
    error?: string;
    value?: string;
}

export async function doCheckIn(userId: string): Promise<AttendanceActionResponse> {
    const attendance = await checkIn(userId);

    return !attendance
        ? {error: "error"}
        : {value: attendance.checkIn};
}

export async function doCheckOut(userId: string): Promise<AttendanceActionResponse> {
    const attendance = await checkOut(userId);
    return !attendance
        ? {error: "error"}
        : {};
}