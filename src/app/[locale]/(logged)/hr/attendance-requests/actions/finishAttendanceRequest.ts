"use server";

import {domainApi} from "@/types";

export interface FinishAttendanceRequestActionResponse {
    error?: string;
}

export async function finishAttendanceRequest(requestId: string, statusId: string): Promise<FinishAttendanceRequestActionResponse> {
    const {error} = await domainApi.PATCH(
        "/ManualAttendanceRequests/{id}/status/{statusId}",
        {params: {path: {id: requestId, statusId: statusId}}});

    return error
        ? {error: "error"}
        : {};
}