import { userApi} from "@/types";
import {redirect} from "next/navigation";
import {getRoles, getUserRoles} from "@/services/rolesService";
import ViewUserForm, {ViewUserFormProps} from "@/app/[locale]/(logged)/admin/users/[userId]/components/ViewUser";
import {getLanguages} from "@/services/languagesService";
import {getGenders} from "@/services/genderService";

interface ViewUserPageProps {
    params: Promise<{ userId: string }>;
}

export default async function ViewUser({params}: ViewUserPageProps) {
    const userId = (await params).userId;
    const {data: userData} = await userApi.GET("/api/User/{id}", {
        params: {
            path: {
                id: userId,
            },
        },
        cache: "no-store",
    });

    if (!userData?.id) redirect("/admin/users");

    const gendersData = await getGenders();
    const languages = await getLanguages();
    const roles = await getRoles();
    const userRoles = await getUserRoles(userId);
    const selectedUserRoles = userRoles?.map((x) => x.roleId as string) ?? [];
    const rolesNames = roles?.filter((x) => selectedUserRoles.includes(x.id as string))?.map((x) => x.name ?? "");
    const formattedBirthDate = userData?.birthDate ? userData.birthDate.split("T")[0] : "";
    const language = languages?.find((x) => x.id === userData?.languageId)?.name ?? "";
    const gender = gendersData?.find((x) => x.id === userData?.genderId)?.name ?? "";
    const roleNamesJoined = rolesNames?.join(", ") ?? "";

    const formProps: ViewUserFormProps = {
        firstName: userData?.firstName as string,
        lastName: userData?.lastName as string,
        email: userData?.email as string,
        phone: userData?.phone as string,
        birthDate: formattedBirthDate as string,
        language: language,
        gender: gender,
        roles: roleNamesJoined
    };

    return <ViewUserForm {...formProps} />;
}
