import {object, string} from "zod";

const MINIMUM_AGE = 16;

export const loginSchema = object({
    email: string({required_error: "required"}).min(1, "required").email("invalid"),
    password: string({required_error: "required"}).min(1, "required").min(8, "minLength").max(32, "maxLength"),
});

export const forgotPasswordSchema = object({
    email: string({required_error: "required"}).min(1, "required").email("invalid"),
});

export const resetPasswordSchema = object({
    password: string({required_error: "required"}).min(1, "required").min(8, "minLength").max(32, "maxLength"),
    confirmPassword: string({required_error: "required"}).min(1, "required").min(8, "minLength").max(32, "maxLength"),
    token: string({required_error: "required"}).min(1, "required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "passwordsDoNotMatch",
});

export const changePasswordSchema = object({
    currentPassword: string({required_error: "required"}).min(1, "required").min(8, "minLength").max(32, "maxLength"),
    password: string({required_error: "required"}).min(1, "required").min(8, "minLength").max(32, "maxLength"),
    confirmPassword: string({required_error: "required"}).min(1, "required").min(8, "minLength").max(32, "maxLength"),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "passwordsDoNotMatch",
    })
    .refine((data) => data.currentPassword !== data.password, {
        message: "currentPasswordMatch",
    });

export const registerSchema = object({
    companyName: string({required_error: "required"}).min(1, "required"),
    firstName: string({required_error: "required"}).min(1, "required"),
    lastName: string({required_error: "required"}).min(1, "required"),
    email: string({required_error: "required"}).min(1, "required").email("invalid"),
    password: string({required_error: "required"}).min(1, "required").min(8, "minLength").max(32, "maxLength"),
    languageId: string({required_error: "required"}).uuid("uuid"),
});

export const profileSchema = object({
    firstName: string({required_error: "required"}).min(1, "required"),
    lastName: string({required_error: "required"}).min(1, "required"),
    phone: string({required_error: "required"}).min(1, "required"),
    birthDate: string({required_error: "required"}).min(1, "required").refine((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) return false;

        const now = new Date();
        const ageDate = new Date(now.getFullYear() - MINIMUM_AGE, now.getMonth(), now.getDate());

        return date <= ageDate;
    }, {
        message: `age`,
    }),
    genderId: string({required_error: "required"}).uuid("uuid"),
    languageId: string({required_error: "required"}).uuid("uuid"),
});

export const addWorkCenterSchema = object({
    name: string({required_error: "required"}).min(1, "required"),
});

export const editWorkCenterSchema = object({
    id: string({required_error: "required"}).uuid("uuid"),
    name: string({required_error: "required"}).min(1, "required"),
});

export const addDepartmentSchema = object({
    name: string({required_error: "required"}).min(1, "required"),
    workCenterId: string({required_error: "required"}).uuid("uuid"),
});

export const editDepartmentSchema = object({
    id: string({required_error: "required"}).uuid("uuid"),
    name: string({required_error: "required"}).min(1, "required"),
    workCenterId: string({required_error: "required"}).uuid("uuid"),
});

export const addUserSchema = object({
    firstName: string({required_error: "required"}).min(1, "required"),
    lastName: string({required_error: "required"}).min(1, "required"),
    phone: string({required_error: "required"}).min(1, "required"),
    email: string({required_error: "required"}).min(1, "required").email("invalid"),
    password: string({required_error: "required"}).min(1, "required").min(8, "minLength").max(32, "maxLength"),
    birthDate: string({required_error: "required"}).min(1, "required").refine((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) return false;

        const now = new Date();
        const ageDate = new Date(now.getFullYear() - MINIMUM_AGE, now.getMonth(), now.getDate());

        return date <= ageDate;
    }, {
        message: `age`,
    }),
    genderId: string({required_error: "required"}).uuid("uuid"),
    languageId: string({required_error: "required"}).uuid("uuid"),
    roleIds: string().array().min(1, {message: "required"}),
});


export const editUserSchema = object({
    id: string({required_error: "required"}).uuid("uuid"),
    firstName: string({required_error: "required"}).min(1, "required"),
    lastName: string({required_error: "required"}).min(1, "required"),
    phone: string({required_error: "required"}).min(1, "required"),
    birthDate: string({required_error: "required"}).min(1, "required").refine((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) return false;

        const now = new Date();
        const ageDate = new Date(now.getFullYear() - MINIMUM_AGE, now.getMonth(), now.getDate());

        return date <= ageDate;
    }, {
        message: `age`,
    }), genderId: string({required_error: "required"}).uuid("uuid"),
    languageId: string({required_error: "required"}).uuid("uuid"),
    roleIds: string().array().min(1, {message: "required"}),
});


import { z } from "zod";

export const addManualAttendanceRequestSchema = z.object({
    checkIn: z.string({ required_error: "required" }).min(1, "required"),
    checkOut: z.string({ required_error: "required" }).min(1, "required"),
}).refine(
    (data) => {
        const checkInDate = new Date(data.checkIn);
        const checkOutDate = new Date(data.checkOut);
        return checkOutDate > checkInDate;
    },
    {
        message: "invalidDates",
    }
);