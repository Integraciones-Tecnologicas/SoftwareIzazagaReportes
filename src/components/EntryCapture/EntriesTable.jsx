import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios"; // Importar axios para hacer solicitudes HTTP

const EntriesTable = ({ partidas, entradaId, onDelete }) => {
  // Función para manejar la eliminación de una partida
  const handleDelete = async (PartEntId) => {
    try {

      // Validar que entradaId y PartEntId estén definidos
      if (!entradaId || !PartEntId) {
        alert("Error: Faltan parámetros para eliminar la partida");
        return;
      }

      // Hacer la solicitud GET al endpoint para eliminar la entrada
      const response = await axios.get(`${import.meta.env.VITE_API_SERVER}/api/eliminar-entrada`, {
        params: { Entradaid: entradaId, PartEntId }, // Pasar los parámetros en la URL
      });

      // Si la eliminación fue exitosa, llamar a la función onDelete para actualizar el estado
      if (response.status === 200) {
        onDelete(PartEntId); // Notificar al componente padre que se eliminó una partida
        alert("Partida eliminada correctamente");
      }
    } catch (error) {
      console.error("Error al eliminar la partida:", error);
      if (error.response) {
        console.error("Respuesta del error:", error.response.data); // Verificar la respuesta de error
      }
      alert("Hubo un error al eliminar la partida");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border border-gray-300">SKU</th>
            <th className="px-4 py-2 border border-gray-300">Descripción</th>
            <th className="px-4 py-2 border border-gray-300">Costo</th>
            <th className="px-4 py-2 border border-gray-300">Precio</th>
            <th className="px-4 py-2 border border-gray-300">Cantidad</th>
            <th className="px-4 py-2 border border-gray-300">Verificado</th>
            <th className="px-4 py-2 border border-gray-300">Observaciones</th>
            <th className="px-4 py-2 border border-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {partidas.map((partida) => (
            <tr key={partida.PartEntId} className="hover:bg-gray-50">
              <td className="px-4 py-2 border border-gray-300">{partida.PartEntSKU}</td>
              <td className="px-4 py-2 border border-gray-300">{partida.PartEntProdDesc}</td>
              <td className="px-4 py-2 border border-gray-300">{partida.PartEntCosto}</td>
              <td className="px-4 py-2 border border-gray-300">{partida.PartEntPrecio}</td>
              <td className="px-4 py-2 border border-gray-300">{partida.PartEntCant}</td>
              <td className="px-4 py-2 border border-gray-300">
                {partida.PartEntCheck ? "Sí" : "No"}
              </td>
              <td className="px-4 py-2 border border-gray-300">{partida.PartEntObserv}</td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                <button
                  onClick={() => handleDelete(partida.PartEntId)} // Solo se pasa PartEntId
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EntriesTable;