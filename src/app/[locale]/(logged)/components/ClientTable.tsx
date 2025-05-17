"use client";

import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@heroui/react";
import {useTranslations} from "next-intl";

export interface ClientTableProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: Record<string, any>[];
    tableName: string;
}

export default function ClientTable({items, tableName}: ClientTableProps) {
    const t1 = useTranslations("Table");
    const t2 = useTranslations(`Tables.${tableName}`);
    if (!items || items.length === 0 || !items[0]) {
        return <p>{t1("noData")}</p>;
    }

    const columns = Object.keys(items[0]);

    return (
        <Table aria-label="Table">
            <TableHeader>
                {columns.map((col) => (
                    <TableColumn key={col} className="text-center">
                        {t2(col)}
                    </TableColumn>
                ))}
            </TableHeader>
            <TableBody>
                {items.map((item, rowIndex) => (
                    <TableRow key={item.id ?? rowIndex}>
                        {columns.map((col) => (
                            <TableCell key={`${col}.${item.id}`} className="text-center">
                                {item[col]}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
