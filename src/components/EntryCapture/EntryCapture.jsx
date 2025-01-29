import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa"; // Icono de calendario
import { useState } from "react";
import RegisterProduct from "./RegisterProduct";
import SearchHeader from "./SearchHeader";
import { ToastContainer } from "react-toastify";

import { CiDeliveryTruck } from "react-icons/ci";
import { PiTruckTrailer } from "react-icons/pi";
import { FaTruckLoading } from "react-icons/fa";
import ErrorMessage from "../ErrorMessage";

const EntryCapture = () => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  
  const modifiedEntries = useStore((state) => state.modifiedEntries);
  const entries = useStore((state) => state.entries);
  const selectedTime = useStore((state) => state.selectedTime);
  const setSelectedTime = useStore((state) => state.setSelectedTime);

  const handleScheduleAppointment = () => {
    useStore.getState().saveReport();
    navigate("/agendar-cita");
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <div className="max-w-4xl mx-auto mt-5 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Registrar Entradas</h2>
      <ToastContainer />
      <SearchHeader toggleModal={toggleModal} />

      {modifiedEntries.length === 0 ? (
        <p className="text-center text-gray-500">No hay entradas registradas.</p>
      ) : (
        <>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full bg-white shadow-lg table-auto border-collapse">
              <thead className="bg-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 border-b">Descripción</th>
                  <th className="px-4 py-3 border-b">SKU</th>
                  <th className="px-4 py-3 border-b">Costo</th>
                  <th className="px-4 py-3 border-b">Precio</th>
                  <th className="px-4 py-3 border-b">Cantidad</th>
                  <th className="px-4 py-3 border-b">Línea</th>
                  <th className="px-4 py-3 border-b">Subfamilia</th>
                  <th className="px-4 py-3 border-b">Piratería</th>
                  <th className="px-4 py-3 border-b">Imagen</th>
                  <th className="px-4 py-3 border-b">Observaciones</th>
                  <th className="px-4 py-3 border-b">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {modifiedEntries.map((entry, index) => (
                  <tr key={index} className="odd:bg-white even:bg-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 border-b">{entry.description}</td>
                    <td className="px-4 py-3 border-b text-center">{entry.sku || "N/A"}</td>
                    <td className="px-4 py-3 border-b text-center">{entry.cost}</td>
                    <td className="px-4 py-3 border-b text-center">{entry.price}</td>
                    <td className="px-4 py-3 border-b text-center">{entry.quantity || "N/A"}</td>
                    <td className="px-4 py-3 border-b">{entry.line}</td>
                    <td className="px-4 py-3 border-b">{entry.subfamily}</td>
                    <td className="px-4 py-3 border-b">{entry.piracy ? "Sí" : "No"}</td>
                    <td className="px-4 py-3 border-b">{entry.images}</td>
                    <td className="px-4 py-3 border-b">{entry.observations || "N/A"}</td>
                    <td className="px-4 py-3 border-b text-center">
                      <button
                        onClick={() => useStore.getState().removeModifiedEntryById(entry.id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          <div className="mt-4 py-4">
            <label className="block font-semibold text-gray-700 mb-2">
              Selecciona el tipo de vehículo y duración:
            </label>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedTime("30 min")}
                className={`p-4 rounded-lg ${selectedTime === "30 min" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-blue-500"}`}
              >
                <FaTruckLoading size={40} />
                <span>Diablito - 30 min</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTime("1 hora")}
                className={`p-4 rounded-lg ${selectedTime === "1 hora" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-blue-500"}`}
              >
                <CiDeliveryTruck size={40} />
                <span>Camión - 1 hora</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTime("2 horas")}
                className={`p-4 rounded-lg ${selectedTime === "2 horas" ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-blue-500"}`}
              >
                <PiTruckTrailer size={40} />
                <span>Trailer - 2 horas</span>
              </button>
            </div>
          </div>
        
          <div className="mt-6 text-center">
            <button
              onClick={handleScheduleAppointment}
              disabled={!selectedTime} // Deshabilita si no se ha seleccionado un tiempo
              className={`flex items-center justify-center font-semibold uppercase py-2 px-4 rounded-lg shadow-lg mx-auto transition-all
                ${selectedTime ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
            >
              <FaCalendarAlt className="mr-2" /> Terminar y Agendar Cita
            </button>
            
            {!selectedTime && (
              <ErrorMessage>Debes seleccionar un tipo de vehículo y duración.</ErrorMessage>
            )}
          </div>

      </>
      )}


      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-200 rounded-xl shadow-lg p-8 w-full max-w-4xl relative overflow-y-auto max-h-screen">
            <RegisterProduct toggleModal={toggleModal} />
            <button
              onClick={toggleModal}
              className="absolute text-2xl top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntryCapture;