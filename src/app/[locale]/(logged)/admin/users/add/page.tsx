import {redirect} from "next/navigation";
import {SelectContent} from "@/interfaces/SelectContent";
import {getRoles} from "@/services/rolesService";
import {auth} from "@/auth";
import {getLanguages} from "@/services/languagesService";
import {getGenders} from "@/services/genderService";
import AddUserForm, {AddUserFormProps} from "@/app/[locale]/(logged)/admin/users/add/components/AddUserForm";


export default async function AddUser() {
    const session = await auth();
    if (!session?.user.company) redirect("/");

    const gendersData = await getGenders();
    const languagesData = await getLanguages();
    const roles = await getRoles();

    const formProps: AddUserFormProps = {
        languages: languagesData?.map((item) => ({
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
        })) as SelectContent[]
    };

    return <AddUserForm {...formProps} />;
}
