import {auth} from "@/auth";
import {redirect} from "next/navigation";
import RegisterForm from "./components/RegisterForm";
import {SelectContent} from "@/interfaces/SelectContent";
import {getLocale} from "next-intl/server";
import {getLanguages} from "@/services/languagesService";

export default async function RegisterPage() {
    const session = await auth();

    if (session?.user)
        redirect("/");


    const languagesData = await getLanguages();

    const languages =
        languagesData?.map(
            (language) =>
                ({
                    key: language.id as string,
                    label: language.name as string,
                }) as SelectContent
        ) ?? [];

    const language = await getLocale();

    const defaultLanguage = languagesData?.find((lang) => lang.code === language)?.id ?? (languages[0]?.key as string);

    return <RegisterForm languages={languages} defaultLanguage={defaultLanguage}/>;
}
