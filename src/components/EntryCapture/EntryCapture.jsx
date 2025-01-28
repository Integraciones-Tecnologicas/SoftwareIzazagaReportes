import useStore from "../../store";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa"; // Icono de calendario
import { useState } from "react";
import RegisterProduct from "./RegisterProduct";
import SearchHeader from "./SearchHeader";
import { ToastContainer } from "react-toastify";

const EntryCapture = () => {
  const navigate = useNavigate(); // Inicializar el hook para navegación
  const [isModalOpen, setModalOpen] = useState(false); // Estado para controlar la ventana modal
  const modifiedEntries = useStore((state) => state.modifiedEntries);
  const entries = useStore((state) => state.entries); // Obtener las entradas del estado global

  const handleScheduleAppointment = () => {
    useStore.getState().saveReport();
    navigate("/agendar-cita"); // Redirigir después de guardar
  };  
  
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };
  

  return (
    <div className="max-w-4xl mx-auto mt-5 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Registrar Entradas</h2>
      <ToastContainer />
      <SearchHeader 
        toggleModal={toggleModal}
      />

      {modifiedEntries.length === 0 ? (
        <p className="text-center text-gray-500">No hay entradas registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Descripción</th>
                <th className="px-4 py-2 border">SKU</th>
                <th className="px-4 py-2 border">Costo</th>
                <th className="px-4 py-2 border">Precio</th>
                <th className="px-4 py-2 border">Cantidad</th>
                <th className="px-4 py-2 border">Línea</th>
                <th className="px-4 py-2 border">Subfamilia</th>
                <th className="px-4 py-2 border">Piratería</th>
                <th className="px-4 py-2 border">Imagen</th>
                <th className="px-4 py-2 border">Observaciones</th>
                <th className="px-4 py-2 border">Acciones</th> {/* Columna de acciones */}
              </tr>
            </thead>
            <tbody>
              {modifiedEntries.map((entry, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-100">
                  <td className="px-4 py-2 border">{entry.description}</td>
                  <td className="px-4 py-2 border">{entry.sku || "N/A"}</td>
                  <td className="px-4 py-2 border">{entry.cost}</td>
                  <td className="px-4 py-2 border">{entry.price}</td>
                  <td className="px-4 py-2 border">{entry.quantity || "N/A"}</td>
                  <td className="px-4 py-2 border">{entry.line}</td>
                  <td className="px-4 py-2 border">{entry.subfamily}</td>
                  <td className="px-4 py-2 border">{entry.piracy ? "Sí" : "No"}</td>
                  <td className="px-4 py-2 border">{entry.images}</td>
                  <td className="px-4 py-2 border">{entry.observations || "N/A"}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => useStore.getState().removeModifiedEntryById(entry.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </td> {/* Botón de eliminar */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {/* Botón para agendar cita */}
      <div className="mt-6 text-center">
        <button
          onClick={handleScheduleAppointment}
          className="flex items-center justify-center bg-indigo-600 font-semibold uppercase text-white py-2 px-4 rounded-lg hover:bg-indigo-700 shadow-lg mx-auto"
        >
          <FaCalendarAlt className="mr-2"/> Terminar y Agendar Cita
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-200 rounded-xl shadow-lg p-8 w-full max-w-4xl relative overflow-y-auto max-h-screen">            
            <RegisterProduct toggleModal={toggleModal}/>
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