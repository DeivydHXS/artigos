import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { RxHome } from "react-icons/rx";
import { RxBackpack } from "react-icons/rx";
import { RxBookmark } from "react-icons/rx";
import { RxAvatar } from "react-icons/rx";
import { RxEnter } from "react-icons/rx";
import { useLoadContext } from "../hooks/useContext";
import { AuthContext } from "../contexts/AuthContext";
import UserImageName from "./UserImageName";
import ThemeToggle from "./ThemeToggle";

const Navbar: React.FC = () => {
  const { user, logout } = useLoadContext(AuthContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest("#navbar-dropdown")) {
        setIsOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="w-full bg-background border-b border-border fixed top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <NavLink to="/feed" className="text-lg font-bold">
            <span className="text-primary">Commit</span>.dev
          </NavLink>
          <div className="mt-4">
            <ThemeToggle />
          </div>

          <div className="relative" id="navbar-dropdown">
            <button onClick={() => setIsOpen(prev => !prev)}>
              <UserImageName user={user} onNavbar />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-md shadow-md">
                <NavLink to="/feed" className={linkClass}>
                  <RxHome /> Início
                </NavLink>

                <NavLink to="/profile" className={linkClass}>
                  <RxAvatar /> Perfil
                </NavLink>

                <NavLink to="/articles" className={linkClass}>
                  <RxBackpack /> Meus artigos
                </NavLink>

                <NavLink to="/favorites" className={linkClass}>
                  <RxBookmark /> Meus favoritos
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted w-full"
                >
                  <RxEnter /> Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 px-3 py-2 text-sm transition-colors ${isActive
    ? "bg-primary text-primary-foreground"
    : "text-foreground hover:bg-muted"
  }`;

export default Navbar;
