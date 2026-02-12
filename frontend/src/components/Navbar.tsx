import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { RxHome } from "react-icons/rx";
import { RxBackpack } from "react-icons/rx";
import { RxBookmark } from "react-icons/rx";
import { RxAvatar } from "react-icons/rx";
import { RxEnter } from "react-icons/rx";
import { useLoadContext } from '../hooks/useContext';
import { AuthContext } from '../contexts/AuthContext';
import { LOCAL_STORAGE_KEYS } from '../constants/localstorage';
import type { UserInterface } from '../interfaces/UserInterface';
import UserImageName from './UserImageName';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [user, setUser] = useState<UserInterface>();

  const { logout } = useLoadContext(AuthContext);

  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  useEffect(() => {
    var user: UserInterface = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || '');
    setUser(user);
  }, []);

  const onMouseEnter = () => {
    setIsOpen(true)
  }

  const onMouseLeave = () => {
    setIsOpen(false)
  }

  return (
    <>
      <nav className='w-screen bg-white flex items-center justify-center gap-2 py-4 border-b-1 border-b-neutral fixed z-1'>
        <div className='w-[80vw] flex items-center justify-between gap-4 px-4'>
          <NavLink data-cy={`link-home`} to="/feed" className="text-lg font-bold">Commit.dev</NavLink >
          <div data-cy={`button-open-navbar-modal`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <div>
                <UserImageName user={user} onNavbar={true} />
              {/* <NavLink to='/profile' className='w-full h-full'>
              </NavLink> */}
            </div>
            {isOpen &&
              <div className='absolute' onBlur={onMouseLeave}>
                <div className='w-[15vw] flex flex-col bg-white rounded-md shadow-2xl'>
                  <NavLink data-cy={`link-modal-home`} to="/feed" className={(props) => {
                    return `${props.isActive ? 'bg-primary text-white' : 'text-black'} flex items-center gap-1 hover:bg-secondary hover:text-white p-2 rounded-t-md`
                  }}>
                    <div>
                      <RxHome />
                    </div>
                    <p>Início</p>
                  </NavLink >
                  <NavLink data-cy={`link-modal-profile`} to="/profile" className={(props) => {
                    return `${props.isActive ? 'bg-primary text-white' : 'text-black'} flex items-center gap-1 hover:bg-secondary hover:text-white p-2 `
                  }}>
                    <div>
                      <RxAvatar />
                    </div>
                    <p>Perfil</p>
                  </NavLink >
                  <NavLink data-cy={`link-modal-articles`} to="/articles" className={(props) => {
                    return `${props.isActive ? 'bg-primary text-white' : 'text-black'} flex items-center gap-1 hover:bg-secondary hover:text-white p-2`
                  }}>
                    <div>
                      <RxBackpack />
                    </div>
                    <p>Meus artigos</p>
                  </NavLink >
                  <NavLink data-cy={`link-modal-favorites`} to="/favorites" className={(props) => {
                    return `${props.isActive ? 'bg-primary text-white' : 'text-black'} flex items-center gap-1 hover:bg-secondary hover:text-white p-2`
                  }}>
                    <div>
                      <RxBookmark />
                    </div>
                    <p>Meus favoritos</p>
                  </NavLink >
                  <button data-cy={`link-modal-logout`} onClick={handleLogout} className='flex items-center gap-1 cursor-pointer hover:bg-secondary hover:text-white p-2 rounded-b-md'>
                    <div>
                      <RxEnter />
                    </div>
                    <p>Sair</p>
                  </button >
                </div>
              </div>
            }
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
