import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import useStore from '../store/store'; // Importar el hook para acceder al store

const ReviewEntry = () => {
    const savedReports = useStore((state) => state.savedReports);
    const [checkedItems, setCheckedItems] = useState({});
    const [searchFolio, setSearchFolio] = useState(""); // Estado para buscar por folio

    // Simulación de actualización en la base de datos
    const handleCheck = (productId) => {
        setCheckedItems((prev) => ({ ...prev, [productId]: !prev[productId] }));
        console.log(`Producto con ID ${productId} marcado como revisado (cambiar 0 a 1 en la BD).`);
    };

    const handleObservation = (productId) => {
        const observation = prompt("Ingrese su observación:");
        if (observation) {
            console.log(`Observación para el producto ${productId}: ${observation}`);
        }
    };

    // Filtrar reportes COMPLETOS y aplicar búsqueda por folio si es necesario
    const filteredReports = savedReports
        .filter(report => report.status === "completo") // Solo reportes completos
        .filter(report => searchFolio ? report.id.includes(searchFolio) : true); // Filtrado por folio si se ingresa uno

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
                    placeholder="Ejemplo: REP-10000273"
                    className="w-full p-2 border border-gray-400 rounded-md"
                    value={searchFolio}
                    onChange={(e) => setSearchFolio(e.target.value)}
                />
            </div>

            {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                    <table key={report.id} className="w-full bg-white shadow rounded mb-6">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="p-2" colSpan="5">Folio: {report.id}</th>
                            </tr>
                            <tr className="bg-gray-200 text-left">
                                <th className="p-2">Código</th>
                                <th className="p-2">Descripción</th>
                                <th className="p-2">Cantidad</th>
                                <th className="p-2">Precio</th>
                                <th className="p-2">Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.products.map((product) => (
                                <tr key={product.id}>
                                    <td className="p-2">{product.sku}</td>
                                    <td className="p-2">{product.description}</td>
                                    <td className="p-2">{product.quantity}</td>
                                    <td className="p-2">${(product.price * product.quantity).toFixed(2)}</td>
                                    <td className="p-2 flex items-center space-x-2">
                                        <label className="flex items-center space-x-1">
                                            <input 
                                                type="checkbox" 
                                                checked={checkedItems[product.id] || false} 
                                                onChange={() => handleCheck(product.id)}
                                            />
                                            <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                                        </label>
                                        
                                        <button 
                                            className="bg-blue-500 text-white p-1 rounded"
                                            onClick={() => handleObservation(product.id)}
                                        >
                                            Observ.
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ))
            ) : (
                <p className="text-center text-red-500">No hay reportes completos disponibles.</p>
            )}
        </div>
    );
};

export default ReviewEntry;
