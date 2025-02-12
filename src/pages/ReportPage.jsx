import { useState } from 'react';
import useStore from '../store/store';

const ReportPage = () => {
    const { savedReports, currentUser, appointments } = useStore();
    const [filter, setFilter] = useState('all'); // Estado para el filtro de estado
    const [searchTerm, setSearchTerm] = useState(''); // Estado para la búsqueda
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' }); // Estado para la ordenación

    // Filtrar los reportes del usuario actual
    const userReports = savedReports.filter(report => report.createdBy?.id === currentUser?.id);

    // Función para filtrar los reportes por estado y término de búsqueda
    const filteredReports = userReports.filter(report => {
        const matchesStatus = filter === 'all' || report.status === filter;
        const matchesSearch = report.id.includes(searchTerm) || 
                             report.products.some(product => product.description.includes(searchTerm));
        return matchesStatus && matchesSearch;
    });

    // Función para ordenar los reportes
    const sortedReports = [...filteredReports].sort((a, b) => {
        if (sortConfig.key) {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
        }
        return 0;
    });

    // Función para manejar el cambio de ordenación
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Función para obtener la fecha de un reporte desde appointments
    const getReportDate = (folio) => {
        const appointment = appointments.find(app => app.folio === folio);
        if (appointment) {
            const date = new Date(`${appointment.date}T${appointment.time}`);
            return new Intl.DateTimeFormat('es-MX', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true, // Usar formato de 12 horas (AM/PM)
            }).format(date);
        }
        return "Fecha no disponible";
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Reportes de {currentUser?.name}</h2>
            <div className="mb-6 flex flex-wrap gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700">Filtrar por estado: </label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="ml-2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Todos</option>
                        <option value="pendiente">Pendientes</option>
                        <option value="completo">Completos</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700">Buscar: </label>
                    <input
                        type="text"
                        placeholder="Folio o descripción"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="ml-2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('id')}>
                                Folio {sortConfig.key === 'id' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Productos</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Cantidad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Precio Unitario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('status')}>
                                Estado {sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('date')}>
                                Fecha y Hora {sortConfig.key === 'date' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-400">
                        {sortedReports.map((report) => (
                            <tr key={report.id} className="hover:bg-gray-400 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-900">{report.id}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <ul>
                                        {report.products.map((product) => (
                                            <li key={product.id} className="mb-1">
                                                {product.description} <span className="text-gray-700">(SKU: {product.sku})</span>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <ul>
                                        {report.products.map((product) => (
                                            <li key={product.id} className="mb-1">
                                                {product.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <ul>
                                        {report.products.map((product) => (
                                            <li key={product.id} className="mb-1">
                                                ${product.price}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <ul>
                                        {report.products.map((product) => (
                                            <li key={product.id} className="mb-1">
                                                ${product.price * product.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            report.status === 'pendiente'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}
                                    >
                                        {report.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{getReportDate(report.id)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportPage;