import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useStore from "../store/store";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { useState, useMemo, useEffect } from "react"; // Importa useEffect
import RegisterProduct from "../components/EntryCapture/RegisterProduct";

const CatalogPage = () => {
    const { entries, getEntriesByCurrentUser } = useStore(); // Obtén el estado y la función del store
    const [isModalOpen, setModalOpen] = useState(false);
    const [userEntries, setUserEntries] = useState([]); // Estado para almacenar las entradas del usuario actual

    // Usa useEffect para obtener las entradas del usuario actual
    useEffect(() => {
        const userEntries = getEntriesByCurrentUser();
        setUserEntries(userEntries);
    }, [getEntriesByCurrentUser, entries]); // Dependencias: getEntriesByCurrentUser y entries

    // Usa useMemo para evitar recalcular en cada renderizado
    const hasEntries = useMemo(() => userEntries.length > 0, [userEntries]);

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

                {!hasEntries ? (
                    <p className="text-center text-gray-500">No hay productos registrados.</p>
                ) : (
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="min-w-full bg-white shadow-lg table-auto border-collapse">
                            <thead className="bg-gray-200 text-gray-600 tracking-wider">
                                <tr>
                                    <th className="px-4 py-3 border-b">Descripción</th>
                                    <th className="px-4 py-3 border-b">SKU</th>
                                    <th className="px-4 py-3 border-b">Costo</th>
                                    <th className="px-4 py-3 border-b">Precio</th>
                                    <th className="px-4 py-3 border-b">Línea</th>
                                    <th className="px-4 py-3 border-b">Subfamilia</th>
                                    <th className="px-4 py-3 border-b">Piratería</th>
                                    <th className="px-4 py-3 border-b">Imagen</th>
                                    <th className="px-4 py-3 border-b">Observaciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userEntries.map((entry, index) => (
                                    <tr key={index} className="odd:bg-white even:bg-gray-100">
                                        <td className="px-4 py-3 border-b">{entry.description}</td>
                                        <td className="px-4 py-3 border-b text-center">{entry.sku || "N/A"}</td>
                                        <td className="px-4 py-3 border-b text-center">{entry.cost}</td>
                                        <td className="px-4 py-3 border-b text-center">{entry.price}</td>
                                        <td className="px-4 py-3 border-b">{entry.line}</td>
                                        <td className="px-4 py-3 border-b">{entry.subfamily}</td>
                                        <td className="px-4 py-3 border-b">{entry.piracy ? "Sí" : "No"}</td>
                                        <td className="px-4 py-3 border-b">{entry.images}</td>
                                        <td className="px-4 py-3 border-b">{entry.observations || "N/A"}</td>
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
        </>
    );
};

export default CatalogPage;