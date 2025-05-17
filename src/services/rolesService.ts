"use server";

import {userApi} from "@/types";
import {Role} from "@/interfaces/Domain";
import {getListTranslations} from "@/services/tableTranslationsService";

export async function getRoles() {
    const {data} = await userApi.GET("/api/Role");
    if (!data) return [];
    const filteredData = data?.filter((role) => role.id !== process.env.SUPERADMIN_ROLEID) as Role[];

    const tableTranslations = await getListTranslations("roles", "name");

    return filteredData.map((role) => {
        const translatedName = tableTranslations.find(
            (translation) => translation.rowId === role.id
        )?.value;

        return {
            ...role,
            name: translatedName ?? role.name,
        };
    }) as Role[];
}

export async function getUserRoles(userId: string) {
    const {data} = await userApi.GET("/api/UserRole", {
        params: {
            query: {
                UserId: userId,
            },
        },
        cache: "no-store",
    });

    return data;
}
