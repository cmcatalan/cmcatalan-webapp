"use client"

import {Button} from "@heroui/react";
import {useState} from "react";
import {finishAttendanceRequest} from "@/app/[locale]/(logged)/hr/attendance-requests/actions/finishAttendanceRequest";
import {toast} from "sonner";
import {useTranslations} from "next-intl";

interface Props {
    requestId: string,
    userName: string,
    startDate: string,
    endDate: string,
    acceptStatusId: string,
    rejectStatusId: string,
}

export default function FinishAttendanceRow({
                                                requestId,
                                                userName,
                                                startDate,
                                                endDate,
                                                acceptStatusId,
                                                rejectStatusId
                                            }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const t = useTranslations("ManualAttendanceRequests");


    const onPressHandler = async (statusId: string) => {
        setIsLoading(true);
        const {error} = await finishAttendanceRequest(requestId, statusId);
        if (error) {
            toast.error(t("error"));
        } else {
            toast.success(t("success"));
            setIsSuccess(true);
        }
        setIsLoading(false);
    }

    return (
        <li key={requestId}
            className="grid grid-cols-4 gap-2 text-sm w-full p-2 border rounded-md mx-auto text-center shadow-sm">
            <div className="flex items-center justify-center">{userName}</div>
            <div className="flex items-center justify-center">{startDate}</div>
            <div className="flex items-center justify-center">{endDate}</div>
            <div className="flex items-center justify-center flex-col space-y-2">
                {!isSuccess && <>
                    <div>
                        <Button color="primary" onPress={() => onPressHandler(acceptStatusId)}
                                isDisabled={isLoading} size="sm">
                            {t("accept")}
                        </Button>

                    </div>
                    <div>
                        <Button color="danger" onPress={() => onPressHandler(rejectStatusId)} isDisabled={isLoading}
                                size="sm">
                            {t("reject")}
                        </Button>
                    </div>
                </>
                }

            </div>
        </li>
    );
}