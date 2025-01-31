import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import { Link } from "react-router-dom";
import { faBoxesPacking, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { GoChecklist } from "react-icons/go";
import { AiOutlineFileSearch } from "react-icons/ai";
import useStore from "../store/store";

const HomePage = () => {
  const currentUser = useStore((state) => state.currentUser);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-24 px-40"> 
        {currentUser.role === "admin" && (
          <Link to="/registro" className="text-lg font-semibold text-indigo-600 hover:text-indigo-700">
            <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-xl p-8 hover:bg-gray-300 transition duration-300 hover:cursor-pointer md:mx-7 lg:mx-14 -mx-7">
              <FontAwesomeIcon icon={faUsers} size="3x" className="text-indigo-500 mb-4" />
              Registro de Locatarios
            </div>
          </Link>
        )}

        <Link to="/catalogo-productos" className="text-lg font-semibold text-indigo-600 hover:text-indigo-700">
          <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-xl p-8 hover:bg-gray-300 transition duration-300 hover:cursor-pointer md:mx-7 lg:mx-14 -mx-7">
            <FontAwesomeIcon icon={faBoxesPacking} size="3x" className="text-indigo-500 mb-4" />
            Catalogo de Productos
          </div>
        </Link>

        <Link to="/captura-entrada" className="text-lg font-semibold text-indigo-600 hover:text-indigo-700">
          <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-xl p-8 hover:bg-gray-300 transition duration-300 hover:cursor-pointer md:my-3 md:mx-7 lg:mx-14 -mx-7 lg:my-1 lg:pt-4">
            <GoChecklist size='70' className="text-indigo-500 mb-4" />
            Captura de Entrada
          </div>
        </Link>

        <Link to="/agendar-cita" className="text-lg font-semibold text-indigo-600 hover:text-indigo-700">
          <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-xl p-8 md:my-3 hover:bg-gray-300 md:mx-7 lg:mx-14 transition duration-300 hover:cursor-pointer sm:mx-1 sm:mt-1 -mx-7">
            <FontAwesomeIcon icon={faCalendarCheck} size="3x" className="text-indigo-500 mb-4" />
            Agendar Cita
          </div>
        </Link>

        {currentUser.role === "admin" && (
          <Link to="/revision-ingreso" className="text-lg font-semibold text-indigo-600 hover:text-indigo-700">
            <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-xl md:my-3 p-8 hover:bg-gray-300 transition duration-300 hover:cursor-pointer md:mx-7 lg:mx-14 sm:mx-1 sm:mt-1 -mx-7">
              <AiOutlineFileSearch size='60' className="text-indigo-500 mb-4" />
              Revisión de Ingreso
            </div>
          </Link>
        )}
      </div>
    </>
  );
};

export default HomePage;