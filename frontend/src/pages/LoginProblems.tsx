import React, { useCallback, useEffect, useState } from 'react';
import { useLoadContext } from '../hooks/useContext';
import { AlertContext } from '../contexts/AlertContext';
import { NavLink } from 'react-router-dom';
import CustomForm from '../components/CustomForm';
import { TfiAngleLeft } from 'react-icons/tfi';

const loginProblemsOptionEnum = {
    ForgotPassword: 0,
    EmailVerification: 1,
    Default: 2
} as const;

type LoginProblemsOptionType = typeof loginProblemsOptionEnum[keyof typeof loginProblemsOptionEnum];

const LoginProblems: React.FC = () => {
    const { addAlert } = useLoadContext(AlertContext);
    const [loginProblemsOption, setProblemOption] = useState<LoginProblemsOptionType>(loginProblemsOptionEnum.Default);
    const [showComponent, setShowComponent] = useState<boolean>(false);

    const emailVerificationCallback = useCallback(() => {
        setProblemOption(loginProblemsOptionEnum.Default);
        addAlert({
            type: 'success',
            message: 'Email de verificação re-enviado.'
        });
    }, []);

    const forgotPasswordCallback = useCallback(() => {
        setProblemOption(loginProblemsOptionEnum.Default);
        addAlert({
            type: 'success',
            message: 'Email de recuperação de senha enviado.'
        });
    }, []);

    useEffect(() => {
        switch (loginProblemsOption) {
            case loginProblemsOptionEnum.EmailVerification: {
                setShowComponent(true);
                break;
            }
            case loginProblemsOptionEnum.ForgotPassword: {
                setShowComponent(true);
                break;
            }
            case loginProblemsOptionEnum.Default: {
                setShowComponent(false);
            }
        }
    }, [loginProblemsOption]);

    return (
        <div className='bg-white p-8 rounded-md border-b-1 border-b-neutral flex flex-col gap-2 min-w-[400px] max-w-[500px]'>
            {
                showComponent ?
                    loginProblemsOption == loginProblemsOptionEnum.EmailVerification ?
                        <>
                            <div className='flex items-center mb-4'>
                                <button onClick={() => setProblemOption(loginProblemsOptionEnum.Default)} className='absolute cursor-pointer'><p><TfiAngleLeft /></p></button>
                                <div className="w-full flex justify-center">
                                    <h1 className='font-semibold'>Re-enviar email de verificação?</h1>
                                </div>
                            </div>
                            <p>Digite seu email e clique em 'Enviar'. Vamos enviar um email com um link de verificação de conta. </p>
                            <CustomForm dataCy='verification-button' route='/verification-notification' method='POST' callback={emailVerificationCallback} buttonValue='Enviar' fields={[
                                {
                                    label: 'Email',
                                    type: 'email',
                                    name: 'email',
                                    placeholder: 'Digite seu email',
                                    dataCy: 'input-email-verification'
                                }
                            ]} />
                        </>
                        :
                        <>
                            <div className='flex items-center mb-4'>
                                <button onClick={() => setProblemOption(loginProblemsOptionEnum.Default)} className='absolute cursor-pointer'><p><TfiAngleLeft /></p></button>
                                <div className="w-full flex justify-center">
                                    <h1 className='font-semibold'>Esqueceu a senha?</h1>
                                </div>
                            </div>
                            <p>Digite seu email e clique em 'Enviar'. Vamos enviar um email com um link de mudança de senha. </p>
                            <CustomForm dataCy='forgot-password-button' route='/forgot-password' method='POST' callback={forgotPasswordCallback} buttonValue='Enviar' fields={[
                                {
                                    label: 'Email',
                                    type: 'email',
                                    name: 'email',
                                    placeholder: 'Digite seu email',
                                    dataCy: 'input-email-forgot-password'
                                }
                            ]} />
                        </>
                    :
                    <>
                        <div className='flex items-center mb-4'>
                            <NavLink to='/login' className='absolute'>
                                <TfiAngleLeft />
                            </NavLink>
                            <div className="w-full flex justify-center">
                                <h1 className='text-center'>Problemas com login?</h1>
                            </div>
                        </div>
                        <p>Selecione uma opção para prosseguir</p>
                        <div className='flex flex-col gap-4 mt-2'>
                            <button onClick={() => setProblemOption(loginProblemsOptionEnum.EmailVerification)} className='p-4 text-white bg-primary hover:bg-secondary rounded-md cursor-pointer'>Re-enviar email de confirmação</button>
                            <button onClick={() => setProblemOption(loginProblemsOptionEnum.ForgotPassword)} className='p-4 text-white bg-primary hover:bg-secondary rounded-md cursor-pointer'>Esqueci a senha</button>
                        </div>
                    </>
            }
        </div>
    );
};

export default LoginProblems;
