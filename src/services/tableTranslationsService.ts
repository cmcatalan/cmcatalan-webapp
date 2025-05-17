"use server";

import {domainApi} from "@/types";
import {getCurrentLanguageId} from "@/services/languagesService";
import {TableTranslation} from "@/interfaces/Domain";

export async function getListTranslations(tableName: string, columnName: string): Promise<TableTranslation[]> {
    const languageId = await getCurrentLanguageId();
    const {data: translationsData} = await domainApi.GET("/TableTranslations", {
        params: {
            query: {
                TableName: tableName,
                LanguageIds: languageId,
                ColumnName: columnName,
            },
        },
    })

    return translationsData ?? [];
}
