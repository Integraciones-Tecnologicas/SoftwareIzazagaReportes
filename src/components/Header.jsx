import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBars, faTimes, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import useStore from "../store/store";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = useStore((state) => state.currentUser);
  const logout = useStore((state) => state.logout);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="bg-zinc-200 shadow-xl">
      <nav className="max-w-screen-2xl mx-auto flex items-center justify-between px-3 py-4 ">
        {/* Logo / Icono de Casa */}
        <Link
          to="/"
          className="text-indigo-600 text-4xl hover:text-indigo-700 transition duration-300 mr-9"
          onClick={closeMenu}
        >
          <FontAwesomeIcon icon={faHouse} />
        </Link>

        {/* Botón de hamburguesa */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-indigo-600 text-3xl focus:outline-none"
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </button>

        {/* Menú de navegación */}
        <ul
          className={`${
            isOpen ? "block" : "hidden"
          } absolute md:static top-16 left-0 w-full md:w-full md:ml-6 lg:ml-20 bg-zinc-200 md:bg-transparent text-base md:flex gap-4 text-indigo-500 transition-all duration-100 md:items-center font-medium z-50`}
        >
          {/* Mostrar enlaces solo si no estamos en la página de inicio */}
          {location.pathname !== "/" && (
            <>
              {currentUser.role === "admin" && (
                <li className="hover:text-indigo-700 hover:underline transition duration-300 px-6 md:px-0 py-2 md:py-0">
                  <Link to="/registro" onClick={closeMenu}>Registro Locatarios</Link>
                  <span className="hidden md:inline text-gray-400 ml-1">|</span>
                </li>
              )}
              <li className="hover:text-indigo-700 hover:underline transition duration-300 px-6 md:px-0 py-2 md:py-0">
                <Link to="/catalogo-productos" onClick={closeMenu}>Catálogo de Productos</Link>
                <span className="hidden md:inline text-gray-400 ml-1">|</span>
              </li>
              <li className="hover:text-indigo-700 hover:underline transition duration-300 px-6 md:px-0 py-2 md:py-0">
                <Link to="/captura-entrada" onClick={closeMenu}>Captura de Entrada</Link>
                <span className="hidden md:inline text-gray-400 ml-1">|</span>
              </li>
              <li className="hover:text-indigo-700 hover:underline transition duration-300 px-6 md:px-0 py-2 md:py-0">
                <Link to="/agendar-cita" onClick={closeMenu}>Agendar Cita</Link>
                <span className="hidden md:inline text-gray-400 ml-1">|</span>
              </li>
              {currentUser.role === "admin" && (
                <li className="hover:text-indigo-700 hover:underline transition duration-300 px-6 md:px-0 py-2 md:py-0">
                  <Link to="/revision-ingreso" onClick={closeMenu}>Recepción de Mercancia</Link>
                  <span className="hidden md:inline text-gray-400 ml-1">|</span>

                </li>
              )}
            </>
          )}

          {/* Mostrar el nombre del usuario con icono */}
          {currentUser && (
            <li className={`${location.pathname !== "/" ? "mx-auto" : "ml-auto"} flex items-center gap-2 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-xl shadow-md`}>
              <FontAwesomeIcon icon={faUser} className="text-indigo-500" />
              <span className="font-bold sm:text-base md:text-xs lg:text-lg w-16 md:w-full">
                {currentUser.role === "admin" ? "Administrador" : currentUser.nameTenant}
              </span>
            </li>
          )}

          {/* Botón de cerrar sesión */}
          {currentUser && (
            <li className="hover:text-indigo-700 hover:underline transition duration-300 px-6 md:px-0 md:pl-2 py-2 md:py-0 md:w-10 lg:w-36">
              <button onClick={() => { logout(); closeMenu(); }} className="font-semibold text-red-500 hover:text-red-600">
                Cerrar Sesión
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header