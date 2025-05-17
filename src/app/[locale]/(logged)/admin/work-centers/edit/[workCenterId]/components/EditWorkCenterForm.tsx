"use client";

import FormInput from "@/components/FormInput";
import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import { editWorkCenter, EditWorkCenterState } from "../actions/editWorkCenter";
import { useActionState } from "react";

interface EditWorkCenterFormProps {
  id: string;
  name: string;
}

export default function EditWorkCenterForm({ id, name }: EditWorkCenterFormProps) {
  const t = useTranslations("Crud.EditWorkCenter");
  const initialState: EditWorkCenterState = {};
  const [state, formAction, isPending] = useActionState(editWorkCenter, initialState);

  const formItems = [
    {
      id: "id",
      hidden: true,
      defaultValue: id,
    },
    {
      id: "name",
      defaultValue: name,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
      <div className="w-full md:mt-0 sm:max-w-md xl:p-0 ">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-semibold text-center mb-4">{t("title")}</h1>
          <form action={formAction} className="space-y-4 md:space-y-6">
            {formItems.map((formItem) => (
              <FormInput
                key={formItem.id}
                id={formItem.id}
                label={!formItem.hidden ? t(`${formItem.id}.label`) : ""}
                placeholder={!formItem.hidden ? t(`${formItem.id}.placeholder`) : ""}
                error={state.errors?.[formItem.id as keyof typeof state.errors]}
                hidden={formItem.hidden}
                defaultValue={formItem.defaultValue}
              />
            ))}
            <Button type="submit" color="primary" fullWidth className="mb-4" isLoading={isPending}>
              {t("submit")}
            </Button>
            {state.errors?.general && <p className="text-danger text-sm mt-1">{state.errors.general}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
