"use server";

import { auth } from "@/auth";
import { editUserSchema } from "@/lib/zod";
import { userApi } from "@/types";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

interface Errors {
  general?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
  languageId?: string;
  genderId?: string;
  roleIds?: string;
}

interface Values {
  id?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
  languageId?: string;
  genderId?: string;
  roleIds?: string[];
}

export interface EditUserState {
  errors?: Errors;
  success?: boolean;
  values?: Values;
}

export async function editUser(prevSate: EditUserState, formData: FormData): Promise<EditUserState> {
  const session = await auth();

  if (!session?.user.company) redirect("/");

  const t = await getTranslations("EditUser");
  const values = {
    id: formData.get("id") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    phone: formData.get("phone") as string,
    birthDate: formData.get("birthDate") as string,
    languageId: formData.get("languageId") as string,
    genderId: formData.get("genderId") as string,
    roleIds: formData.getAll("roleIds") as string[],
  };

  const schemaValidation = await editUserSchema.safeParseAsync(values);

  if (!schemaValidation.success) {
    const errors = schemaValidation.error.flatten();
    const errorMessages: Errors = {};

    if (errors.formErrors.length > 0) {
      errorMessages.general = t(`errors.${errors.formErrors[0]}`) || t("errors.default");
    }

    if (errors.fieldErrors.id) {
      errorMessages.id = t(`errors.${errors.fieldErrors.id[0]}`) || t("errors.default");
    }

    if (errors.fieldErrors.firstName) {
      errorMessages.firstName = t(`errors.${errors.fieldErrors.firstName[0]}`) || t("errors.default");
    }

    if (errors.fieldErrors.lastName) {
      errorMessages.lastName = t(`errors.${errors.fieldErrors.lastName[0]}`) || t("errors.default");
    }

    if (errors.fieldErrors.phone) {
      errorMessages.phone = t(`errors.${errors.fieldErrors.phone[0]}`) || t("errors.default");
    }

    if (errors.fieldErrors.birthDate) {
      errorMessages.birthDate = t(`errors.${errors.fieldErrors.birthDate[0]}`) || t("errors.default");
    }

    if (errors.fieldErrors.languageId) {
      errorMessages.languageId = t(`errors.${errors.fieldErrors.languageId[0]}`) || t("errors.default");
    }

    if (errors.fieldErrors.genderId) {
      errorMessages.genderId = t(`errors.${errors.fieldErrors.genderId[0]}`) || t("errors.default");
    }

    if (errors.fieldErrors.roleIds) {
      errorMessages.roleIds = t(`errors.${errors.fieldErrors.roleIds[0]}`) || t("errors.default");
    }

    if (Object.keys(errors).length > 0) {
      return {
        errors: errorMessages,
        success: false,
      };
    }
  }

  try {
    const { error } = await userApi.PUT("/api/User/{id}", {
      params: {
        path: {
          id: values.id,
        },
      },
      body: {
        firstName: values.firstName as string,
        lastName: values.lastName as string,
        phone: values.phone as string,
        birthDate: values.birthDate as string,
        languageId: values.languageId as string,
        genderId: values.genderId as string,
        isActive: true,
      },
    });

    if (error) throw new Error();

    const { error: userRoleError } = await userApi.POST("/api/UserRole", {
      body: {
        companyId: session?.user.company,
        userId: values.id,
        roleIds: values.roleIds,
      },
    });
    if (userRoleError) throw new Error();
  } catch {
    return {
      errors: {
        general: t("errors.default"),
      },
      success: false,
      values: values,
    };
  }

  return {
    success: true,
    values: values,
  };
}
