import {formatInTimeZone} from "date-fns-tz";
import {Attendance} from "@/interfaces/Domain";
import {defaultHourFormat, timeCounter} from "@/utils/datetime";

interface AttendanceRowProps {
    attendance: Attendance;
    timeZone: string;
}

export default function AttendanceRow({attendance, timeZone}: AttendanceRowProps) {
    const startDate = formatInTimeZone(new Date(attendance.checkIn!), timeZone, defaultHourFormat);
    const endDate = attendance.checkOut
        ? formatInTimeZone(new Date(attendance.checkOut!), timeZone, defaultHourFormat)
        : null;

    const start = new Date(attendance.checkIn!);
    const end = attendance.checkOut ? new Date(attendance.checkOut) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const attendanceHours = Math.floor(diffMin / 60);
    const attendanceMinutes = diffMin % 60;
    const attendanceTotalTimeStr = timeCounter(attendanceHours, attendanceMinutes);

    return (
        <li
            className="grid grid-cols-3 gap-2 text-sm w-full p-2 border-1 rounded max-w-screen-md mx-auto text-center">
            <div>{startDate}</div>
            <div>{!!endDate && endDate}</div>
            <div>{attendanceTotalTimeStr}</div>
        </li>
    )
}