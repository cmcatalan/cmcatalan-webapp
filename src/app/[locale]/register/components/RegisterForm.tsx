"use client";

import LanguageSelector from "@/components/LanguageSelector";
import { useTranslations } from "next-intl";
import { register, RegisterState } from "../actions/register";
import { useActionState } from "react";
import { Button, Select, SelectItem } from "@heroui/react";
import FormInput from "@/components/FormInput";
import { SelectContent } from "@/interfaces/SelectContent";
import { Link } from "@/i18n/navigation";

const formItems = [
  {
    id: "companyName",
  },
  {
    id: "firstName",
  },
  {
    id: "lastName",
  },
  {
    id: "email",
  },
  {
    id: "password",
    type: "password",
  },
];

interface RegisterFormProps {
  languages: SelectContent[];
  defaultLanguage: string;
}

export default function RegisterForm({ languages, defaultLanguage }: RegisterFormProps) {
  const t = useTranslations("RegisterPage");
  const initialState: RegisterState = {};
  const [state, formAction, isPending] = useActionState(register, initialState);

  return (
    <section className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen">
      <div className="w-full md:mt-0 sm:max-w-md xl:p-0 ">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-semibold text-center mb-4">{t("title")}</h1>
          <form action={formAction} className="space-y-4 md:space-y-6">
            {formItems.map((formItem) => (
              <FormInput
                key={formItem.id}
                id={formItem.id}
                label={t(`${formItem.id}.label`)}
                placeholder={t(`${formItem.id}.placeholder`)}
                type={formItem.type}
                error={state.errors?.[formItem.id as keyof typeof state.errors]}
              />
            ))}
            <Select
              id="languageId"
              name="languageId"
              label={t("languageId.label")}
              selectionMode="single"
              disallowEmptySelection
              defaultSelectedKeys={[defaultLanguage]}
            >
              {languages.map((language) => (
                <SelectItem key={language.key}>{language.label}</SelectItem>
              ))}
            </Select>
            <div>
              <Button type="submit" color="primary" fullWidth isLoading={isPending}>
                {t("submit.title")}
              </Button>
              {state.errors?.general && <p className="text-danger text-sm mt-1">{state.errors.general}</p>}
            </div>
            <p className="text-sm font-light ">
              {t("login.message")}{" "}
              <Link href="/login" className="font-medium text-primary-600 hover:underline">
                {t("login.link")}
              </Link>
            </p>
          </form>
          <div className="flex items-center justify-center">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </section>
  );
}
