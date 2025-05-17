"use server";

import { signIn } from "@/auth";
import { registerSchema } from "@/lib/zod";
import { userApi } from "@/types";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

interface Errors {
  general?: string;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  languageId?: string;
}

export interface RegisterState {
  errors?: Errors;
}

export async function register(prevSate: RegisterState, formData: FormData) {
  const t = await getTranslations("RegisterPage");
  const values = {
    companyName: formData.get("companyName"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    languageId: formData.get("languageId"),
  };

  const schemaValidation = await registerSchema.safeParseAsync(values);

  if (!schemaValidation.success) {
    const errors = schemaValidation.error.flatten();
    const errorMessages: Errors = {};

    if (errors.formErrors.length > 0) {
      errorMessages.general = t(`errors.${errors.formErrors[0]}`) || t("errors.default");
    }

    if (errors.fieldErrors.companyName) {
      errorMessages.companyName = t(`errors.${errors.fieldErrors.companyName[0]}`) || t("errors.default");
    }

    if (errors.fieldErrors.firstName) {
      errorMessages.firstName = t(`errors.${errors.fieldErrors.firstName[0]}`) || t("errors.default");
    }

    if (errors.fieldErrors.lastName) {
      errorMessages.lastName = t(`errors.${errors.fieldErrors.lastName[0]}`) || t("errors.default");
    }

    if (errors.fieldErrors.email) {
      errorMessages.email = t(`errors.${errors.fieldErrors.email[0]}`) || t("errors.default");
    }

    if (errors.fieldErrors.password) {
      errorMessages.password = t(`errors.${errors.fieldErrors.password[0]}`) || t("errors.default");
    }

    if (errors.fieldErrors.languageId) {
      errorMessages.languageId = t(`errors.${errors.fieldErrors.languageId[0]}`) || t("errors.default");
    }

    if (Object.keys(errors).length > 0) {
      return {
        errors: errorMessages,
      };
    }
  }

  try {
    const { error } = await userApi.POST("/api/Auth/SignUp", {
      body: {
        ...values,
        companyName: values.companyName as string,
        firstName: values.firstName as string,
        lastName: values.lastName as string,
        email: values.email as string,
        password: values.password as string,
        languageId: values.languageId as string,
      },
    });
    if (error) {
      return {
        errors: {
          general: t("errors.default"),
        },
      };
    }

    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
  } catch {
    return {
      errors: {
        general: t("errors.default"),
      },
    };
  }

  redirect("/");
}
