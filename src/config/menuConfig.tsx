import {ReactNode} from "react";
import {FaBriefcase, FaCircleUser, FaClock, FaPuzzlePiece, FaRegClock, FaUsers} from "react-icons/fa6";

export type Role = "Employee" | "Admin" | "HR"; //  "Manager" |

export interface MenuItem {
    key: string;
    labelKey: string;
    href: string;
    icon: ReactNode;
}

export interface MenuSection {
    titleKey: string;
    items: MenuItem[];
}

export const roleMenus: Record<Role, MenuSection> = {
    Employee: {
        titleKey: "employee.title",
        items: [
            {key: "profile", labelKey: "employee.profile", href: "/employee/profile", icon: <FaCircleUser/>},
            {key: "attendances", labelKey: "employee.attendances", href: "/employee/attendances", icon: <FaClock/>},
            // {key: "leaves", labelKey: "employee.leaves", href: "/employee/leaves", icon: <FaPlaneDeparture/>},
            // {key: "salaries", labelKey: "employee.salaries", href: "/employee/salaries", icon: <FaFolderOpen/>},
        ],
    },
    Admin: {
        titleKey: "admin.title",
        items: [
            {key: "users", labelKey: "admin.users", href: "/admin/users", icon: <FaUsers/>},
            // { key: "companies", labelKey: "admin.companies", href: "/admin/companies", icon: <FaRegBuilding /> },
            {
                key: "workCenters",
                labelKey: "admin.workCenters",
                href: "/admin/work-centers",
                icon: <FaBriefcase/>
            },
            {key: "departments", labelKey: "admin.departments", href: "/admin/departments", icon: <FaPuzzlePiece/>},
            // { key: "teams", labelKey: "admin.teams", href: "/admin/teams", icon: <FaUsers /> },
            // {key: "calendars", labelKey: "admin.calendars", href: "/admin/calendars", icon: <FaCalendar/>},
            // // { key: "holidays", labelKey: "admin.holidays", href: "/admin/holidays", icon: <MdHolidayVillage /> },
            // {
            //     key: "timeoffPolicies",
            //     labelKey: "admin.timeoffPolicies",
            //     href: "/admin/timeoff-policies",
            //     icon: <FaPlaneDeparture/>,
            // },
        ],
    },
    // Manager: {
    //     titleKey: "manager.title",
    //     items: [
    //         {
    //             key: "attendanceRequests",
    //             labelKey: "manager.attendanceRequests",
    //             href: "/manager/attendance-requests",
    //             icon: <FaClock/>,
    //         },
    //         // {
    //         //     key: "leaveRequests",
    //         //     labelKey: "manager.leaveRequests",
    //         //     href: "/manager/leave-requests",
    //         //     icon: <FaPlaneDeparture/>,
    //         // },
    //     ],
    // },
    HR: {
        titleKey: "hr.title",
        items: [
            {
                key: "attendanceRequests",
                labelKey: "hr.attendanceRequests",
                href: "/hr/attendance-requests",
                icon: <FaRegClock/>,
            },
            {key: "attendances", labelKey: "hr.attendances", href: "/hr/attendances", icon: <FaClock/>},

            // {key: "calendars", labelKey: "hr.calendars", href: "/hr/calendars", icon: <FaCalendar/>},
            // { key: "departments", labelKey: "hr.departments", href: "/hr/departments", icon: <FaMapMarkedAlt /> },
            // { key: "holidays", labelKey: "hr.holidays", href: "/hr/holidays", icon: <MdHolidayVillage /> },
            // { key: "teams", labelKey: "hr.teams", href: "/hr/teams", icon: <FaUsers /> },
        ],
    },
};
