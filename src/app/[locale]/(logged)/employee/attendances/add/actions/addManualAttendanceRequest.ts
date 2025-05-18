"use server";

import {auth} from "@/auth";
import {addManualAttendanceRequestSchema} from "@/lib/zod";
import {domainApi} from "@/types";
import {getTranslations} from "next-intl/server";
import {redirect} from "next/navigation";
import {TZDate} from "@date-fns/tz";
import {defaultTimeZone} from "@/utils/datetime";

interface Errors {
    general?: string;
    checkIn?: string;
    checkOut?: string;
}

interface Values {
    checkIn?: string;
    checkOut?: string;
}

export interface AddManualAttendanceRequestState {
    errors?: Errors;
    success?: boolean;
    values?: Values;
}

export async function addManualAttendanceRequest(prevSate: AddManualAttendanceRequestState, formData: FormData): Promise<AddManualAttendanceRequestState> {
    const session = await auth();

    if (!session?.user.company) redirect("/");

    const t = await getTranslations("AddManualAttendanceRequest");
    const values = {
        checkIn: formData.get("checkIn") as string,
        checkOut: formData.get("checkOut") as string,
    };

    const schemaValidation = await addManualAttendanceRequestSchema.safeParseAsync(values);

    if (!schemaValidation.success) {
        const errors = schemaValidation.error.flatten();
        const errorMessages: Errors = {};

        if (errors.formErrors.length > 0) {
            errorMessages.general = t(`errors.${errors.formErrors[0]}`) || t("errors.default");
        }

        if (errors.fieldErrors.checkIn) {
            errorMessages.checkIn = t(`errors.${errors.fieldErrors.checkIn[0]}`) || t("errors.default");
        }

        if (errors.fieldErrors.checkOut) {
            errorMessages.checkOut = t(`errors.${errors.fieldErrors.checkOut[0]}`) || t("errors.default");
        }

        if (Object.keys(errors).length > 0) {
            return {
                errors: errorMessages,
                success: false,
                values: values,
            };
        }
    }
    try {
        const {error} = await domainApi.POST("/ManualAttendanceRequests", {
            body: {
                userId: session.user.id,
                checkIn: new TZDate(values.checkIn, defaultTimeZone).toISOString(),
                checkOut: new TZDate(values.checkOut, defaultTimeZone).toISOString(),
                statusId: process.env.PENDING_MANUALATTENDANCESTATUSID
            },
        });

        if (error) throw new Error();

    } catch {
        return {
            errors: {
                general: t("errors.default"),
            },
            success: false,
            values: values,
        };
    }
    return {
        success: true,
    };
}
