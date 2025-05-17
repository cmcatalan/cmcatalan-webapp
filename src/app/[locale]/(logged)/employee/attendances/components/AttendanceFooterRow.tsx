interface AttendanceFooterRowProps {
    earliest: string;
    totalTime: string;
}

export default function AttendanceFooterRow({earliest, totalTime}: AttendanceFooterRowProps) {
    return (
        <li key="last"
            className="flex items-center justify-around text-md w-full p-2 max-w-screen-md mx-auto">
            <div className="flex flex-col items-center space-y-2">
                {earliest}
            </div>
            <div className="flex flex-col items-center space-y-2">
                -
            </div>
            <div className="flex flex-col items-center space-y-2">
                {totalTime}
            </div>
        </li>)
}