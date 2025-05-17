"use client";

import {Button} from "@heroui/react";
import {useState} from "react";
import {toast} from "sonner";
import {finishAttendanceRequest} from "@/app/[locale]/(logged)/hr/attendance-requests/actions/finishAttendanceRequest";

interface Props {
    requestId: string;
    statusId: string;
    color: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
    message: string;
}

export default function FinishAttendanceButton({requestId, statusId, color, message}: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const onPressHandler = async () => {
        setIsLoading(true);
        const {error} = await finishAttendanceRequest(requestId, statusId);
        if (error) {
            toast.error("error");
        } else {
            toast.success("success");
            setIsSuccess(true);
        }
        setIsLoading(false);
    }
    if (isSuccess) return null;

    return (
        <Button color={color} onPress={onPressHandler} isLoading={isLoading} isDisabled={isLoading} size="sm">
            {message}
        </Button>
    );
}