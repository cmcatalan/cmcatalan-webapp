"use server";

import {domainApi} from "@/types";
import {Gender} from "@/interfaces/Domain";
import {getListTranslations} from "@/services/tableTranslationsService";

export async function getGenders(): Promise<Gender[]> {
    const {data} = await domainApi.GET("/Genders");
    if (!data) return [];
    const tableTranslations = await getListTranslations("genders", "name");

    return data.map((gender) => {
        const translatedName = tableTranslations.find(
            (translation) => translation.rowId === gender.id
        )?.value;

        return {
            ...gender,
            name: translatedName ?? gender.name,
        };
    }) as Gender[];
}

