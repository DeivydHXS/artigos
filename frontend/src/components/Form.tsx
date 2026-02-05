import { useState, type PropsWithChildren } from "react";
import type React from "react";

interface FormProps extends PropsWithChildren {
    handleSubmit: (form: React.FormEvent<HTMLFormElement>) => Promise<void>;
    buttonValue?: string;
    className?: string;
}

const Form: React.FC<FormProps> = ({ handleSubmit, children, buttonValue, className = '' }) => {
    
    const [load, setLoad] = useState<boolean>(false);

    const submitForm = async  (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoad(true);
        try{ await handleSubmit(e); }catch(err) {}
       
        setLoad(false);
    }

    return (
        <form onSubmit={submitForm} className={className ? className : 'flex flex-col justify-center items-baseline gap-4'}>
            {children}
            { buttonValue ? <input type="submit" disabled={load} value={buttonValue} className='w-full bg-primary rounded-md p-2 hover:bg-secondary text-white' />
            : ''}
        </form>
    );
};

export default Form;