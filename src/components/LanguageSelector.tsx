"use client";

import { ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Select, SelectItem } from "@heroui/select";
import { routing } from "@/i18n/routing";

export default function LanguageSelector() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const locale = useLocale();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    router.push(`${pathname}?${params.toString()}`, {
      locale: e.target.value,
      scroll: true,
    });
  };

  return (
    <Select
      defaultSelectedKeys={[locale]}
      size="sm"
      className="w-20"
      onChange={handleChange}
      labelPlacement="outside-left"
      aria-label="locale selector"
      disallowEmptySelection
    >
      {routing.locales.map((toLocale: string) => (
        <SelectItem key={toLocale}>{toLocale}</SelectItem>
      ))}
    </Select>
  );
}
