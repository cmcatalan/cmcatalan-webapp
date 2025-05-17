"use client";

import LanguageSelector from "@/components/LanguageSelector";
import { Button } from "@heroui/react";
import { useActionState } from "react";
import { changePassword, ChangePasswordState } from "../actions/change-password";
import FormInput from "@/components/FormInput";
import { useTranslations } from "next-intl";

const formItems = [
  {
    id: "currentPassword",
    type: "password",
    autoComplete: "current-password",
  },
  {
    id: "password",
    type: "password",
    autoComplete: "new-password",
  },
  {
    id: "confirmPassword",
    type: "password",
    autoComplete: "new-password",
  },
];

export default function ChangePasswordForm() {
  const t = useTranslations("ChangePasswordPage");
  const initialState: ChangePasswordState = {};
  const [state, formAction, isPending] = useActionState(changePassword, initialState);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
      <div className="w-full md:mt-0 sm:max-w-md xl:p-0 ">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-semibold text-center mb-4">{t("title")}</h1>
          <p className="mt-4">{t("message")}</p>
          <form action={formAction} className="space-y-4 md:space-y-6">
            {formItems.map((formItem) => (
              <FormInput
                key={formItem.id}
                id={formItem.id}
                label={t(`${formItem.id}.label`)}
                placeholder={t(`${formItem.id}.placeholder`)}
                type={formItem.type}
                error={state.errors?.[formItem.id as keyof typeof state.errors]}
                autoComplete={formItem.autoComplete}
              />
            ))}
            <Button type="submit" color="primary" fullWidth className="mb-4" isLoading={isPending}>
              {t("submit.title")}
            </Button>
            {state.errors?.general && <p className="text-danger text-sm mt-1">{state.errors.general}</p>}
            {state.success && <p className="text-success text-sm mt-1">{t("success.message")}</p>}
          </form>
          <div className="flex items-centes justify-center">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>
  );
}
