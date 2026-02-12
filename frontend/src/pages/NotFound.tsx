import React from 'react';
import { NavLink } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <main className="h-screen flex flex-col gap-2 items-center justify-center">
      <h1>404 - Página não encontrada.</h1>
      <NavLink to='/feed' className='bg-primary font-semibold text-white shadow-2xl rounded-md p-2'>Ir para página inicial</NavLink>
    </main>
  );
};

export default NotFound;
