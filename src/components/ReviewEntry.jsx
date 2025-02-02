import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import useStore from '../store/store'; // Importar el hook para acceder al store

const ReviewEntry = () => {
    const getReportsByCurrentUser = useStore((state) => state.getReportsByCurrentUser);
    const savedReports = getReportsByCurrentUser(); // Solo reportes del usuario actual
    const [checkedItems, setCheckedItems] = useState({});

    // Simulación de actualización en la base de datos
    const handleCheck = (productId) => {
        setCheckedItems((prev) => ({ ...prev, [productId]: !prev[productId] }));
        console.log(`Producto con ID ${productId} marcado como revisado (cambiar 0 a 1 en la BD).`);
        // Aquí iría la lógica para actualizar la base de datos.
    };

    const handleObservation = (productId) => {
        const observation = prompt("Ingrese su observación:");
        if (observation) {
            console.log(`Observación para el producto ${productId}: ${observation}`);
            // Aquí iría la lógica para guardar la observación en la base de datos.
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-lg font-bold mb-4">REVISIÓN DE INGRESO DE MERCANCÍA</h2>
            <div className="bg-white p-4 shadow rounded mb-4">
                <p className="font-bold text-center">IMPORTACIONES DE ORIENTE SA DE CV</p>
                <p className="text-center text-sm">Local - 245</p>
            </div>

            <table className="w-full bg-white shadow rounded">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-2">Código</th>
                        <th className="p-2">Descripción</th>
                        <th className="p-2">Cantidad</th>
                        <th className="p-2">Precio</th>
                        <th className="p-2">Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {savedReports.length > 0 ? (
                        savedReports.map((report) => (
                            report.products.map((product) => (
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
                            ))
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="p-2 text-center">No hay entradas modificadas.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ReviewEntry;