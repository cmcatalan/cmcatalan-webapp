"use client";

import { useTranslations } from "next-intl";
import { Button } from "@heroui/react";
import { forgotPassword, ForgotPasswordState } from "../actions/forgot-password";
import LanguageSelector from "@/components/LanguageSelector";
import { useActionState } from "react";
import FormInput from "@/components/FormInput";

const formItem = {
  id: "email",
  autoComplete: "username",
};

export default function ForgotPasswordForm() {
  const t = useTranslations("ForgotPasswordPage");
  const initialState: ForgotPasswordState = {};
  const [state, formAction, isPending] = useActionState(forgotPassword, initialState);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen">
      <div className="w-full md:mt-0 sm:max-w-md xl:p-0 ">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-semibold text-center mb-4">{t("title")}</h1>
          <p className="mt-4">{t("message")}</p>
          <form action={formAction} className="space-y-4 md:space-y-6">
            <FormInput
              id={formItem.id}
              label={t(`${formItem.id}.label`)}
              placeholder={t(`${formItem.id}.placeholder`)}
              error={state.errors?.[formItem.id as keyof typeof state.errors]}
              autoComplete={formItem.autoComplete}
            />
            <Button type="submit" isLoading={isPending} color="primary" fullWidth className="mb-4">
              {t("submit.title")}
            </Button>
            {state?.errors?.general && <p className="text-danger text-sm">{state.errors.general}</p>}
            {state?.success && <p className="text-success text-sm">{t("success.message")}</p>}
          </form>
          <div className="flex items-centes justify-center">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>
  );
}
