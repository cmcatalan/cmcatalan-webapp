"use server";

import {domainApi} from "@/types";
import {getLocale} from "next-intl/server";
import {Language} from "@/interfaces/Domain";
import {getListTranslations} from "@/services/tableTranslationsService";

export async function getCurrentLanguageId(): Promise<string | undefined> {
    const locale = await getLocale();
    const {data: languageData} = await domainApi.GET("/Languages");

    return languageData?.find((language) => language.code === locale)?.id;
}

export async function getLanguages(): Promise<Language[]> {
    const {data} = await domainApi.GET("/Languages");
    if (!data) return [];

    const tableTranslations = await getListTranslations("languages", "name");

    return data.map((language) => {
        const translatedName = tableTranslations.find(
            (translation) => translation.rowId === language.id
        )?.value;

        return {
            ...language,
            name: translatedName ?? language.name,
        };
    }) as Language[];
}