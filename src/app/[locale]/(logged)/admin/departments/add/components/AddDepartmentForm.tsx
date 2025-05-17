"use client";

import { Button, Select, SelectItem } from "@heroui/react";
import { useActionState } from "react";
import FormInput from "@/components/FormInput";
import { useTranslations } from "next-intl";
import { addDepartment, AddDepartmentState } from "../actions/addDepartment";
import { SelectContent } from "@/interfaces/SelectContent";

export interface AddDepartmentFormProps {
  workCenters: SelectContent[];
}

const formItems = [
  {
    id: "name",
    type: "name",
  },
];

export default function AddDepartmentForm({ workCenters }: AddDepartmentFormProps) {
  const t = useTranslations("Crud.AddDepartment");
  const initialState: AddDepartmentState = {};
  const [state, formAction, isPending] = useActionState(addDepartment, initialState);

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
                label={t(`${formItem.id}.label`)}
                placeholder={t(`${formItem.id}.placeholder`)}
                type={formItem.type}
                error={state.errors?.[formItem.id as keyof typeof state.errors]}
              />
            ))}
            <div>
              <Select
                id="workCenterId"
                name="workCenterId"
                label={t("workCenterId.label")}
                selectionMode="single"
                disallowEmptySelection
                color={state.errors?.workCenterId ? "danger" : undefined}
              >
                {workCenters.map((workCenter) => (
                  <SelectItem key={workCenter.key}>{workCenter.label}</SelectItem>
                ))}
              </Select>
              {state.errors?.workCenterId && <p className="text-danger text-sm mt-1">{state.errors?.workCenterId}</p>}
            </div>

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
