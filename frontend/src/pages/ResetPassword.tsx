import React, { useCallback, type FormEvent } from "react";
import { useApi } from "../hooks/useApi";
import { useNavigate, useParams } from "react-router-dom";
import { useLoadContext } from "../hooks/useContext";
import { AlertContext } from "../contexts/AlertContext";

const ResetPassword: React.FC = () => {
    const { addAlert } = useLoadContext(AlertContext);
    let params = useParams();
    const { post } = useApi();
    const navigate = useNavigate()

    const handleSubmit = useCallback(async (form: FormEvent<HTMLFormElement>) => {
        form.preventDefault()
        const data = new FormData(form.currentTarget);
        const response = await post(`reset-password/${params.email}/${params.hash}`, data);
        addAlert({
            type: "success",
            message: response.message
        });
        navigate("/login");
    }, []);

    return (
        <div className="bg-white p-8 rounded-md border-b-1 border-b-neutral flex flex-col gap-2 min-w-[400px] max-w-[500px] items-center">
            <h1 className="text-2xl font-bold mb-4">Recuperação de senha</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label htmlFor="password">Nova Senha</label>
                <input type="password" name="password" id="password" placeholder="Digite sua nova senha" />
                <label htmlFor="password_confirmation">Nova Senha</label>
                <input type="password" name="password_confirmation" id="password_confirmation" placeholder="Digite sua nova senha novamente" />
                <input type="submit" value="Confirmar" />
            </form>
        </div>
    );
};

export default ResetPassword;
