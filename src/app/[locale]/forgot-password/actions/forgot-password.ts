"use server";

import { forgotPasswordSchema } from "@/lib/zod";
import { userApi } from "@/types";
import { getTranslations } from "next-intl/server";

interface Errors {
  general?: string;
  email?: string;
}

export interface ForgotPasswordState {
  errors?: Errors;
  success?: boolean;
}

export async function forgotPassword(prevSate: ForgotPasswordState, formData: FormData) {
  const t = await getTranslations("ForgotPasswordPage");

  const values = {
    email: formData.get("email"),
  };

  const schemaValidation = await forgotPasswordSchema.safeParseAsync(values);

  if (!schemaValidation.success) {
    const errors = schemaValidation.error.flatten();
    const errorMessages: Errors = {};

    if (errors.formErrors.length > 0) {
      errorMessages.general = t(`errors.${errors.formErrors[0]}`) || t("errors.default");
    }
    if (errors.fieldErrors.email) {
      errorMessages.email = t(`errors.${errors.fieldErrors.email[0]}`) || t("errors.default");
    }

    if (Object.keys(errors).length > 0) {
      return {
        errors: errorMessages,
      };
    }
  }

  const { response } = await userApi.POST("/api/Auth/ForgotPassword", {
    body: {
      email: formData.get("email") as string,
    },
  });

  if (response.ok || response.status === 404) return { success: true };

  return {
    errors: {
      general: t("errors.default"),
    },
  };
}
