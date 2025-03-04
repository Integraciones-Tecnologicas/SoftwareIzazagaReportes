import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReviewEntry = () => {
    const [entradasConfirmadas, setEntradasConfirmadas] = useState([]);
    const [searchFolio, setSearchFolio] = useState("");
    const [partidas, setPartidas] = useState({});
    const [expandedEntradas, setExpandedEntradas] = useState({});
    const [selectedEntrada, setSelectedEntrada] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPartida, setCurrentPartida] = useState(null);
    const [editedObservaciones, setEditedObservaciones] = useState("");
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState("");

    useEffect(() => {
        const fetchEntradasConfirmadas = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_SERVER}/api/entradas-confirmadas`);
                setEntradasConfirmadas(response.data.SDTEntradaCitas);
            } catch (error) {
                console.error('Error fetching entradas confirmadas:', error);
            }
        };

        fetchEntradasConfirmadas();
    }, []);

    const fetchPartidas = async (entradaId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_SERVER}/api/entrada/${entradaId}`);
            const partidasFormateadas = response.data.Part.map((partida) => ({
                ...partida,
                PartEntCheck: partida.PartEntCheck?.toString() || "false", // Asegurar que sea un string
            }));
            setPartidas((prev) => ({ ...prev, [entradaId]: partidasFormateadas }));
        } catch (error) {
            console.error('Error fetching partidas:', error);
        }
    };

    const toggleExpand = (entradaId) => {
        if (!expandedEntradas[entradaId]) {
            fetchPartidas(entradaId);
        }
        setExpandedEntradas((prev) => ({ ...prev, [entradaId]: !prev[entradaId] }));
    };

    const handleSelectEntrada = (entrada) => {
        setSelectedEntrada(entrada);
        setSearchFolio("");
        toggleExpand(entrada.EntradaId);
    };

    const handleOpenModal = (partida) => {
        setCurrentPartida(partida);
        setEditedObservaciones(partida.PartEntObserv || "");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentPartida(null);
        setEditedObservaciones("");
    };

    const handleSaveObservaciones = async () => {
        try {
            // Llamar a la API para actualizar las observaciones
            const response = await axios.post(`${import.meta.env.VITE_API_SERVER}/api/actualizar-observaciones-partida`, {
                EntradaId: selectedEntrada.EntradaId,
                PartEntId: currentPartida.PartEntId,
                PartEntObserv: editedObservaciones,
            });
    
            // Actualizar el estado local de las partidas
            setPartidas((prev) => ({
                ...prev,
                [selectedEntrada.EntradaId]: prev[selectedEntrada.EntradaId].map((p) =>
                    p.PartEntId === currentPartida.PartEntId
                        ? { ...p, PartEntObserv: editedObservaciones }
                        : p
                ),
            }));
    
            // Cerrar el modal y mostrar notificación de éxito
            handleCloseModal();
            toast.success("Observaciones actualizadas correctamente.");
        } catch (error) {
            console.error("Error al actualizar las observaciones:", error);
            toast.error("Hubo un error al actualizar las observaciones.");
        }
    };

    const handleToggleCheck = async (partida, isChecked) => {
        try {
            // Llamar a la API para actualizar el check
            const response = await axios.post(`${import.meta.env.VITE_API_SERVER}/api/actualizar-check-partida`, {
                EntradaId: selectedEntrada.EntradaId,
                PartEntId: partida.PartEntId,
                partEntCheck: isChecked ? "true" : "false",
            });
    
            // Actualizar el estado local de las partidas
            setPartidas((prev) => ({
                ...prev,
                [selectedEntrada.EntradaId]: prev[selectedEntrada.EntradaId].map((p) =>
                    p.PartEntId === partida.PartEntId
                        ? { ...p, PartEntCheck: isChecked ? "true" : "false" }
                        : p
                ),
            }));
    
            // Mostrar notificación de éxito
            toast.success(`Partida ${isChecked ? "aceptada" : "rechazada"} correctamente.`);
        } catch (error) {
            console.error("Error al actualizar PartEntCheck:", error);
            toast.error("Hubo un error al actualizar el estado de la partida.");
        }
    };

    const handleOpenImageModal = (imageUrl) => {
        setCurrentImage(imageUrl);
        setIsImageModalOpen(true);
    };

    const handleCloseImageModal = () => {
        setIsImageModalOpen(false);
        setCurrentImage("");
    };

    const filteredEntradas = entradasConfirmadas.filter(entrada =>
        searchFolio ? entrada.EntradaId.includes(searchFolio) : false
    );

    const normalizarFechaMX = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Recepción de Mercancía</h2>
            <div className="bg-white p-4 shadow rounded mb-4">
                <p className="font-bold text-center">IMPORTACIONES DE ORIENTE SA DE CV</p>
                <p className="text-center text-sm">Local </p>
            </div>

            <div className="mb-4">
                <label htmlFor="searchFolio" className="block font-semibold">Buscar por folio:</label>
                <input
                    id="searchFolio"
                    type="text"
                    placeholder="Ejemplo: 46"
                    className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchFolio}
                    onChange={(e) => setSearchFolio(e.target.value)}
                />
            </div>

            {searchFolio && filteredEntradas.length > 0 && (
                <div className="space-y-4">
                    {filteredEntradas.map((entrada) => (
                        <div
                            key={entrada.EntradaId}
                            className="bg-white shadow rounded p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => handleSelectEntrada(entrada)}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-bold">Folio: {entrada.EntradaId}</span>
                                <span className="text-sm text-gray-600">{entrada.LocatarioNombre}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                                Fecha: {entrada.EntradaFechaCap} | Hora: {entrada.CitaHoraInicio} - {entrada.CitaHoraFin}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedEntrada && (
                <div className="w-full bg-white shadow rounded mb-6 mt-6">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="p-2" colSpan="4">
                                    <div className="flex justify-between items-center">
                                        <span>Folio: {selectedEntrada.EntradaId}</span>
                                        <button
                                            onClick={() => toggleExpand(selectedEntrada.EntradaId)}
                                            className="p-1 hover:bg-gray-300 rounded"
                                        >
                                            <FontAwesomeIcon
                                                icon={expandedEntradas[selectedEntrada.EntradaId] ? faChevronUp : faChevronDown}
                                                className="text-gray-600"
                                            />
                                        </button>
                                    </div>
                                </th>
                            </tr>
                            <tr className="bg-gray-200 text-left">
                                <th className="p-2">Locatario</th>
                                <th className="p-2">Fecha</th>
                                <th className="p-2">Hora Cita</th>
                                <th className="p-2">Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-2">{selectedEntrada.LocatarioNombre}</td>
                                <td className="p-2">{normalizarFechaMX(selectedEntrada.EntradaFechaCap)}</td>
                                <td className="p-2">{selectedEntrada.CitaHoraInicio} - {selectedEntrada.CitaHoraFin}</td>
                                <td className="p-2">{selectedEntrada.EntradaObserv}</td>
                            </tr>
                        </tbody>
                    </table>

                    {expandedEntradas[selectedEntrada.EntradaId] && (
                        <div className="p-4 bg-gray-50">
                            <h3 className="font-bold mb-2">Partidas</h3>
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-200 text-left">
                                        <th className="p-2">SKU</th>
                                        <th className="p-2">Descripción</th>
                                        <th className="p-2">Cantidad por Caja</th>
                                        <th className="p-2">Foto</th>
                                        <th className="p-2">Aceptado</th>
                                        <th className="p-2">Observaciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {partidas[selectedEntrada.EntradaId]?.map((partida) => (
                                        <tr key={partida.PartEntId}>
                                            <td className="p-2">{partida.PartEntSKU}</td>
                                            <td className="p-2">{partida.PartEntProdDesc}</td>
                                            <td className="p-2">{partida.PartEntCant}</td>
                                            <td className="p-2">
                                                <img
                                                    src="/prueba.jpg"
                                                    alt="Foto"
                                                    className="w-12 h-12 cursor-pointer"
                                                    onClick={() => handleOpenImageModal('/prueba.jpg')} 
                                                />
                                            </td>
                                            <td className="p-2 flex space-x-2">
                                                <div className="flex flex-col items-center">
                                                    <label className="relative inAline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={partida.PartEntCheck === "true"}
                                                            onChange={(e) => handleToggleCheck(partida, e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-20 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-500 peer-checked:bg-green-600 transition-colors duration-300"></div>
                                                        <span className="absolute left-1 top-1 bg-white rounded-full w-6 h-6 transition-transform duration-300 transform peer-checked:translate-x-12 shadow-md"></span>
                                                    </label>
                                                    <div className="flex justify-between w-20 mt-2 text-sm text-black">
                                                        <span>No</span>
                                                        <span>Sí</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-2">
                                                <button
                                                    onClick={() => handleOpenModal(partida)}
                                                    className="text-blue-600 hover:text-blue-800 "
                                                >
                                                    {partida.PartEntObserv || "Agregar observaciones"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {searchFolio && filteredEntradas.length === 0 && (
                <p className="text-center text-red-500">No se encontraron entradas con ese folio.</p>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Editar Observaciones</h3>
                        <textarea
                            className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            value={editedObservaciones}
                            onChange={(e) => setEditedObservaciones(e.target.value)}
                            placeholder="Escribe las observaciones aquí..."
                        />
                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveObservaciones}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Editar Observaciones</h3>
                        <textarea
                            className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            value={editedObservaciones}
                            onChange={(e) => setEditedObservaciones(e.target.value)}
                            placeholder="Escribe las observaciones aquí..."
                        />
                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveObservaciones}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isImageModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
                        <h3 className="text-lg font-bold mb-4">Imagen</h3>
                        <img
                            src={currentImage}
                            alt="Imagen expandida"
                            className="w-full h-auto"
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleCloseImageModal}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ReviewEntry;

