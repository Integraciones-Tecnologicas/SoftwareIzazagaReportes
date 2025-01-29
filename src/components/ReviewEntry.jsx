import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import useStore from '../store/store'; // Importar el hook para acceder al store

const ReviewEntry = () => {
    const savedReports = useStore((state) => state.savedReports);
    const latestReport = savedReports.length > 0 ? savedReports[savedReports.length - 1] : null;

    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-lg font-bold mb-4">REVISIÓN DE INGRESO DE MERCANCÍA</h2>

        <div className="bg-white p-4 shadow rounded mb-4">
          <p className="font-bold text-center">IMPORTACIONES DE ORIENTE SA DE CV</p>
          <p className="text-center text-sm">Local - 245</p>
          <p className="text-center text-sm mt-2">Fecha: {latestReport ? new Date(latestReport.createdAt).toLocaleString() : 'Fecha no definida'}</p>
        </div>

        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Código</th>
              <th className="p-2">Descripción</th>
              <th className="p-2">Cantidad Total</th>
              <th className="p-2">Precio Total</th>
              <th className="p-2">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {savedReports.length > 0 ? (
              savedReports.map((report) => {
                // Obtener descripciones únicas de productos
                const uniqueDescriptions = [...new Set(report.products.map(p => p.description))].join(", ");

                // Calcular total de cantidades y precios
                const totalQuantity = report.products.reduce((sum, p) => +(sum + p.quantity), 0);
                const totalPrice = report.products.reduce((sum, p) => sum + p.price * p.quantity, 0);

                return (
                  <tr key={report.id}>
                    <td className="p-2">{report.id}</td>
                    <td className="p-2">{uniqueDescriptions}</td>
                    <td className="p-2">{totalQuantity}</td>
                    <td className="p-2">${totalPrice.toFixed(2)}</td>
                    <td className="p-2 flex items-center space-x-2">
                      <button className="bg-gray-200 border border-gray-400 p-1 rounded">
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button className="bg-gray-200 border border-gray-400 p-1 rounded">
                        Observ.
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="p-2 text-center">No hay entradas modificadas.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-6 flex justify-center">
          <button className="bg-indigo-600 uppercase font-semibold text-white py-2 px-6 rounded hover:bg-indigo-700">
            Confirmar
          </button>
        </div>
      </div>
    );
};

export default ReviewEntry;
