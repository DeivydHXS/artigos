import React, { useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLoadContext } from '../hooks/useContext';
import { AlertContext } from '../contexts/AlertContext';
import CustomForm from '../components/CustomForm';
import { TfiAngleLeft } from 'react-icons/tfi';

const Register: React.FC = () => {
  const { addAlert } = useLoadContext(AlertContext);
  const navigate = useNavigate();

  const registerFormCallback = useCallback(async (response: any) => {
    if (response.isStatusValid) {
      addAlert({
        type: 'success',
        message: 'Conta criada com sucesso! Confirme sua conta pelo email.'
      });
      navigate('/login');
      return
    }

  }, []);

  return (
    <div className='bg-white p-8 rounded-md border-b-1 border-b-neutral flex flex-col gap-2 min-w-[400px] max-w-[500px]'>
      <div className='flex items-center mb-4'>
        <NavLink to='/login' className='absolute'>
          <TfiAngleLeft />
        </NavLink>
        <div className="w-full flex justify-center">
          <h1 className='text-center text-2xl font-bold'>Registrar</h1>
        </div>
      </div>

      <CustomForm dataCy='register-button' route='/register' method='POST' callback={registerFormCallback} buttonValue='Registrar' fields={[
        {
          label: 'Nome',
          type: 'text',
          name: 'name',
          placeholder: 'Digite seu nome'
        },
        {
          label: 'Email',
          type: 'email',
          name: 'email',
          placeholder: 'Digite seu email'
        },
        {
          label: 'Senha',
          type: 'password',
          name: 'password',
          placeholder: 'Digite sua senha'
        },
        {
          label: 'Confirmar senha',
          type: 'password',
          name: 'password_confirmation',
          placeholder: 'Digite sua senha novamente'
        },
        {
          label: 'Data de nascimento',
          type: 'date',
          name: 'birthday'
        },
      ]} />
    </div >
  );
};

export default Register;
