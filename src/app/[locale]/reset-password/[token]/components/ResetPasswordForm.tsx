"use client";

import { Input } from "@heroui/input";
import { resetPassword, ResetState } from "../actions/reset-password";
import LanguageSelector from "@/components/LanguageSelector";
import { Button } from "@heroui/react";
import { useActionState } from "react";
import { useTranslations } from "next-intl";

interface Props {
  token: string;
}

export default function ResetPasswordForm({ token }: Props) {
  const t = useTranslations("ResetPasswordPage");
  const initialState: ResetState = {};
  const [state, formAction, isPending] = useActionState(resetPassword, initialState);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen">
      <div className="w-full md:mt-0 sm:max-w-md xl:p-0 ">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-semibold text-center mb-4">{t("title")}</h1>
          <p className="mt-4">{t("message")}</p>
          <form action={formAction} className="space-y-4 md:space-y-6">
            <div>
              <label
                className={`block mb-2 text-sm font-medium" ${state.errors?.password && "text-danger"}`}
                htmlFor="password"
              >
                {t("password.label")}
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                color={state.errors?.password ? "danger" : "default"}
                autoComplete="new-password"
                placeholder={t("password.placeholder")}
              />
              {state.errors?.password && <p className="text-danger text-sm mt-1">{state.errors.password}</p>}
            </div>
            <div>
              <label
                className={`block mb-2 text-sm font-medium" ${state.errors?.confirmPassword && "text-danger"}`}
                htmlFor="confirmPassword"
              >
                {t("confirmPassword.label")}
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                color={state.errors?.confirmPassword ? "danger" : "default"}
                autoComplete="new-password"
                placeholder={t("confirmPassword.placeholder")}
              />
              {state.errors?.confirmPassword && (
                <p className="text-danger text-sm mt-1">{state.errors.confirmPassword}</p>
              )}
            </div>
            <Input className="hidden" id="token" name="token" value={token} />
            <Button type="submit" color="primary" fullWidth className="mb-4" isLoading={isPending}>
              {t("submit.title")}
            </Button>
            {state.errors?.general && <p className="text-danger text-sm mt-1">{state.errors.general}</p>}
          </form>
          <div className="flex items-centes justify-center">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>
  );
}
