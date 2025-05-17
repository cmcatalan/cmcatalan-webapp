"use server";

import { auth } from "@/auth";
import { editWorkCenterSchema } from "@/lib/zod";
import { domainApi } from "@/types";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

interface Errors {
  general?: string;
  id?: string;
  name?: string;
}

export interface EditWorkCenterState {
  errors?: Errors;
}

export async function editWorkCenter(prevSate: EditWorkCenterState, formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
    return {};
  }
  const t = await getTranslations("Crud.EditWorkCenter");

  const values = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
  };

  const schemaValidation = await editWorkCenterSchema.safeParseAsync(values);

  if (!schemaValidation.success) {
    const errors = schemaValidation.error.flatten();
    const errorMessages: Errors = {};

    if (errors.formErrors.length > 0) {
      errorMessages.general = t(`errors.${errors.formErrors[0]}`) || t("errors.default");
    }
    if (errors.fieldErrors.id) {
      errorMessages.id = t("errors.default");
    }
    if (errors.fieldErrors.name) {
      errorMessages.name = t(`errors.${errors.fieldErrors.name[0]}`) || t("errors.default");
    }

    if (Object.keys(errors).length > 0) {
      return {
        errors: errorMessages,
      };
    }
  }

  const { data: timeZonesData } = await domainApi.GET("/TimeZones");

  if (!timeZonesData || !timeZonesData[0]) {
    return {
      errors: {
        general: t("errors.default"),
      },
    };
  }

  const timeZoneId = timeZonesData[0].id;

  const { response } = await domainApi.PUT("/WorkCenters/{id}", {
    params: {
      path: {
        id: values.id,
      },
    },
    body: {
      name: values.name as string,
      timezoneId: timeZoneId,
      companyId: session.user.company,
    },
  });

  if (!response.ok) {
    return {
      errors: {
        general: t("errors.default"),
      },
    };
  }

  redirect("/admin/work-centers");
}
