import {auth} from "@/auth";
import {userApi} from "@/types";
import {redirect} from "next/navigation";
import ProfileForm, {ProfileFormProps} from "./components/ProfileForm";
import {SelectContent} from "@/interfaces/SelectContent";
import {getLanguages} from "@/services/languagesService";
import {getGenders} from "@/services/genderService";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user)
        redirect("/login");

    const {data: userData} = await userApi.GET("/api/User/{id}", {
        params: {
            path: {
                id: session.user.id,
            },
        },
        cache: "no-store",
    });

    const gendersData = await getGenders();
    const languagesData = await getLanguages();
    const formattedBirthDate = userData?.birthDate ? userData.birthDate.split("T")[0] : "";

    const profileFormProps: ProfileFormProps = {
        firstName: userData?.firstName as string,
        lastName: userData?.lastName as string,
        email: userData?.email as string,
        phone: userData?.phone as string,
        birthDate: formattedBirthDate as string,
        languageId: userData?.languageId as string,
        genderId: userData?.genderId as string,
        languages: languagesData?.map((item) => ({
            key: item.id,
            label: item.name,
        })) as SelectContent[],
        genders: gendersData?.map((item) => ({
            key: item.id,
            label: item.name,
        })) as SelectContent[],
    };

    return <ProfileForm {...profileFormProps} />;
}
