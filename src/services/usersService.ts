"use server";

import {userApi} from "@/types";
import {User} from "@/interfaces/Domain";

export async function getCompanyUsers(companyId: string): Promise<User[]> {
    const {data} = await userApi.GET("/api/User", {
        params: {
            query: {
                CompanyId: companyId
            }
        }
    });

    if (!data?.items) return [];
    return data.items as User[];
}

