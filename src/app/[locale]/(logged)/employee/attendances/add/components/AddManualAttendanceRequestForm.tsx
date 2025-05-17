"use client";

import {useTranslations} from "next-intl";
import {useActionState} from "react";
import {Button} from "@heroui/react";
import FormInput from "@/components/FormInput";
import Loader from "@/components/Loader";
import {
    addManualAttendanceRequest, AddManualAttendanceRequestState
} from "@/app/[locale]/(logged)/employee/attendances/add/actions/addManualAttendanceRequest";

const initialState: AddManualAttendanceRequestState = {};

export default function AddManualAttendanceRequestForm() {
    const t = useTranslations("AddManualAttendanceRequest");
    const [state, formAction, isPending] = useActionState(addManualAttendanceRequest, initialState);

    if (isPending) return <Loader/>;

    const formItems = [
        {
            id: "checkIn",
            defaultValue: state.values?.checkIn,
            type: "datetime-local",
        },
        {
            id: "checkOut",
            defaultValue: state.values?.checkOut,
            type: "datetime-local",
        },
    ];

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
                            placeholder=""
                            type={formItem.type}
                            error={state.errors?.[formItem.id as keyof typeof state.errors]}
                            defaultValue={formItem.defaultValue}
                        />
                    ))}
                </div>
                <div className="flex flex-col items-center justify-center">
                    <Button type="submit" color="primary" isLoading={isPending}>
                        {t("submit")}
                    </Button>
                    {state.errors?.general && <p className="text-danger text-sm mt-1">{state.errors.general}</p>}
                    {state?.success && <p className="text-success text-sm mt-1">{t("success")}</p>}
                </div>
            </form>
        </section>
    );
}
