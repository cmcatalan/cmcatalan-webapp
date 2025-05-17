"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Button, Select, SelectItem } from "@heroui/react";
import FormInput from "@/components/FormInput";
import { SelectContent } from "@/interfaces/SelectContent";
import { editUser, EditUserState } from "../actions/editUser";
import Loader from "@/components/Loader";

export interface EditUserFormProps {
  id: string;
  languages: SelectContent[];
  languageId: string;
  genders: SelectContent[];
  genderId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  roles: SelectContent[];
  roleIds: string[];
}

const initialState: EditUserState = {};

export default function EditUserForm({
  id,
  languages,
  languageId,
  genders,
  genderId,
  firstName,
  lastName,
  email,
  phone,
  birthDate,
  roles,
  roleIds,
}: EditUserFormProps) {
  const t = useTranslations("EditUser");
  const [state, formAction, isPending] = useActionState(editUser, initialState);

  if (isPending) {
    return <Loader />;
  }

  const formItems = [
    {
      id: "id",
      defaultValue: state.values?.id ?? id,
      hidden: true,
    },
    {
      id: "firstName",
      defaultValue: state.values?.firstName ?? firstName,
    },
    {
      id: "lastName",
      defaultValue: state.values?.lastName ?? lastName,
    },
    {
      id: "email",
      defaultValue: email,
      isDisabled: true,
    },
    {
      id: "phone",
      defaultValue: state.values?.phone ?? phone,
    },
    {
      id: "birthDate",
      type: "date",
      defaultValue: state.values?.birthDate ?? birthDate,
    },
  ];
  const selectedGenderId = state.values?.genderId ?? genderId;
  const selectedLanguageId = state.values?.languageId ?? languageId;

  return (
    <section className="flex flex-col items-center px-6 py-8 mx-auto space-y-4">
      <h1 className="text-xl font-semibold text-center">{t("title")}</h1>
      <form action={formAction} className="space-y-4 md:space-y-6 w-full max-w-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {formItems.map((formItem) => (
            <FormInput
              key={formItem.id}
              id={formItem.id}
              label={!formItem.hidden ? t(`${formItem.id}.label`) : ""}
              placeholder={!formItem.hidden ? t(`${formItem.id}.placeholder`) : ""}
              type={formItem.type}
              error={state.errors?.[formItem.id as keyof typeof state.errors]}
              defaultValue={formItem.defaultValue}
              isDisabled={formItem.isDisabled}
              hidden={formItem.hidden}
            />
          ))}
          <div>
            <Select
              id="languageId"
              name="languageId"
              label={t("languageId.label")}
              selectionMode="single"
              disallowEmptySelection
              defaultSelectedKeys={[selectedLanguageId]}
            >
              {languages.map((language) => (
                <SelectItem key={language.key}>{language.label}</SelectItem>
              ))}
            </Select>
            {state.errors?.languageId && <p className="text-danger text-sm mt-1">{state.errors?.languageId}</p>}
          </div>
          <div>
            <Select
              id="genderId"
              name="genderId"
              label={t("genderId.label")}
              selectionMode="single"
              disallowEmptySelection
              defaultSelectedKeys={[selectedGenderId]}
            >
              {genders.map((gender) => (
                <SelectItem key={gender.key}>{gender.label}</SelectItem>
              ))}
            </Select>
            {state.errors?.genderId && <p className="text-danger text-sm mt-1">{state.errors?.genderId}</p>}
          </div>
          <div>
            <Select
              id="roleIds"
              name="roleIds"
              label={t("roleIds.label")}
              selectionMode="multiple"
              disallowEmptySelection
              defaultSelectedKeys={state.values?.roleIds ?? roleIds}
            >
              {roles.map((role) => (
                <SelectItem key={role.key}>{role.label}</SelectItem>
              ))}
            </Select>
            {state.errors?.roleIds && <p className="text-danger text-sm mt-1">{state.errors?.roleIds}</p>}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Button type="submit" color="primary" isLoading={isPending}>
            {t("submit")}
          </Button>
          {state.errors?.general && <p className="text-danger text-sm mt-1">{state.errors.general}</p>}
          {state.success && <p className="text-success text-sm mt-1">{t("success")}</p>}
        </div>
      </form>
    </section>
  );
}
