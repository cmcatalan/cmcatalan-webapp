"use server";

import { resetPasswordSchema } from "@/lib/zod";
import { userApi } from "@/types";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

interface ApiErrorDetail {
  code: number;
  message: string;
}

interface ApiErrorResponse {
  type: string;
  title: string;
  status: number;
  instance: string;
  traceId: string;
  errors: ApiErrorDetail[];
}

interface Errors {
  general?: string;
  password?: string;
  confirmPassword?: string;
  token?: string;
}

export interface ResetState {
  errors?: Errors;
}

export async function resetPassword(prevSate: ResetState, formData: FormData) {
  const t = await getTranslations("ResetPasswordPage");
  const values = {
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    token: formData.get("token"),
  };

  const schemaValidation = await resetPasswordSchema.safeParseAsync(values);

  if (!schemaValidation.success) {
    const errors = schemaValidation.error.flatten();
    const errorMessages: Errors = {};

    if (errors.formErrors.length > 0) {
      errorMessages.general = t(`errors.${errors.formErrors[0]}`) || t("errors.default");
    }
    if (errors.fieldErrors.password) {
      errorMessages.password = t(`errors.${errors.fieldErrors.password[0]}`) || t("errors.default");
    }
    if (errors.fieldErrors.confirmPassword) {
      errorMessages.confirmPassword = t(`errors.${errors.fieldErrors.confirmPassword[0]}`) || t("errors.default");
    }
    if (errors.fieldErrors.token) {
      errorMessages.token = t(`errors.${errors.fieldErrors.token[0]}`) || t("errors.default");
    }

    if (Object.keys(errors).length > 0) {
      return {
        errors: errorMessages,
      };
    }
  }

  const { response, error } = await userApi.POST("/api/Auth/ResetPassword", {
    body: {
      newPassword: values.password as string,
      token: values.token as string,
    },
  });

  if (!response.ok) {
    const customError = error as unknown as ApiErrorResponse;
    return {
      errors: {
        general: t(`errors.${customError.errors[0]?.message}`) || t("errors.default"),
      },
    };
  }

  redirect("/login?resetPassword");
}
