import {domainApi} from "@/types";
import {ManualAttendanceRequest} from "@/interfaces/Domain";

export async function getManualAttendanceRequests(companyId: string, statusId: string): Promise<ManualAttendanceRequest[]> {
    const {data} = await domainApi.GET("/ManualAttendanceRequests", {
        params: {
            query: {
                CompanyId: companyId,
                StatusId: statusId
            }
        }
    });
    if (!data) return [];

    return data as ManualAttendanceRequest[];
}
