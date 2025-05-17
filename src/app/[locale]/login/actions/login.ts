"use server";

import { signIn } from "@/auth";
import { loginSchema } from "@/lib/zod";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

interface Errors {
  general?: string;
  email?: string;
  password?: string;
}

export interface LoginState {
  errors?: Errors;
}

export async function login(prevSate: LoginState, formData: FormData) {
  const t = await getTranslations("LoginPage");
  const values = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const schemaValidation = await loginSchema.safeParseAsync(values);

  if (!schemaValidation.success) {
    const errors = schemaValidation.error.flatten();
    const errorMessages: Errors = {};

    if (errors.formErrors.length > 0) {
      errorMessages.general = t(`errors.${errors.formErrors[0]}`) || t("errors.default");
    }

    if (errors.fieldErrors.email) {
      errorMessages.email = t(`email.errors.${errors.fieldErrors.email[0]}`) || t("errors.default");
    }

    if (errors.fieldErrors.password) {
      errorMessages.password = t(`password.errors.${errors.fieldErrors.password[0]}`) || t("errors.default");
    }

    if (Object.keys(errors).length > 0) {
      return {
        errors: errorMessages,
      };
    }
  }

  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof Error) {
      return {
        errors: {
          general: t(error.name === "CredentialsSignin" ? "errors.invalidCredentials" : "errors.default"),
        },
      };
    }
    return {
      errors: {
        general: t("errors.default"),
      },
    };
  }

  redirect("/");
}
