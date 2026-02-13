import React, { useCallback, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useLoadContext } from "../hooks/useContext";
import { AlertContext } from "../contexts/AlertContext";

const VerifyEmail: React.FC = () => {
    const { addAlert } = useLoadContext(AlertContext);
    let params = useParams();
    const { get } = useApi();

    const verify = useCallback(async () => {
        const response = await get(`email/verify/${params.user_id}/${params.hash}`);
        addAlert({
            type: "success",
            message: response.message
        });
    }, []);

    useEffect(() => {
        verify();
    }, []);

    return (
        <div className="bg-white p-8 rounded-md border-b-1 border-b-neutral flex flex-col gap-2 min-w-[400px] max-w-[500px] items-center">
            <h1 className="text-2xl font-bold mb-4">Email verificado</h1>
            <NavLink to="/login" className="text-white rounded-md bg-primary p-2 font-semibold">Clique aqui para ir para a tela de login</NavLink>
        </div>
    );
};

export default VerifyEmail;
