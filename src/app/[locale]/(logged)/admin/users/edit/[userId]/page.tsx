import {userApi} from "@/types";
import {redirect} from "next/navigation";
import EditUserForm, {EditUserFormProps} from "./components/EditUserForm";
import {SelectContent} from "@/interfaces/SelectContent";
import {getRoles, getUserRoles} from "@/services/rolesService";
import {getLanguages} from "@/services/languagesService";
import {getGenders} from "@/services/genderService";

interface EditUserPageProps {
    params: Promise<{ userId: string }>;
}

export default async function EditUser({params}: EditUserPageProps) {
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
    const selectedUserRoleIds = userRoles?.map((x) => x.roleId as string) ?? [];
    const formattedBirthDate = userData?.birthDate ? userData.birthDate.split("T")[0] : "";

    const formProps: EditUserFormProps = {
        id: userId,
        firstName: userData?.firstName as string,
        lastName: userData?.lastName as string,
        email: userData?.email as string,
        phone: userData?.phone as string,
        birthDate: formattedBirthDate as string,
        languageId: userData?.languageId as string,
        genderId: userData?.genderId as string,
        languages: languages?.map((item) => ({
            key: item.id,
            label: item.name,
        })) as SelectContent[],
        genders: gendersData?.map((item) => ({
            key: item.id,
            label: item.name,
        })) as SelectContent[],
        roles: roles?.map((item) => ({
            key: item.id,
            label: item.name,
        })) as SelectContent[],
        roleIds: selectedUserRoleIds,
    };

    return <EditUserForm {...formProps} />;
}
