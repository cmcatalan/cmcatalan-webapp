"use client";

import {useTranslations} from "next-intl";
import {useActionState} from "react";
import {Button, Select, SelectItem} from "@heroui/react";
import FormInput from "@/components/FormInput";
import {SelectContent} from "@/interfaces/SelectContent";
import {AddUserState, addUser} from "../actions/addUser";
import Loader from "@/components/Loader";

export interface AddUserFormProps {
    languages: SelectContent[];
    genders: SelectContent[];
    roles: SelectContent[];
}

const initialState: AddUserState = {};

export default function AddUserForm({
                                        languages,
                                        genders,
                                        roles,
                                    }: AddUserFormProps) {
    const t = useTranslations("AddUser");
    const [state, formAction, isPending] = useActionState(addUser, initialState);

    if (isPending) return <Loader/>;

    const formItems = [
        {
            id: "firstName",
            defaultValue: state.values?.firstName,
        },
        {
            id: "lastName",
            defaultValue: state.values?.lastName,
        },
        {
            id: "email",
            defaultValue: state.values?.email,
        },
        {
            id: "password",
            defaultValue: state.values?.password,
            type: "password",
        },
        {
            id: "phone",
            defaultValue: state.values?.phone,
        },
        {
            id: "birthDate",
            type: "date",
            defaultValue: state.values?.birthDate,
        },
    ];


    const selectedGenderId = state.values?.genderId ? [state.values?.genderId] : [];
    const selectedLanguageId = state.values?.languageId ? [state.values?.languageId] : [];
    const selectedRoleIds = state.values?.roleIds ?? [];

    return (
        <section className="flex flex-col items-center px-6 py-8 mx-auto space-y-4">
            <h1 className="text-xl font-semibold text-center">{t("title")}</h1>
            <form action={formAction} className="space-y-4 md:space-y-6 w-full max-w-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    {formItems.map((formItem) => (
                        <FormInput
                            key={formItem.id}
                            id={formItem.id}
                            label={t(`${formItem.id}.label`)}
                            placeholder={t(`${formItem.id}.placeholder`)}
                            type={formItem.type}
                            error={state.errors?.[formItem.id as keyof typeof state.errors]}
                            defaultValue={formItem.defaultValue}
                        />
                    ))}
                    <div>
                        <Select
                            color={state.errors?.languageId? "danger" : undefined}
                            id="languageId"
                            name="languageId"
                            label={t("languageId.label")}
                            selectionMode="single"
                            disallowEmptySelection
                            defaultSelectedKeys={selectedLanguageId}
                        >
                            {languages.map((language) => (
                                <SelectItem key={language.key}>{language.label}</SelectItem>
                            ))}
                        </Select>
                        {state.errors?.languageId &&
                            <p className="text-danger text-sm mt-1">{state.errors?.languageId}</p>}
                    </div>
                    <div>
                        <Select
                            color={state.errors?.genderId? "danger" : undefined}
                            id="genderId"
                            name="genderId"
                            label={t("genderId.label")}
                            selectionMode="single"
                            disallowEmptySelection
                            defaultSelectedKeys={selectedGenderId}
                        >
                            {genders.map((gender) => (
                                <SelectItem key={gender.key}>{gender.label}</SelectItem>
                            ))}
                        </Select>
                        {state.errors?.genderId && <p className="text-danger text-sm mt-1">{state.errors?.genderId}</p>}
                    </div>
                    <div>
                        <Select
                            color={state.errors?.roleIds? "danger" : undefined}
                            id="roleIds"
                            name="roleIds"
                            label={t("roleIds.label")}
                            selectionMode="multiple"
                            disallowEmptySelection
                            defaultSelectedKeys={selectedRoleIds}
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
                </div>
            </form>
        </section>
    );
}
