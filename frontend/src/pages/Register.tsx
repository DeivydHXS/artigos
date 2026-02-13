import React, { useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLoadContext } from "../hooks/useContext";
import { AlertContext } from "../contexts/AlertContext";
import CustomForm from "../components/CustomForm";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const Register: React.FC = () => {
  const { addAlert } = useLoadContext(AlertContext);
  const navigate = useNavigate();

  const registerFormCallback = useCallback(async (response: any) => {
    if (response.isStatusValid) {
      addAlert({
        type: "success",
        message:
          "Conta criada com sucesso! Confirme sua conta pelo email.",
      });
      navigate("/login");
      return;
    }
  }, []);

  return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-card border border-border rounded-xl p-8 shadow-lg shadow-primary/10 flex flex-col gap-6 relative"
      >

        {/* Header */}
        <div className="flex items-center justify-center relative">
          <NavLink
            to="/login"
            className="absolute left-0 text-muted-foreground hover:text-primary transition"
          >
            <ArrowLeft size={18} />
          </NavLink>

          <h1 className="text-2xl font-bold tracking-tight">
            Criar <span className="text-primary">Conta</span>
          </h1>
        </div>

        {/* Form */}
        <CustomForm
          dataCy="register-button"
          route="/register"
          method="POST"
          callback={registerFormCallback}
          buttonValue="Registrar"
          fields={[
            {
              label: "Nome",
              type: "text",
              name: "name",
              placeholder: "Digite seu nome",
            },
            {
              label: "Email",
              type: "email",
              name: "email",
              placeholder: "Digite seu email",
            },
            {
              label: "Senha",
              type: "password",
              name: "password",
              placeholder: "Digite sua senha",
            },
            {
              label: "Confirmar senha",
              type: "password",
              name: "password_confirmation",
              placeholder: "Digite sua senha novamente",
            },
            {
              label: "Data de nascimento",
              type: "date",
              name: "birthday",
            },
          ]}
        />

      </motion.div>
  );
};

export default Register;
