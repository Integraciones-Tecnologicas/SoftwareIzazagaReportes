import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewEntry = () => {
    const [entradasConfirmadas, setEntradasConfirmadas] = useState([]);
    const [searchFolio, setSearchFolio] = useState("");
    const [partidas, setPartidas] = useState({});
    const [expandedEntradas, setExpandedEntradas] = useState({});
    const [selectedEntrada, setSelectedEntrada] = useState(null); // Estado para la entrada seleccionada

    useEffect(() => {
        const fetchEntradasConfirmadas = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_SERVER}/api/entradas-confirmadas`);
                setEntradasConfirmadas(response.data.SDTEntradas);
            } catch (error) {
                console.error('Error fetching entradas confirmadas:', error);
            }
        };

        fetchEntradasConfirmadas();
    }, []);

    const fetchPartidas = async (entradaId) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_SERVER}/api/entrada/${entradaId}`);
            setPartidas((prev) => ({ ...prev, [entradaId]: response.data.Part }));
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
        toggleExpand(entrada.EntradaId); // Expandir automáticamente al seleccionar
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

            {/* Buscador */}
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

            {/* Lista de entradas filtradas */}
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
                                Fecha: {entrada.EntradaFechaCap} | Hora: {entrada.EntradaHoraCita}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Mostrar detalles de la entrada seleccionada */}
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
                                <td className="p-2">{selectedEntrada.EntradaHoraCita}</td>
                                <td className="p-2">{selectedEntrada.EntradaObserv}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Mostrar partidas si la entrada está expandida */}
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {partidas[selectedEntrada.EntradaId]?.map((partida) => (
                                        <tr key={partida.PartEntId}>
                                            <td className="p-2">{partida.PartEntSKU}</td>
                                            <td className="p-2">{partida.PartEntProdDesc}</td>
                                            <td className="p-2">{partida.PartEntCant}</td>
                                            <td className="p-2">(Foto aquí)</td>
                                            <td className="p-2 flex space-x-2">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" />
                                                    <div className="peer outline-none duration-100 after:duration-500 w-28 h-14 bg-blue-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500 after:content-['No'] after:absolute after:outline-none after:h-12 after:w-12 after:bg-white after:top-1 after:left-1 after:flex after:justify-center after:items-center after:text-sky-800 after:font-bold peer-checked:after:translate-x-14 peer-checked:after:content-['Sí'] peer-checked:after:border-white"></div>
                                                </label>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Mensaje si no hay entradas */}
            {searchFolio && filteredEntradas.length === 0 && (
                <p className="text-center text-red-500">No se encontraron entradas con ese folio.</p>
            )}
        </div>
    );
};

export default ReviewEntry;