"use server";

import { auth } from "@/auth";
import {addUserSchema} from "@/lib/zod";
import { userApi } from "@/types";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

interface Errors {
  general?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  password?: string;
  email?: string;
  birthDate?: string;
  languageId?: string;
  genderId?: string;
  roleIds?: string;
}

interface Values {
  firstName?: string;
  lastName?: string;
  phone?: string;
  password?: string;
  email?: string;
  birthDate?: string;
  languageId?: string;
  genderId?: string;
  roleIds?: string[];
}

export interface AddUserState {
  errors?: Errors;
  success?: boolean;
  values?: Values;
}

export async function addUser(prevSate: AddUserState, formData: FormData): Promise<AddUserState> {
  const session = await auth();

  if (!session?.user.company) redirect("/");

  const t = await getTranslations("AddUser");
  const values = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    birthDate: formData.get("birthDate") as string,
    languageId: formData.get("languageId") as string,
    genderId: formData.get("genderId") as string,
    roleIds: formData.getAll("roleIds") as string[],
  };

  const schemaValidation = await addUserSchema.safeParseAsync(values);

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

    if (errors.fieldErrors.password) {
      errorMessages.password = t(`errors.${errors.fieldErrors.password[0]}`) || t("errors.default");
    }

    if (errors.fieldErrors.email) {
      errorMessages.email = t(`errors.${errors.fieldErrors.email[0]}`) || t("errors.default");
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
        values: values,
      };
    }
  }

  try {
    const { error } = await userApi.POST("/api/User", {
      body: {
        firstName: values.firstName as string,
        lastName: values.lastName as string,
        email: values.email as string,
        phone: values.phone as string,
        password: values.password as string,
        birthDate: values.birthDate as string,
        languageId: values.languageId as string,
        genderId: values.genderId as string,
        isActive: true,
        roleIds: values.roleIds as string[],
        companyId: session.user.company,
      },
    });

    if (error) throw new Error();

  } catch {
    return {
      errors: {
        general: t("errors.default"),
      },
      success: false,
      values: values,
    };
  }

  redirect("/admin/users");
}
