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
        <div className="p-4 bg-gray-100 min-h-screen">
            <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Recepción de Mercancía</h2>
            <div className="bg-white p-3 shadow rounded mb-4">
                <p className="font-bold text-center text-sm">IMPORTACIONES DE ORIENTE SA DE CV</p>
                <p className="text-center text-xs">Local </p>
            </div>

            <div className="mb-4">
                <label htmlFor="searchFolio" className="block font-semibold text-sm">Buscar por folio:</label>
                <input
                    id="searchFolio"
                    type="text"
                    placeholder="Ejemplo: 46"
                    className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={searchFolio}
                    onChange={(e) => setSearchFolio(e.target.value)}
                />
            </div>

            {searchFolio && filteredEntradas.length === 0 && (
                <p className="text-center text-red-500 text-sm">No se encontraron entradas con ese folio.</p>
            )}

            {searchFolio && filteredEntradas.length > 0 && (
                <div className="space-y-2">
                    {filteredEntradas.map((entrada) => (
                        <div
                            key={entrada.EntradaId}
                            className="bg-white shadow rounded p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => handleSelectEntrada(entrada)}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm">Folio: {entrada.EntradaId}</span>
                                <span className="text-xs text-gray-600">{entrada.LocatarioNombre}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                                Fecha: {entrada.EntradaFechaCap} | Hora: {entrada.CitaHoraInicio} - {entrada.CitaHoraFin}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedEntrada && (
                <div className="w-full bg-white shadow rounded mb-4 mt-4">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="p-2 text-sm" colSpan="4">
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
                                <th className="p-2 text-sm">Locatario</th>
                                <th className="p-2 text-sm">Fecha</th>
                                <th className="p-2 text-sm">Hora Cita</th>
                                <th className="p-2 text-sm">Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-2 text-sm">{selectedEntrada.LocatarioNombre}</td>
                                <td className="p-2 text-sm">{normalizarFechaMX(selectedEntrada.EntradaFechaCap)}</td>
                                <td className="p-2 text-sm">{selectedEntrada.CitaHoraInicio} - {selectedEntrada.CitaHoraFin}</td>
                                <td className="p-2 text-sm">{selectedEntrada.EntradaObserv}</td>
                            </tr>
                        </tbody>
                    </table>

                    {expandedEntradas[selectedEntrada.EntradaId] && (
                        <div className="p-3 bg-gray-50">
                            <h3 className="font-bold mb-2 text-sm">Partidas</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-200 text-left">
                                            <th className="p-2 text-sm">SKU</th>
                                            <th className="p-2 text-sm">Descripción</th>
                                            <th className="p-2 text-sm">Cantidad</th>
                                            <th className="p-2 text-sm">Foto</th>
                                            <th className="p-2 text-sm">Aceptado</th>
                                            <th className="p-2 text-sm">Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {partidas[selectedEntrada.EntradaId]?.map((partida) => (
                                            <tr key={partida.PartEntId} className="text-sm">
                                                <td className="p-2">{partida.PartEntSKU}</td>
                                                <td className="p-2">{partida.PartEntProdDesc}</td>
                                                <td className="p-2">{partida.PartEntCant}</td>
                                                <td className="p-2">
                                                    <img
                                                        src="/prueba1.jpeg"
                                                        alt="Foto"
                                                        className="w-10 h-10 cursor-pointer"
                                                        onClick={() => handleOpenImageModal('/prueba1.jpeg')} 
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <div className="flex flex-col items-center">
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={partida.PartEntCheck === "true"}
                                                                onChange={(e) => handleToggleCheck(partida, e.target.checked)}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-16 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-300"></div>
                                                            <span className="absolute left-1 top-1 bg-white rounded-full w-4 h-4 transition-transform duration-300 transform peer-checked:translate-x-10 shadow-md"></span>
                                                        </label>
                                                        <div className="flex justify-between w-16 mt-1 text-xs text-black">
                                                            <span>No</span>
                                                            <span>Sí</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-2">
                                                    <button
                                                        onClick={() => handleOpenModal(partida)}
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        {partida.PartEntObserv || "Agregar observaciones"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Editar Observaciones</h3>
                        <textarea
                            className="w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            rows="4"
                            value={editedObservaciones}
                            onChange={(e) => setEditedObservaciones(e.target.value)}
                            placeholder="Escribe las observaciones aquí..."
                        />
                        <div className="flex justify-end mt-4 space-x-2">
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveObservaciones}
                                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isImageModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-lg">
                        <h3 className="text-lg font-bold mb-4">Imagen</h3>
                        <img
                            src={currentImage}
                            alt="Imagen expandida"
                            className="w-full h-auto"
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={handleCloseImageModal}
                                className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 text-sm"
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