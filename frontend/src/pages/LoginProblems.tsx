import React, { useCallback, useState } from "react";
import { useLoadContext } from "../hooks/useContext";
import { AlertContext } from "../contexts/AlertContext";
import { NavLink } from "react-router-dom";
import CustomForm from "../components/CustomForm";
import { TfiAngleLeft } from "react-icons/tfi";
import { motion } from "framer-motion";

const loginProblemsOptionEnum = {
  ForgotPassword: 0,
  EmailVerification: 1,
  Default: 2,
} as const;

type LoginProblemsOptionType =
  typeof loginProblemsOptionEnum[keyof typeof loginProblemsOptionEnum];

const LoginProblems: React.FC = () => {
  const { addAlert } = useLoadContext(AlertContext);
  const [loginProblemsOption, setProblemOption] =
    useState<LoginProblemsOptionType>(
      loginProblemsOptionEnum.Default
    );

  const emailVerificationCallback = useCallback(() => {
    setProblemOption(loginProblemsOptionEnum.Default);
    addAlert({
      type: "success",
      message: "Email de verificação re-enviado.",
    });
  }, []);

  const forgotPasswordCallback = useCallback(() => {
    setProblemOption(loginProblemsOptionEnum.Default);
    addAlert({
      type: "success",
      message: "Email de recuperação de senha enviado.",
    });
  }, []);

  const showComponent =
    loginProblemsOption !== loginProblemsOptionEnum.Default;

  return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-card border border-border rounded-xl p-8 flex flex-col gap-6"
      >

        {showComponent ? (
          <>
            {/* Header */}
            <div className="flex items-center relative">
              <button
                onClick={() =>
                  setProblemOption(loginProblemsOptionEnum.Default)
                }
                className="absolute left-0 text-muted-foreground hover:text-primary cursor-pointer transition"
              >
                <TfiAngleLeft />
              </button>

              <div className="w-full text-center">
                <h1 className="font-semibold">
                  {loginProblemsOption ===
                  loginProblemsOptionEnum.EmailVerification
                    ? "Re-enviar email de verificação"
                    : "Esqueceu a senha?"}
                </h1>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Digite seu email e clique em "Enviar".
            </p>

            <CustomForm
              dataCy={
                loginProblemsOption ===
                loginProblemsOptionEnum.EmailVerification
                  ? "verification-button"
                  : "forgot-password-button"
              }
              route={
                loginProblemsOption ===
                loginProblemsOptionEnum.EmailVerification
                  ? "/verification-notification"
                  : "/forgot-password"
              }
              method="POST"
              callback={
                loginProblemsOption ===
                loginProblemsOptionEnum.EmailVerification
                  ? emailVerificationCallback
                  : forgotPasswordCallback
              }
              buttonValue="Enviar"
              fields={[
                {
                  label: "Email",
                  type: "email",
                  name: "email",
                  placeholder: "Digite seu email",
                },
              ]}
            />
          </>
        ) : (
          <>
            {/* Default */}
            <div className="flex items-center relative">
              <NavLink
                to="/login"
                className="absolute left-0 text-muted-foreground hover:text-primary cursor-pointer transition"
              >
                <TfiAngleLeft />
              </NavLink>

              <div className="w-full text-center">
                <h1 className="font-semibold">
                  Problemas com login?
                </h1>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Selecione uma opção para continuar
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() =>
                  setProblemOption(
                    loginProblemsOptionEnum.EmailVerification
                  )
                }
                className="
                  w-full
                  bg-primary
                  hover:bg-primary/90
                  text-primary-foreground
                  font-semibold
                  py-3
                  rounded-md
                  transition-colors
                  cursor-pointer
                "
              >
                Re-enviar email de confirmação
              </button>

              <button
                onClick={() =>
                  setProblemOption(
                    loginProblemsOptionEnum.ForgotPassword
                  )
                }
                className="
                  w-full
                  bg-primary
                  hover:bg-primary/90
                  text-primary-foreground
                  font-semibold
                  py-3
                  rounded-md
                  transition-colors
                  cursor-pointer
                "
              >
                Esqueci a senha
              </button>
            </div>
          </>
        )}

      </motion.div>
  );
};

export default LoginProblems;
