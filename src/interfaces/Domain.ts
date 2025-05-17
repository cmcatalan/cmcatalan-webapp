export interface WorkCenter {
    id?: string;
    name?: string | null;
    companyId?: string;
    addressId?: string | null;
    timezoneId?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}

export interface Address {
    id?: string;
    line1?: string | null;
    line2?: string | null;
    postalCode?: string | null;
    cityId?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}

export interface Department {
    id?: string;
    name?: string | null;
    workCenterId?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
}

export interface Role {
    id?: string
    name?: string | null
    description?: string | null
    createdAt?: string
    updatedAt?: string
    deletedAt?: string | null
}

export interface TableTranslation {
    id?: string
    languageId?: string
    tableName?: string | null
    rowId?: string | null
    columnName?: string | null
    value?: string | null
    createdAt?: string
    updatedAt?: string
    deletedAt?: string | null
}

export interface Language {
    id?: string
    name?: string | null
    code?: string | null
    createdAt?: string
    updatedAt?: string
    deletedAt?: string | null
}

export interface Gender {
    id?: string
    name?: string | null
    createdAt?: string
    updatedAt?: string
    deletedAt?: string | null
}

export interface Attendance {
    id?: string
    userId?: string
    checkIn?: string
    checkOut?: string | null
    isManual?: boolean
    comment?: string | null
    createdAt?: string
    updatedAt?: string
    deletedAt?: string | null
}

export interface ManualAttendanceStatus {
    id?: string
    name?: string | null
    createdAt?: string
    updatedAt?: string
    deletedAt?: string | null
}

export interface User {
    id?: string
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    phone?: string | null
    birthDate?: string | null
    addressId?: string | null
    languageId?: string
    deletedAt?: string | null
}

export interface ManualAttendanceRequest {
    id?: string
    userId?: string
    checkIn?: string | null
    checkOut?: string | null
    reason?: string | null
    statusId?: string | null
    reviewerId?: string | null
    reviewComment?: string | null
    reviewedAt?: string | null
    createdAt?: string
    updatedAt?: string
    deletedAt?: string | null
}