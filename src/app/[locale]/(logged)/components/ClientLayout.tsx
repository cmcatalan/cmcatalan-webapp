"use client";

import {signOut} from "next-auth/react";
import LanguageSelector from "@/components/LanguageSelector";
import {usePathname} from "@/i18n/navigation";
import {
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Listbox,
    ListboxItem,
    ListboxSection,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarMenu,
    NavbarMenuToggle,
} from "@heroui/react";
import {Role, roleMenus} from "@/config/menuConfig";
import {useLocale, useTranslations} from "next-intl";
import {User} from "next-auth";
import {ReactNode} from "react";
import {FaCircleNodes} from "react-icons/fa6";
import DarkModeSwitcher from "@/components/DarkModeSwitcher";
import AttendanceButton from "@/app/[locale]/(logged)/components/AttedanceButton";
import {Attendance} from "@/interfaces/Domain";
import {useRouter} from "next/navigation";
import Link from "next/link";

interface ClientLayoutProps {
    children: ReactNode;
    user: User;
    openAttendance: Attendance | null;
}

export default function ClientLayout({children, user, openAttendance}: ClientLayoutProps) {
    const t = useTranslations("Layout");
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();
    const menuSections = (user.roles as Role[]).filter((role) => roleMenus[role]).map((role) => roleMenus[role]);
    const appName = "FemEquip";

    const Menu = (
        <div className="py-4 space-y-2">
            <Listbox aria-label="Menu" variant="flat">
                {menuSections.map((section) => (
                    <ListboxSection key={section.titleKey} title={t(section.titleKey)} showDivider>
                        {section.items.map((item) => (
                            <ListboxItem
                                href={`/${locale}${item.href}`}
                                key={item.key}
                                as={Link}
                                startContent={item.icon}
                                aria-current={pathname === item.href ? "page" : undefined}
                                color={pathname === item.href ? "primary" : undefined}
                                className={pathname === item.href ? "text-primary bg-primary-100 dark:bg-primary dark:text-white" : ""}
                            >
                                {t(item.labelKey)}
                            </ListboxItem>
                        ))}
                    </ListboxSection>
                ))}
            </Listbox>
            <div className="flex items-center justify-center">
                <div className="flex flex-row space-x-2">
                    <DarkModeSwitcher/>
                    <LanguageSelector/>
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-screen flex flex-col">
            <Navbar maxWidth="full" className="border-b border-gray-200">
                <NavbarContent className="sm:hidden" justify="start">
                    <NavbarMenuToggle aria-label="menu"/>
                    <NavbarBrand>
                        <div className="text-sm flex flex-row items-center gap-1">
                            <FaCircleNodes/>
                            <p className="font-bold text-inherit">{appName}</p>
                        </div>
                    </NavbarBrand>
                </NavbarContent>

                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarBrand>
                        <FaCircleNodes/>
                        <p className="ml-1 font-bold text-inherit">{appName}</p>
                    </NavbarBrand>
                </NavbarContent>

                <NavbarContent as="div" justify="end">
                    <div className="flex flex-row items-center gap-4">
                        {user.roles.includes("Employee") &&
                            <AttendanceButton userId={user.id!} attendance={openAttendance}/>}
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform"
                                    color="primary"
                                    name={user.name ?? ""}
                                    size="md"
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownItem key="profile" className="h-14 gap-2">
                                    <p className="font-semibold">{t("signedInAs")}</p>
                                    <p className="font-semibold">{user.email}</p>
                                </DropdownItem>
                                <DropdownItem key="change_password" href={`/${locale}/change-password`} as={Link}>
                                    {t("changePassword")}
                                </DropdownItem>
                                <DropdownItem key="logout" color="danger" className="text-danger bg-danger-100"
                                              onPress={async () => {
                                                  await signOut({redirect: false})
                                                  router.push(`/${locale}/login`)
                                              }
                                              }>
                                    {t("logout")}
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </NavbarContent>

                <NavbarMenu>{Menu}</NavbarMenu>
            </Navbar>
            <div className="flex-1 flex flex-row overflow-hidden">
                <aside
                    id="logo-sidebar"
                    className="w-96 h-full overflow-y-auto border-r p-4 border-gray-200 hidden sm:block"
                    aria-label="Sidebar"
                >
                    <div className="text-center font-medium">{t("title")}</div>
                    {Menu}
                </aside>
                <main className="w-full overflow-y-auto p-4">{children}</main>
            </div>
        </div>
    );
}
