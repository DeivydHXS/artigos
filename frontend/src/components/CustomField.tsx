import { useEffect, useState, type InputHTMLAttributes } from "react";
import type React from "react";

export interface CustomFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    name: string
    type: string
    error?: string | string[]
    className?: string
    dataCy?: string
}

const CustomField: React.FC<CustomFieldProps> = ({ label, name, type, error, className, dataCy, ...rest }) => {
    const [value, setValue] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        setErrorMessage("");
    }

    useEffect(() => {
        if (error) {
            if (typeof error == "string")
                setErrorMessage(error);
            else
                setErrorMessage(error[0]);
        }
    }, [error]);

    return (
        <div className="flex flex-col gap-0.5 w-full">
            <label htmlFor={name}>{label}</label>
            <input
                data-cy={dataCy}
                name={name}
                type={type}
                value={value}
                onChange={handleChange}
                className={className ? className : `${errorMessage ? "border-error" : "border-neutral"} border rounded-md px-2 py-1`}
                {...rest}
            />
            <small data-cy={`error-${name}`} className="text-xs text-error text-wrap w-full">{errorMessage}</small>
        </div>
    );
};

export default CustomField;