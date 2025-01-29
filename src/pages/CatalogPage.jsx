import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useStore from "../store/store";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import RegisterProduct from "../components/EntryCapture/RegisterProduct";

const CatalogPage = () => {
    const entries = useStore((state) => state.entries); // Obtener las entradas del estado global
    const [isModalOpen, setModalOpen] = useState(false); // Estado para controlar la ventana modal
    
    const toggleModal = () => {
        setModalOpen(!isModalOpen);
      };
      

    return (
    <>
        <div className="max-w-4xl mx-auto mt-5 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Productos Registrados</h2>

            <div className="md:col-span-2 py-2">
                <button onClick={toggleModal} className="text-blue-600 hover:text-blue-800">
                    <FontAwesomeIcon icon={faFile} size="3x" />
                </button>
            </div>

            {entries.length === 0 ? (
                <p className="text-center text-gray-500">No hay productos registrados.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 border">Descripción</th>
                            <th className="px-4 py-2 border">SKU</th>
                            <th className="px-4 py-2 border">Costo</th>
                            <th className="px-4 py-2 border">Precio</th>
                            <th className="px-4 py-2 border">Línea</th>
                            <th className="px-4 py-2 border">Subfamilia</th>
                            <th className="px-4 py-2 border">Piratería</th>
                            <th className="px-4 py-2 border">Imagen</th>
                            <th className="px-4 py-2 border">Observaciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {entries.map((entry, index) => (
                            <tr key={index} className="odd:bg-white even:bg-gray-100">
                                <td className="px-4 py-2 border">{entry.description}</td>
                                <td className="px-4 py-2 border">{entry.sku || "N/A"}</td>
                                <td className="px-4 py-2 border">{entry.cost}</td>
                                <td className="px-4 py-2 border">{entry.price}</td>
                                <td className="px-4 py-2 border">{entry.line}</td>
                                <td className="px-4 py-2 border">{entry.subfamily}</td>
                                <td className="px-4 py-2 border">{entry.piracy ? "Sí" : "No"}</td>
                                <td className="px-4 py-2 border">{entry.images}</td>
                                <td className="px-4 py-2 border">{entry.observations || "N/A"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
      </div>

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
      
    </>
  )
}

export default CatalogPage