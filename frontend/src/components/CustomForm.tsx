import { useState, type FormHTMLAttributes } from "react";
import type React from "react";
import { useLoadContext } from "../hooks/useContext";
import { AlertContext } from "../contexts/AlertContext";
import { useApi } from "../hooks/useApi";
import type { CustomFieldProps } from "./CustomField";
import CustomField from "./CustomField";
import { Loading } from "./Loading";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
    buttonValue?: string
    className?: string
    fields: CustomFieldProps[]
    route: string
    method: "POST" | "PUT"
    dataCy: string;
    callback: (response: any) => void
}

const CustomForm: React.FC<FormProps> = ({ buttonValue, className, fields, route, method, dataCy, callback }) => {
    const { addAlert } = useLoadContext(AlertContext);
    const { post, put } = useApi();

    const [load, setLoad] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string | string[]>>();

    const submitForm = async (formEvent: React.FormEvent<HTMLFormElement>) => {
        formEvent.preventDefault();
        const data = new FormData(formEvent.currentTarget)

        setLoad(true);
        const response = method == "POST"
            ? await post(route, data)
            : await put(route, data)

        addAlert({
            type: response.isStatusValid ? "success" : "error",
            message: response.message
        });
        setLoad(false);

        if (response.isStatusValid) {
            callback(response)
            return
        }

        setErrors(response.errors)
    }

    return (
        <>
            {load ?
                <Loading />
                : ""
            }
            <form onSubmit={submitForm} className={className ? className : "flex flex-col justify-center items-baseline gap-4"} hidden={load}>
                {fields.map((field) => {
                    const { label, name, type, ...rest } = field
                    var error: string | string[] = ""
                    if (errors) {
                        if (errors[name]) {
                            if (typeof errors[name] == "string")
                                error = errors[name]
                            else
                                error = errors[name][0]
                        }
                    }
                    return (
                        <CustomField label={label} name={name} type={type ? type : "text"} error={error} {...rest} />
                    )
                })}
                <input data-cy={dataCy} type="submit" disabled={load} value={buttonValue ? buttonValue : "Confirmar"} className="w-full bg-primary rounded-md p-2 hover:bg-secondary text-white cursor-pointer" />
            </form>
        </>
    );
};

export default CustomForm;