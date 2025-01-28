import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-zinc-200 shadow-xl">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo / Icono de Casa */}
        <Link
          to="/"
          className="text-indigo-600 text-4xl hover:text-indigo-700 transition duration-300"
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
          } absolute md:static top-16 left-0 w-full md:w-auto bg-zinc-200 md:bg-transparent text-lg md:flex gap-4 text-indigo-500 transition-all duration-100 md:items-center font-semibold `}
        >
          <li className="hover:text-indigo-700 hover:underline transition duration-300 px-6 md:px-0 py-2 md:py-0">
            <Link to="/registro">Registro de Locatarios</Link>
          </li>
          <li className="hover:text-indigo-700 hover:underline transition duration-300 px-6 md:px-0 py-2 md:py-0">
            <Link to="/catalogo-productos">Catalogo de Producto</Link>
          </li>
          <li className="hover:text-indigo-700 hover:underline transition duration-300 px-6 md:px-0 py-2 md:py-0">
            <Link to="/captura-entrada">Captura de Entrada</Link>
          </li>
          <li className="hover:text-indigo-700 hover:underline transition duration-300 px-6 md:px-0 py-2 md:py-0">
            <Link to="/agendar-cita">Agendar Cita</Link>
          </li>
          <li className="hover:text-indigo-700 hover:underline transition duration-300 px-6 md:px-0 py-2 md:py-0">
            <Link to="/revision-ingreso">Revisión de Ingreso</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
