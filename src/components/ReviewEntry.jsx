import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewEntry = () => {
    const [entradasPendientes, setEntradasPendientes] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [searchFolio, setSearchFolio] = useState("");
    const [partidas, setPartidas] = useState({}); // Almacena las partidas por EntradaId
    const [expandedEntradas, setExpandedEntradas] = useState({}); // Controla qué entradas están expandidas

    // Llamada a la API para obtener las entradas pendientes
    useEffect(() => {
        const fetchEntradasPendientes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/entradas-pendientes');
                setEntradasPendientes(response.data.SDTEntradas);
            } catch (error) {
                console.error('Error fetching entradas pendientes:', error);
            }
        };

        fetchEntradasPendientes();
    }, []);

    // Llamada a la API para obtener las partidas de una entrada específica
    const fetchPartidas = async (entradaId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/entrada/${entradaId}`);
            setPartidas((prev) => ({ ...prev, [entradaId]: response.data.Part }));
        } catch (error) {
            console.error('Error fetching partidas:', error);
        }
    };

    // Manejar la expansión de una entrada
    const toggleExpand = (entradaId) => {
        if (!expandedEntradas[entradaId]) {
            fetchPartidas(entradaId); // Obtener partidas si no están cargadas
        }
        setExpandedEntradas((prev) => ({ ...prev, [entradaId]: !prev[entradaId] }));
    };

    // Simulación de actualización en la base de datos
    const handleCheck = (entradaId) => {
        setCheckedItems((prev) => ({ ...prev, [entradaId]: !prev[entradaId] }));
        console.log(`Entrada con ID ${entradaId} marcada como revisada (cambiar 0 a 1 en la BD).`);
    };

    const handleObservation = (entradaId) => {
        const observation = prompt("Ingrese su observación:");
        if (observation) {
            console.log(`Observación para la entrada ${entradaId}: ${observation}`);
        }
    };

    // Filtrar entradas pendientes por folio si es necesario
    const filteredEntradas = entradasPendientes.filter(entrada => 
        searchFolio ? entrada.EntradaId.includes(searchFolio) : true
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-lg font-bold mb-4">REVISIÓN DE INGRESO DE MERCANCÍA</h2>
            <div className="bg-white p-4 shadow rounded mb-4">
                <p className="font-bold text-center">IMPORTACIONES DE ORIENTE SA DE CV</p>
                <p className="text-center text-sm">Local </p>
            </div>

            {/* Input de búsqueda por folio */}
            <div className="mb-4">
                <label htmlFor="searchFolio" className="block font-semibold">Buscar por folio:</label>
                <input
                    id="searchFolio"
                    type="text"
                    placeholder="Ejemplo: 46"
                    className="w-full p-2 border border-gray-400 rounded-md"
                    value={searchFolio}
                    onChange={(e) => setSearchFolio(e.target.value)}
                />
            </div>

            {filteredEntradas.length > 0 ? (
                filteredEntradas.map((entrada) => (
                    <div key={entrada.EntradaId} className="w-full bg-white shadow rounded mb-6">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-200 text-left">
                                    <th className="p-2" colSpan="5">
                                        <div className="flex justify-between items-center">
                                            <span>Folio: {entrada.EntradaId}</span>
                                            <button 
                                                onClick={() => toggleExpand(entrada.EntradaId)}
                                                className="p-1"
                                            >
                                                <FontAwesomeIcon 
                                                    icon={expandedEntradas[entrada.EntradaId] ? faChevronUp : faChevronDown} 
                                                    className="text-gray-600"
                                                />
                                            </button>
                                        </div>
                                    </th>
                                </tr>
                                <tr className="bg-gray-200 text-left">
                                    <th className="p-2">Locatario</th>
                                    <th className="p-2">Fecha</th>
                                    <th className="p-2">Hora</th>
                                    <th className="p-2">Observaciones</th>
                                    <th className="p-2">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-2">{entrada.LocatarioNombre}</td>
                                    <td className="p-2">{entrada.EntradaFechaCap}</td>
                                    <td className="p-2">{entrada.EntradaHoraCita}</td>
                                    <td className="p-2">{entrada.EntradaObserv}</td>
                                    <td className="p-2 flex items-center space-x-2">
                                        <label className="flex items-center space-x-1">
                                            <input 
                                                type="checkbox" 
                                                checked={checkedItems[entrada.EntradaId] || false} 
                                                onChange={() => handleCheck(entrada.EntradaId)}
                                            />
                                            <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                                        </label>
                                        
                                        <button 
                                            className="bg-blue-500 text-white p-1 rounded"
                                            onClick={() => handleObservation(entrada.EntradaId)}
                                        >
                                            Observ.
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Mostrar partidas si la entrada está expandida */}
                        {expandedEntradas[entrada.EntradaId] && (
                            <div className="p-4 bg-gray-50">
                                <h3 className="font-bold mb-2">Partidas</h3>
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-200 text-left">
                                            <th className="p-2">SKU</th>
                                            <th className="p-2">Descripción</th>
                                            <th className="p-2">Cantidad</th>
                                            <th className="p-2">Costo</th>
                                            <th className="p-2">Precio</th>
                                            <th className="p-2">Revisado</th>
                                            <th className="p-2">Observaciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {partidas[entrada.EntradaId]?.map((partida) => (
                                            <tr key={partida.PartEntId}>
                                                <td className="p-2">{partida.PartEntSKU}</td>
                                                <td className="p-2">{partida.PartEntProdDesc}</td>
                                                <td className="p-2">{partida.PartEntCant}</td>
                                                <td className="p-2">${partida.PartEntCosto}</td>
                                                <td className="p-2">${partida.PartEntPrecio}</td>
                                                <td className="p-2">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={partida.PartEntCheck || false} 
                                                        readOnly
                                                    />
                                                </td>
                                                <td className="p-2">{partida.PartEntObserv}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-center text-red-500">No hay entradas pendientes disponibles.</p>
            )}
        </div>
    );
};

export default ReviewEntry;