import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const EntriesTable = ({ partidas }) => {
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
                  onClick={() => console.log("Eliminar partida:", partida.PartEntId)}
                  className="text-red-600 hover:text-red-800"
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