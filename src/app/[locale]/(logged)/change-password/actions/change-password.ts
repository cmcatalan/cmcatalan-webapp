"use server";

import { changePasswordSchema } from "@/lib/zod";
import { userApi } from "@/types";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

interface ApiErrorResponse {
  type: string;
  title: string;
  status: number;
  instance: string;
  traceId: string;
}

interface Errors {
  general?: string;
  currentPassword?: string;
  password?: string;
  confirmPassword?: string;
}

export interface ChangePasswordState {
  errors?: Errors;
  success?: boolean;
}

export async function changePassword(prevSate: ChangePasswordState, formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
    return {};
  }

  const t = await getTranslations("ChangePasswordPage");
  const values = {
    currentPassword: formData.get("currentPassword"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const schemaValidation = await changePasswordSchema.safeParseAsync(values);

  if (!schemaValidation.success) {
    const errors = schemaValidation.error.flatten();
    const errorMessages: Errors = {};

    if (errors.formErrors.length > 0) {
      errorMessages.general = t(`errors.${errors.formErrors[0]}`) || t("errors.default");
    }

    if (errors.fieldErrors.currentPassword) {
      errorMessages.currentPassword = t(`errors.${errors.fieldErrors.currentPassword[0]}`) || t("errors.default");
    }

    if (errors.fieldErrors.password) {
      errorMessages.password = t(`errors.${errors.fieldErrors.password[0]}`) || t("errors.default");
    }
    if (errors.fieldErrors.confirmPassword) {
      errorMessages.confirmPassword = t(`errors.${errors.fieldErrors.confirmPassword[0]}`) || t("errors.default");
    }

    if (Object.keys(errors).length > 0) {
      return {
        errors: errorMessages,
      };
    }
  }

  const { response, error } = await userApi.PATCH("/api/User/{id}/password", {
    params: {
      path: {
        id: session.user.id,
      },
    },
    body: {
      currentPassword: values.currentPassword as string,
      newPassword: values.password as string,
    },
  });

  if (!response.ok) {
    const customError = error as unknown as ApiErrorResponse;
    return {
      errors: {
        general: t(customError.status === 401 ? "errors.invalidCurrentPassword" : "errors.default"),
      },
    };
  }

  return {
    success: true,
  };
}
