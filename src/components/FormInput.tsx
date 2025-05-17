"use client";

import {Input} from "@heroui/react";

interface Props {
    id: string;
    label: string;
    placeholder: string;
    type?: string;
    error?: string;
    autoComplete?: string;
    defaultValue?: string;
    isDisabled?: boolean;
    hidden?: boolean;
    isReadOnly?: boolean;
}

export default function FormInput({
                                      id,
                                      label,
                                      placeholder,
                                      type,
                                      error,
                                      autoComplete,
                                      defaultValue,
                                      isDisabled,
                                      hidden,
                                      isReadOnly
                                  }: Props) {
    if (hidden) {
        return <Input className="hidden" id={id} name={id} defaultValue={defaultValue} hidden={hidden}/>;
    }

    return (
        <div>
            <label htmlFor={id} className={`block mb-2 text-sm font-medium" ${error && "text-danger"}`}></label>
            <label htmlFor={id} className={`block mb-2 text-sm font-medium" ${error && "text-danger"}`}>
                {label}
            </label>
            <Input
                id={id}
                name={id}
                color={error ? "danger" : "default"}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                defaultValue={defaultValue}
                isDisabled={isDisabled}
                isReadOnly={isReadOnly}
            />
            {error && <p className="text-danger text-sm mt-1">{error}</p>}
        </div>
    );
}
