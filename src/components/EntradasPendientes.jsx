import { useState, useEffect } from "react";
import axios from "axios";

const EntradasPendientes = () => {
  const [entradasPendientes, setEntradasPendientes] = useState([]); // Estado para almacenar las entradas pendientes
  const [selectedEntradaId, setSelectedEntradaId] = useState(""); // Estado para almacenar la entrada seleccionada

  // Función para obtener las entradas pendientes
  const fetchEntradasPendientes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_SERVER}/api/entradas-pendientes`);
      setEntradasPendientes(response.data.SDTEntradas); // Almacenar las entradas pendientes en el estado
    } catch (error) {
      console.error("Error al obtener las entradas pendientes:", error);
    }
  };

  // Llamar a la función al cargar el componente
  useEffect(() => {
    fetchEntradasPendientes();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg p-6 mt-3 shadow-xl border">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Entradas Pendientes
      </h2>

      {/* Select para elegir una entrada pendiente */}
      <div className="mb-4">
        <label htmlFor="entradasPendientes" className="block text-sm font-semibold uppercase">
          Selecciona una entrada pendiente:
        </label>
        <select
          id="entradasPendientes"
          value={selectedEntradaId}
          onChange={(e) => setSelectedEntradaId(e.target.value)}
          className="block w-full mt-1 p-2 border border-gray-500 rounded-md shadow-sm"
        >
          <option value="">Selecciona una entrada pendiente</option>
          {entradasPendientes.map((entrada) => (
            <option key={entrada.EntradaId} value={entrada.EntradaId}>
              {entrada.EntradaId}
            </option>
          ))}
        </select>
      </div>

      {/* Mostrar detalles de la entrada seleccionada */}
      {selectedEntradaId && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Detalles de la Entrada Seleccionada</h3>
          <ul className="mt-2 border rounded-lg p-3 bg-gray-50">
            {entradasPendientes
              .filter((entrada) => entrada.EntradaId === selectedEntradaId)
              .map((entrada) => (
                <li key={entrada.EntradaId} className="p-2 border-b">
                  <strong>ID:</strong> {entrada.EntradaId} <br />
                  <strong>Locatario:</strong> {entrada.LocatarioNombre} <br />
                  <strong>Fecha:</strong> {entrada.EntradaFechaCap} <br />
                  <strong>Hora:</strong> {entrada.EntradaHoraCita} <br />
                  <strong>Estado:</strong> {entrada.EntradaStatus}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EntradasPendientes;