

const EntriesTable = ({ entries, removeModifiedEntryById }) => {
    return (
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
            {entries.map((entry, index) => (
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
                    onClick={() => removeModifiedEntryById(entry.id)}
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
    );
  };

export default EntriesTable