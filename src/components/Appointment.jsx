import { useForm } from "react-hook-form";
import ErrorMessage from './ErrorMessage';
import useStore from "../store";

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