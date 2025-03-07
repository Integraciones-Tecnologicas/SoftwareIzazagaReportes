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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-24 px-28 md:px-56"> 
        {currentUser.role === "admin" && (
          <Link to="/registro">
            <div className="relative bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 hover:scale-105 hover:cursor-pointer w-full lg:w-64 h-56 sm:h-72 md:h-80">
              <div className="absolute top-6 left-1/4 transform -translate-x-1/2">
                <div className="bg-white bg-opacity-80 rounded-md px-3 py-1">
                  <h3 className="text-xl font-semibold text-gray-800 hover:text-gray-950">Locatarios</h3>
                </div>
              </div>
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-4/5">
                <img src="/Iconos/Locatarios.png" alt="Locatarios" className="w-full h-auto object-contain" />
              </div>
            </div>
          </Link>     
        )}

        <Link to="/catalogo-productos">
          <div className="relative bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300 hover:scale-105 hover:cursor-pointer w-full lg:w-64 h-56 sm:h-72 md:h-80">
            <div className="absolute top-6 left-1/4 transform -translate-x-1/2">
                <div className="bg-white bg-opacity-80 rounded-md px-3 py-1">
                    <h3 className="text-xl font-semibold text-gray-800">Articulos</h3>
                </div>
            </div>
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 ">
                <img src="/Iconos/Prods.png" alt="Articulos" className="w-full h-auto object-contain"/>
            </div>
          </div>
        </Link>
        
        <Link to="/captura-entrada">
          <div className="relative bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300 hover:scale-105 hover:cursor-pointer w-full lg:w-64 h-56 sm:h-72 md:h-80">
            <div className="absolute top-6 left-1/4 transform -translate-x-1/2">
                <div className="bg-white bg-opacity-80 rounded-md px-3 py-1">
                    <h3 className="text-xl font-semibold text-gray-800">Captura</h3>
                </div>
            </div>
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-4/5">
                <img src="/Iconos/Captura.png" alt="Captura" className="w-full h-auto object-contain" />
            </div>
          </div>
        </Link>

        <Link to="/agendar-cita">
          <div className="relative bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300 hover:scale-105 hover:cursor-pointer w-full lg:w-64 h-56 sm:h-72 md:h-80">
            <div className="absolute top-6 left-1/3 transform -translate-x-1/2">
                <div className="bg-white bg-opacity-80 rounded-md px-3 py-1">
                    <h3 className="text-xl font-semibold text-gray-800">Agendar Cita</h3>
                </div>
            </div>
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-4/5">
                <img src="/Iconos/Cita.png" alt="Cita" className="w-full h-auto object-contain" />
            </div>
          </div>
        </Link>

        {currentUser.role === "admin" && (
            <Link to="/revision-ingreso">
              <div className="relative bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300 hover:scale-105 hover:cursor-pointer w-full lg:w-64 h-56 sm:h-72 md:h-80">
                <div className="absolute top-6 left-1/4 transform -translate-x-1/2">
                    <div className="bg-white bg-opacity-80 rounded-md px-3 py-1">
                        <h3 className="text-xl font-semibold text-gray-800">Recepción</h3>
                    </div>
                </div>
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-4/5">
                    <img src="/Iconos/Recepcion.png" alt="Recepción" className="w-full h-auto object-contain" />
                </div>
              </div>
            </Link>
        )}
            <Link to="/reportes">
              <div className="relative bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300 hover:scale-105 hover:cursor-pointer w-full lg:w-64 h-56 sm:h-72 md:h-80">
                <div className="absolute top-6 left-1/4 transform -translate-x-1/2">
                    <div className="bg-white bg-opacity-80 rounded-md px-3 py-1">
                        <h3 className="text-xl font-semibold text-gray-800">Reportes</h3>
                    </div>
                </div>
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-4/5">
                    <img src="/Iconos/Reportes.png" alt="Reportes" className="w-full h-auto object-contain" />
                </div>
              </div>
            </Link>        
      </div>
    </>
  );
};

export default HomePage;