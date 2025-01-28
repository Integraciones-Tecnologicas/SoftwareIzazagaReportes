import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers"
import { Link } from "react-router-dom"
import { faBoxesPacking, faCalendarCheck } from "@fortawesome/free-solid-svg-icons"
import { GoChecklist } from "react-icons/go";
import { AiOutlineFileSearch } from "react-icons/ai";

const HomePage = () => {
  return (
    <>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-24 px-40"> 
          <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-xl mx-10 hover:bg-gray-300 transition duration-300 hover:cursor-pointer">
            <FontAwesomeIcon icon={faUsers} size="3x" className="text-indigo-500 mb-4" />
            <Link to="/registro" className="text-lg font-semibold text-indigo-600 hover:text-indigo-700">
              Registro de Locatarios
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-xl p-8 hover:bg-gray-300 transition duration-300 hover:cursor-pointer mx-10">
            <FontAwesomeIcon icon={faBoxesPacking} size="3x" className="text-indigo-500 mb-4" />
            <Link to="/catalogo-productos" className="text-lg font-semibold text-indigo-600 hover:text-indigo-700">
              Catalogo de Productos
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-xl p-8 hover:bg-gray-300 mx-10 transition duration-300 hover:cursor-pointer">
            <GoChecklist size='50' className="text-indigo-500 mb-4" />
            <Link to="/captura-entrada" className="text-lg font-semibold text-indigo-600 hover:text-indigo-700">
              Captura de Entrada
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-xl mx-10 p-8 hover:bg-gray-300 transition duration-300 hover:cursor-pointer">
            <FontAwesomeIcon icon={faCalendarCheck} size="3x" className="text-indigo-500 mb-4" />
            <Link to="/agendar-cita" className="text-lg font-semibold text-indigo-600 hover:text-indigo-700">
              Agendar Cita
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-xl p-8 hover:bg-gray-300 transition duration-300 hover:cursor-pointer mx-10">
            <AiOutlineFileSearch size='50' className="text-indigo-500 mb-4" />
            <Link to="/revision-ingreso" className="text-lg font-semibold text-indigo-600 hover:text-indigo-700">
              Revisión de Ingreso
            </Link>
          </div>
      </div>
    </>
  )
}

export default HomePage