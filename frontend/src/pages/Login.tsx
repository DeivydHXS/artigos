import React, { useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLoadContext } from '../hooks/useContext';
import { AuthContext } from '../contexts/AuthContext';
import CustomForm from '../components/CustomForm';

const Login: React.FC = () => {
  const { doLogin } = useLoadContext(AuthContext)
  const navigate = useNavigate()

  const loginFormCallback = useCallback((response: any) => {
    if (response.isStatusValid) {
      if (response.data) {
        doLogin(response.data.user, response.data.token);
        navigate('/feed');
      }
    }
  }, []);

  return (
    <div className='bg-white p-8 rounded-md border-b-1 border-b-neutral flex flex-col gap-2 min-w-[400px] max-w-[500px]'>
      <h1 className='text-center'>Commit.dev</h1>
      <h2 className='mb-4 text-center'>Login</h2>

      <CustomForm dataCy='login-button' route='/login' method='POST' callback={loginFormCallback} buttonValue='Entrar' fields={[
        {
          label: 'Email',
          type: 'email',
          name: 'email',
          placeholder: 'Digite seu email',
          dataCy: 'input-email'
        },
        {
          label: 'Senha',
          type: 'password',
          name: 'password',
          placeholder: 'Digite sua senha',
          dataCy: 'input-password'
        },
      ]} />

      <div>
        <div className='flex gap-1 text-sm'>
          <p>Novo por aqui?</p>
          <NavLink to="/register" className='font-semibold'>Crie uma conta.</NavLink>
        </div>

        <div className='flex gap-1 text-sm'>
          <p>Problemas com o login?</p>
          <NavLink to="/login-problems" className='font-semibold'>Clique aqui.</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Login;
