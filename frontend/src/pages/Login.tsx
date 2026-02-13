import React, { useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLoadContext } from "../hooks/useContext";
import { AuthContext } from "../contexts/AuthContext";
import CustomForm from "../components/CustomForm";
import { motion } from "framer-motion";

const Login: React.FC = () => {
  const { doLogin } = useLoadContext(AuthContext);
  const navigate = useNavigate();

  const loginFormCallback = useCallback((response: any) => {
    if (response.isStatusValid) {
      if (response.data) {
        doLogin(response.data.user, response.data.token);
        navigate("/feed");
      }
    }
  }, []);

  return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-lg shadow-primary/10 flex flex-col gap-6"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-primary">Acesse</span> sua conta
          </h1>
        </div>

        {/* Form */}
        <CustomForm
          dataCy="login-button"
          route="/login"
          method="POST"
          callback={loginFormCallback}
          buttonValue="Entrar"
          fields={[
            {
              label: "Email",
              type: "email",
              name: "email",
              placeholder: "Digite seu email",
              dataCy: "input-email",
            },
            {
              label: "Senha",
              type: "password",
              name: "password",
              placeholder: "Digite sua senha",
              dataCy: "input-password",
            },
          ]}
        />

        {/* Links */}
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex gap-1 justify-center">
            <p>Novo por aqui?</p>
            <NavLink
              to="/register"
              className="text-primary hover:underline"
            >
              Crie uma conta.
            </NavLink>
          </div>

          <div className="flex gap-1 justify-center">
            <p>Problemas com o login?</p>
            <NavLink
              to="/login-problems"
              className="text-primary hover:underline"
            >
              Clique aqui.
            </NavLink>
          </div>
        </div>
      </motion.div>
  );
};

export default Login;
