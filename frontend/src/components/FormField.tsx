import { useEffect, useState, type PropsWithChildren } from "react";
import type React from "react";

interface FormFieldProps extends PropsWithChildren {
    label?: string;
    name?: string;
    type: string;
    error?: string[];
    defaultValue?: string;
    readOnly?: boolean;
    className?: string;
    placeholder?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, name, type, defaultValue = "" , error, readOnly = false, className = "", placeholder = ""}) => {

    const [value, setValue] = useState<string | undefined>(defaultValue);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(error ? error[0] : undefined);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        setErrorMessage(undefined);
    }

    useEffect(()=>{
        if(defaultValue){
            setValue(defaultValue)
        }
    },[defaultValue])

    useEffect(() => {
        if(error) {
            setErrorMessage(error[0]);
        }
    }, [error]);
    
    return (
        <div className="flex flex-col gap-0.5 w-full">
            <label htmlFor={name}>{label}</label>
            <input
                type={type}
                name={name}
                readOnly={readOnly}
                defaultValue={defaultValue}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={className ? className : `${errorMessage ? "border-red-600" : "border-neutral-400"} border rounded-md pl-2 py-1`}/>
            <small className="text-red-600 text-wrap w-full">{errorMessage}</small>
        </div>
    );
};

export default FormField;