"use client"

import {Attendance} from "@/interfaces/Domain";
import {useEffect, useState} from "react";
import {Button} from "@heroui/react";
import {FaPlay, FaStop} from "react-icons/fa6";
import {doCheckIn, doCheckOut} from "@/app/[locale]/(logged)/employee/attendances/actions/doAttendence";
import {toast} from "sonner";
import {defaultTimer, getTimer} from "@/utils/datetime";

interface Props {
    userId: string;
    attendance: Attendance | null;
}

export default function AttendanceButton({attendance, userId}: Props) {
    const [checkIn, setCheckIn] = useState<string | undefined>(attendance?.checkIn);
    const [elapsedTime, setElapsedTime] = useState(getTimer(checkIn));
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!checkIn) {
            setElapsedTime(defaultTimer);
            return;
        }

        const updateElapsed = () => setElapsedTime(getTimer(checkIn));
        updateElapsed();

        const interval = setInterval(updateElapsed, 1000);
        return () => clearInterval(interval);
    }, [checkIn]);

    if (!mounted) return null;

    const onPressCheckOut = async () => {
        setIsLoading(true);
        const response = await doCheckOut(userId);
        if (response.error) {
            toast.error('Event has not been created');
        } else {
            setCheckIn(undefined);
        }
        setIsLoading(false);
    }

    const onPressCheckIn = async () => {
        setIsLoading(true);
        const response = await doCheckIn(userId);
        if (response.error) {
            toast.error('Event has not been created');
        } else {
            setCheckIn(response?.value);
        }
        setIsLoading(false);
    }

    return (
        checkIn ? (
            <Button
                aria-label="Check Out"
                onPress={onPressCheckOut}
                isDisabled={isLoading}
                variant="bordered"
                className="border-primary"
                size="md">
                <div className="flex flex-row justify-center items-center space-x-2 text-sm">
                    <p className="font-mono">{elapsedTime}</p>
                    <div><FaStop/></div>
                </div>
            </Button>
        ) : (
            <Button
                aria-label="Check In"
                onPress={onPressCheckIn}
                isDisabled={isLoading}
                variant="bordered"
                size="md"
            >
                <div className="flex flex-row justify-center items-center space-x-2 text-sm">
                    <div className="font-mono">{elapsedTime}</div>
                    <div><FaPlay/></div>
                </div>
            </Button>
        )
    );
}