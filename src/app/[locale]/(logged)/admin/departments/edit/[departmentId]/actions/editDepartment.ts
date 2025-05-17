"use server";

import { auth } from "@/auth";
import { editDepartmentSchema } from "@/lib/zod";
import { domainApi } from "@/types";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

interface Errors {
  general?: string;
  id?: string;
  name?: string;
  workCenterId?: string;
}

export interface EditDepartmentState {
  errors?: Errors;
}

export async function editDepartment(prevSate: EditDepartmentState, formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
    return {};
  }
  const t = await getTranslations("Crud.EditDepartment");

  const values = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    workCenterId: formData.get("workCenterId") as string,
  };

  const schemaValidation = await editDepartmentSchema.safeParseAsync(values);

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

    if (errors.fieldErrors.workCenterId) {
      errorMessages.workCenterId = t(`errors.${errors.fieldErrors.workCenterId[0]}`) || t("errors.default");
    }

    if (Object.keys(errors).length > 0) {
      return {
        errors: errorMessages,
      };
    }
  }
  const { response } = await domainApi.PUT("/Departments/{id}", {
    params: {
      path: {
        id: values.id,
      },
    },
    body: {
      name: values.name as string,
      workCenterId: values.workCenterId as string,
    },
  });

  if (!response.ok) {
    return {
      errors: {
        general: t("errors.default"),
      },
    };
  }

  redirect("/admin/departments");
}
