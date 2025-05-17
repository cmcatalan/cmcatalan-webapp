"use client";

import {useTranslations} from "next-intl";
import FormInput from "@/components/FormInput";

export interface ViewUserFormProps {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    roles: string;
    gender: string;
    language: string;
}

export default function ViewUserForm({
                                         firstName,
                                         lastName,
                                         email,
                                         phone,
                                         birthDate,
                                         roles,
                                         gender,
                                         language,
                                     }: ViewUserFormProps) {
    const t = useTranslations("ViewUser");

    const formItems = [
        {
            id: "firstName",
            defaultValue: firstName,
        },
        {
            id: "lastName",
            defaultValue: lastName,
        },
        {
            id: "email",
            defaultValue: email,
        },
        {
            id: "phone",
            defaultValue: phone,
        },
        {
            id: "birthDate",
            type: "date",
            defaultValue: birthDate,
        },
        {
            id: "language",
            defaultValue: language,
        },
        {
            id: "gender",
            defaultValue: gender,
        },
        {
            id: "roles",
            defaultValue: roles,
        },
    ];

    return (
        <section className="flex flex-col items-center px-6 py-8 mx-auto space-y-4">
            <h1 className="text-xl font-semibold text-center">{t("title")}</h1>
            <div className="space-y-4 md:space-y-6 w-full max-w-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    {formItems.map((formItem) => (
                        <FormInput
                            key={formItem.id}
                            id={formItem.id}
                            label={t(`${formItem.id}.label`)}
                            placeholder={t(`${formItem.id}.placeholder`)}
                            type={formItem.type}
                            defaultValue={formItem.defaultValue}
                            isReadOnly
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
