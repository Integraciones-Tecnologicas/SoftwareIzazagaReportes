import { useForm } from "react-hook-form";
import ErrorMessage from './ErrorMessage';
import useStore from "../store";
import { CiDeliveryTruck } from "react-icons/ci";
import { PiTruckTrailer } from "react-icons/pi";
import { FaTruckLoading } from "react-icons/fa";

const Appointment = () => {
    const savedReports = useStore((state) => state.savedReports);
    const latestReport = savedReports[savedReports.length - 1]; // Último reporte guardado
    const folio = latestReport ? latestReport.id : "Sin Registro...";
  
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg p-6 mt-3 shadow-xl border">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Solicitud de Cita para Ingreso de Mercancia</h2>
  
        <form className="space-y-4">
            <div>
                <label htmlFor="date" className="block text-sm font-semibold uppercase">
                Fecha:
                </label>
                <input
                type="date"
                id="date"
                className="block w-full mt-1 p-2 border border-gray-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
  
            <div>
                <label htmlFor="time" className="block text-sm font-semibold uppercase">
                Hora:
                </label>
                <input
                type="time"
                id="time"
                className="block w-full mt-1 p-2 border border-gray-500 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
  
            <div>
                <label htmlFor="folio" className="block text-sm font-semibold uppercase">
                Folio de Registro:
                </label>
                <input
                type="text"
                id="folio"
                value={folio} // Mostrar el folio generado
                readOnly // Solo lectura
                className="block w-full mt-1 p-2 border border-gray-500 rounded-md shadow-sm bg-gray-100"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold uppercase mb-2">
                    Selecciona el tipo de vehículo y duración:
                </label>
                <div className="flex items-center justify-between">
                    <button
                    type="button"
                    
                    >
                    <FaTruckLoading size={40} />
                    <span>Diablito - 30 min</span>
                    </button>
                    <button
                    type="button"
                    
                    >
                    <CiDeliveryTruck size={40} />
                    <span>Camión - 1 hora</span>
                    </button>
                    <button
                    type="button"
                    
                    >
                    <PiTruckTrailer size={40} />
                    <span>Trailer - 2 horas</span>
                    </button>
                </div>
            </div>


            <input
                type="submit"
                className="w-full bg-indigo-500 mt-3 p-3 text-white uppercase font-bold hover:bg-indigo-700 cursor-pointer transition-colors"
                value='Agendar Cita'
            />
        </form>
      </div>
    );
  };
  
  export default Appointment;