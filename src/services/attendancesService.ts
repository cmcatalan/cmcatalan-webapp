"use server";

import {domainApi} from "@/types";
import {Attendance} from "@/interfaces/Domain";

export async function getOpenAttendance(userId: string): Promise<Attendance | null> {
    const {data} = await domainApi.GET("/Attendances/{userId}/open", {params: {path: {userId: userId,}}});
    return !data ? null : data as Attendance;
}

export async function checkIn(userId: string): Promise<Attendance | null> {
    const {data} = await domainApi.POST("/Attendances/{userId}/CheckIn", {params: {path: {userId: userId,}}});
    return !data ? null : data as Attendance;
}

export async function checkOut(userId: string): Promise<Attendance | null> {
    const {data} = await domainApi.POST("/Attendances/{userId}/CheckOut", {params: {path: {userId: userId,}}});
    return !data ? null : data as Attendance;
}

export async function getUserAttendances(userId: string, startDate: string, endDate: string): Promise<Attendance[] | null> {

    const {data} = await domainApi.GET("/Attendances", {
        params: {
            query: {
                UserIds: userId,
                Start: startDate,
                End: endDate
            },
        },
    });

    return !data ? null : data as Attendance[];
}

export async function getAttendances(companyId: string, startDate: string, endDate: string): Promise<Attendance[] | null> {

    const {data} = await domainApi.GET("/Attendances", {
        params: {
            query: {
                CompanyId: companyId,
                Start: startDate,
                End: endDate
            },
        },
    })

    if (!data) return null;
    return data as Attendance[];
}