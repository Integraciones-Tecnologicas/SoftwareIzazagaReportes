import { useEffect, useState, useMemo } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import RegisterProduct from "./RegisterProduct";
import SearchHeader from "./SearchHeader";
import { ToastContainer } from "react-toastify";
import { CiDeliveryTruck } from "react-icons/ci";
import { PiTruckTrailer } from "react-icons/pi";
import { FaTruckLoading } from "react-icons/fa";
import ErrorMessage from "../ErrorMessage";
import EntriesTable from "./EntriesTable";
import axios from "axios";
import EntradasPendientes from "../EntradasPendientes";

const EntryCapture = () => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [pendingReports, setPendingReports] = useState([]); // Lista de reportes pendientes
  const [entradaId, setEntradaId] = useState(null); // Estado para el ID de la entrada
  const [partidas, setPartidas] = useState([]); // Estado para las partidas
  const [selectedPendingReport, setSelectedPendingReport] = useState(""); // Reporte pendiente seleccionado

  // Obtén los valores del store
  const modifiedEntries = useStore((state) => state.modifiedEntries);
  const saveReport = useStore((state) => state.saveReport);
  const removeModifiedEntryById = useStore((state) => state.removeModifiedEntryById);
  const getReportsByCurrentUser = useStore((state) => state.getReportsByCurrentUser);
  const loadPendingReport = useStore((state) => state.loadPendingReport);
  const currentFolio = useStore((state) => state.currentFolio);
  const savedReports = useStore((state) => state.savedReports); // Obtener los reportes guardados del store
  const resetReportState = useStore((state) => state.resetReportState); // Función para reiniciar el estado del reporte

  // Obtén el estado del reporte actual
  const currentReport = savedReports.find((report) => report.id === currentFolio);
  const isReportCompleted = currentReport?.status === "completo"; // Verifica si el reporte está completado

  // Usa useMemo para evitar recalcular valores en cada renderizado
  const hasEntries = useMemo(() => modifiedEntries.length > 0, [modifiedEntries]);

  const [selectedTime, setSelectedTime] = useState(null);
  const [tipoDuracion, setTipoDuracion] = useState(null);

  const handleTimeSelection = (time, tipo) => {
    if (!isReportCompleted) {
      setSelectedTime(time);
      setTipoDuracion(tipo);
    }
  };

  // Limpiar el estado automáticamente si el reporte está completado
  useEffect(() => {
    if (isReportCompleted) {
      resetReportState(); // Reiniciar el estado del reporte
      setSelectedPendingReport(""); // Limpiar el reporte pendiente seleccionado
    }
  }, [isReportCompleted, resetReportState]);

  // Obtener los reportes pendientes al cargar el componente y cuando cambien los reportes en el store
  useEffect(() => {
    const userReports = getReportsByCurrentUser();
    setPendingReports(userReports.filter((report) => report.status === "pendiente")); // Filtrar reportes pendientes
  }, [getReportsByCurrentUser, savedReports]); // Escuchar cambios en savedReports

  // Cargar un reporte pendiente seleccionado
  useEffect(() => {
    if (selectedPendingReport) {
      loadPendingReport(selectedPendingReport); // Cargar el reporte pendiente seleccionado
    }
  }, [selectedPendingReport, loadPendingReport]);

  // Función para obtener la entrada y sus partidas desde la BD
  const fetchEntrada = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/entrada/${id}`);
      console.log("Respuesta de la API:", response.data); // Verifica la respuesta
      setPartidas(response.data.Part); // Extrae las partidas de la respuesta
    } catch (error) {
      console.error("Error al obtener la entrada:", error);
    }
  };

  useEffect(() => {
    if (entradaId) {
      fetchEntrada(entradaId);
    }
  }, [entradaId]);

  const [isScheduling, setIsScheduling] = useState(false);

  const handleScheduleAppointment = async () => {
    if (isReportCompleted) {
      alert("Este reporte ya está completado. No se puede agendar una cita.");
      return;
    }
  
    if (partidas.length === 0) {
      alert("No hay productos agregados.");
      return;
    }
  
    if (!entradaId) {
      alert("No hay una entrada activa. Agrega al menos un producto antes de agendar.");
      return;
    }
  
    try {
      // Navegar a la pantalla de agendar cita con el entradaId existente
      navigate("/agendar-cita", { state: { selectedFolio: entradaId } });
    } catch (error) {
      console.error("Error al agendar cita:", error);
      if (error.response) {
        console.error("Detalles del error:", error.response.data); // Imprime el cuerpo del error
      }
      alert("Hubo un error al agendar la cita.");
    }
  };

  const handleDeletePartida = (PartEntId) => {
    setPartidas((prevPartidas) =>
      prevPartidas.filter((partida) => partida.PartEntId !== PartEntId)
    );
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };
  

  return (
    <div className="max-w-4xl mx-auto mt-5 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Registrar Entradas</h2>
      <ToastContainer />
  
      {/* Selector de reportes pendientes */}
      <EntradasPendientes />
      {/* <div className="mb-6">
        <label htmlFor="pendingReports" className="block font-semibold text-gray-700 mb-2">
          Reportes Pendientes:
        </label>
        <select
          id="pendingReports"
          value={selectedPendingReport}
          onChange={(e) => setSelectedPendingReport(e.target.value)}
          className="block w-full mt-1 p-2 border border-gray-500 rounded-md shadow-sm"
        >
          <option value="">Selecciona un reporte pendiente</option>
          {pendingReports.map((report) => (
            <option key={report.id} value={report.id}>
              {report.id} - {report.selectedTime}
            </option>
          ))}
        </select>
      </div> */}
  
      <SearchHeader
        toggleModal={toggleModal}
        entradaId={entradaId}
        setEntradaId={setEntradaId}
        fetchEntrada={fetchEntrada} 
      />
  
      {partidas.length === 0 ? ( // Cambia el condicional a partidas.length
        <p className="text-center text-gray-500">No hay entradas registradas.</p>
      ) : (
        <>
          <EntriesTable
            partidas={partidas} // Pasar las partidas
            entradaId={entradaId} // Pasar el EntradaId
            onDelete={handleDeletePartida}
          />
  
          <div className="mt-4 py-4">
            <label className="block font-semibold text-gray-700 mb-2">
              Selecciona el tipo de vehículo y duración:
            </label>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleTimeSelection("30 min", "A")}
                disabled={isReportCompleted}
                className={`p-4 rounded-lg ${
                  selectedTime === "30 min" && !isReportCompleted
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-blue-500"
                } ${isReportCompleted ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <FaTruckLoading size={40} />
                <span>Diablito - 30 min</span>
              </button>
              <button
                type="button"
                onClick={() => handleTimeSelection("1 hora", "B")}
                disabled={isReportCompleted}
                className={`p-4 rounded-lg ${
                  selectedTime === "1 hora" && !isReportCompleted
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-blue-500"
                } ${isReportCompleted ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <CiDeliveryTruck size={40} />
                <span>Camión - 1 hora</span>
              </button>
              <button
                type="button"
                onClick={() => handleTimeSelection("2 horas", "C")}
                disabled={isReportCompleted}
                className={`p-4 rounded-lg ${
                  selectedTime === "2 horas" && !isReportCompleted
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-blue-500"
                } ${isReportCompleted ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <PiTruckTrailer size={40} />
                <span>Trailer - 2 horas</span>
              </button>
            </div>
          </div>
  
          <div className="mt-6 text-center">
            <button
              onClick={handleScheduleAppointment}
              disabled={!selectedTime || isReportCompleted || !entradaId} // Deshabilitar si no hay entradaId
              className={`flex items-center justify-center font-semibold uppercase py-2 px-4 rounded-lg shadow-lg mx-auto transition-all
                ${
                  selectedTime && !isReportCompleted && entradaId
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
            >
              <FaCalendarAlt className="mr-2" /> Terminar y Agendar Cita
            </button>
  
            {!selectedTime && (
              <ErrorMessage>Debes seleccionar un tipo de vehículo y duración.</ErrorMessage>
            )}
            {isReportCompleted && (
              <ErrorMessage>Este reporte ya está completado. No se puede agendar una cita.</ErrorMessage>
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