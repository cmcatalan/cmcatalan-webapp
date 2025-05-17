"use server";

import { auth } from "@/auth";
import { profileSchema } from "@/lib/zod";
import { userApi } from "@/types";
import { getTranslations } from "next-intl/server";

interface Errors {
  general?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
  languageId?: string;
  genderId?: string;
}

interface Values {
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
  languageId?: string;
  genderId?: string;
}

export interface ProfileState {
  errors?: Errors;
  success?: boolean;
  values?: Values;
}

export async function profile(prevSate: ProfileState, formData: FormData): Promise<ProfileState> {
  const t = await getTranslations("Profile");
  const values = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    phone: formData.get("phone") as string,
    birthDate: formData.get("birthDate") as string,
    languageId: formData.get("languageId") as string,
    genderId: formData.get("genderId") as string,
  };

  const schemaValidation = await profileSchema.safeParseAsync(values);

  if (!schemaValidation.success) {
    const errors = schemaValidation.error.flatten();
    const errorMessages: Errors = {};

    if (errors.formErrors.length > 0) {
      errorMessages.general = t(`errors.${errors.formErrors[0]}`) || t("errors.default");
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

    if (Object.keys(errors).length > 0) {
      return {
        errors: errorMessages,
        success: false,
      };
    }
  }

  try {
    const session = await auth();

    if (!session?.user.id) {
      return {
        errors: {
          general: t("errors.default"),
        },
        success: false,
        values: values,
      };
    }

    const { error } = await userApi.PUT("/api/User/{id}", {
      params: {
        path: {
          id: session.user.id,
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

    if (error) {
      return {
        errors: {
          general: t("errors.default"),
        },
        success: false,
        values: values,
      };
    }
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
