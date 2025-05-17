"use client";

import {Link} from "@/i18n/navigation";
import {Button} from "@heroui/react";
import {useTranslations} from "next-intl";
import {login, LoginState} from "../actions/login";
import LanguageSelector from "@/components/LanguageSelector";
import {useActionState} from "react";
import {useSearchParams} from "next/navigation";
import {Alert} from "@heroui/react";
import FormInput from "@/components/FormInput";
import {FaCircleNodes} from "react-icons/fa6";

const formItems = [
    {
        id: "email",
        autoComplete: "username",
    },
    {
        id: "password",
        type: "password",
    },
];

export default function LoginForm() {
    const t = useTranslations("LoginPage");
    const searchParams = useSearchParams();
    const initialState: LoginState = {};
    const [state, formAction, isPending] = useActionState(login, initialState);
    const isResetPassword = searchParams.has("resetPassword");

    return (
        <section>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen">
                <div className="w-full md:mt-0 sm:max-w-md xl:p-0 ">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        {isResetPassword && (
                            <div className="flex items-center justify-center w-full">
                                <Alert title={t("resetPassword")} color="success"/>
                            </div>
                        )}
                        <div className="flex flex-row justify-center items-center"><FaCircleNodes/> <span
                            className="ml-1 font-semibold text-xl">FemEquip</span></div>
                        <h1 className="text-xl font-semibold text-center mb-4">{t("signIn")}</h1>
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
                            <div className="flex items-center justify-end">
                                <Link href={"/forgot-password"}
                                      className="text-sm font-medium text-primary-600 hover:underline">
                                    {t("forgotPassword.message")}
                                </Link>
                            </div>
                            <div>
                                <Button type="submit" color="primary" fullWidth isLoading={isPending}>
                                    {t("submit.title")}
                                </Button>
                                {state.errors?.general &&
                                    <p className="text-danger text-sm mt-1">{state.errors.general}</p>}
                            </div>
                            <p className="text-sm font-light ">
                                {t("register.message")}{" "}
                                <Link href="/register" className="font-medium text-primary-600 hover:underline">
                                    {t("register.link")}
                                </Link>
                            </p>
                        </form>
                        <div className="flex items-center justify-center">
                            <LanguageSelector/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
