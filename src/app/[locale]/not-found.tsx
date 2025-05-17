"use client";

import { useTranslations } from "next-intl";
import { Button } from "@heroui/react";
import { Link } from "@/i18n/navigation";

function NotFound() {
  const t = useTranslations("NotFoundPage");

  return (
    <section>
      <div className="flex flex-col justify-center items-center mx-auto md:h-screen">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary">
              404
            </h1>
            <p className="mb-4 text-lg">{t("title")}</p>
            <Button as={Link} color="primary" href="/">
              {t("button")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
