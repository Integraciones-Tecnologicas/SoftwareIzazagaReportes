import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHome, faCheck } from '@fortawesome/free-solid-svg-icons';

const ReviewEntry = () => {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-lg font-bold mb-4">REVISIÓN DE INGRESO DE MERCANCÍA</h2>
  
        <div className="flex justify-between items-center mb-6">
          <div>
            <label htmlFor="documentNumber" className="block font-medium">Num Documento</label>
            <input
              id="documentNumber"
              type="text"
              className="border border-gray-300 p-2 w-full max-w-xs"
            />
          </div>
          <div className="flex space-x-4">
            <button className="p-2 bg-gray-200 border border-gray-400 rounded">
              <FontAwesomeIcon icon={faSearch} />
            </button>
            <button className="p-2 bg-gray-200 border border-gray-400 rounded">
              <FontAwesomeIcon icon={faHome} />
            </button>
          </div>
        </div>
  
        <div className="bg-white p-4 shadow rounded mb-4">
          <p className="font-bold text-center">IMPORTACIONES DE ORIENTE SA DE CV</p>
          <p className="text-center text-sm">Local - 245</p>
          <p className="text-center text-sm mt-2">25/05/2025 13:25</p>
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
            <tr>
              <td className="p-2">123456</td>
              <td className="p-2">ARTÍCULO ORNAMENTAL</td>
              <td className="p-2">200</td>
              <td className="p-2">$25.00</td>
              <td className="p-2 flex items-center space-x-2">
                <button className="bg-gray-200 border border-gray-400 p-1 rounded">
                  <FontAwesomeIcon icon={faCheck} />
                </button>
                <button className="bg-gray-200 border border-gray-400 p-1 rounded">
                  Observ.
                </button>
              </td>
            </tr>
            <tr>
              <td className="p-2">123458</td>
              <td className="p-2">ARTÍCULO ORNAMENTAL</td>
              <td className="p-2">150</td>
              <td className="p-2">$26.00</td>
              <td className="p-2 flex items-center space-x-2">
                <button className="bg-gray-200 border border-gray-400 p-1 rounded">
                  <FontAwesomeIcon icon={faCheck} />
                </button>
                <button className="bg-gray-200 border border-gray-400 p-1 rounded">
                  Observ.
                </button>
              </td>
            </tr>
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
  