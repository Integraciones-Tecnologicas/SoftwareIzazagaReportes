import { useState } from 'react';
import useStore from '../store/store';

const ReportPage = () => {
    const { savedReports, currentUser, appointments, tenants, entries } = useStore();
    const [reportType, setReportType] = useState('citas'); // Estado para el tipo de reporte
    const [filter, setFilter] = useState('all'); // Estado para el filtro de estado
    const [searchTerm, setSearchTerm] = useState(''); // Estado para la búsqueda

    // Función para obtener la fecha formateada
    const getFormattedDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).format(date);
    };

    // Función para filtrar citas por periodo
    const filterAppointmentsByPeriod = (appointments) => {
        const now = new Date();
        return appointments.filter(app => new Date(`${app.date}T${app.time}`) <= now);
    };

    // Función para filtrar citas disponibles
    const filterAvailableAppointments = (appointments) => {
        const now = new Date();
        return appointments.filter(app => new Date(`${app.date}T${app.time}`) > now);
    };

    // Renderizar el reporte seleccionado
    const renderReport = () => {
        const productsToShow = entries ; // Manejo de products undefined
        const tenantsToShow = tenants || []; // Manejo de tenants undefined
        const appointmentsToShow = appointments || []; // Manejo de appointments undefined

        switch (reportType) {
            case 'productos':
                return (
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">SKU</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Precio</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-600">
                            {productsToShow.map((product) => (
                                <tr key={product.sku}>
                                    <td className="px-6 py-4 text-sm text-gray-900">{product.description}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{product.sku}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">${product.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case 'locatarios':
                return (
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-600">
                            {tenantsToShow.map((tenant) => (
                                <tr key={tenant.id}>
                                    <td className="px-6 py-4 text-sm text-gray-900">{tenant.nameTenant}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{tenant.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case 'citas':
                return (
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Hora</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Folio</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-600">
                            {appointmentsToShow.map((app) => (
                                <tr key={app.folio}>
                                    <td className="px-6 py-4 text-sm text-gray-900">{app.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{app.time}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{app.folio}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case 'citas-periodo':
                const pastAppointments = filterAppointmentsByPeriod(appointmentsToShow);
                return (
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Hora</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Folio</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-600">
                            {pastAppointments.map((app) => (
                                <tr key={app.folio}>
                                    <td className="px-6 py-4 text-sm text-gray-900">{app.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{app.time}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{app.folio}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case 'citas-disponibles':
                const availableAppointments = filterAvailableAppointments(appointmentsToShow);
                return (
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Hora</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Folio</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-600">
                            {availableAppointments.map((app) => (
                                <tr key={app.folio}>
                                    <td className="px-6 py-4 text-sm text-gray-900">{app.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{app.time}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{app.folio}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            default:
                return <p>Selecciona un tipo de reporte.</p>;
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Reportes de Admin</h2>
            <div className="mb-6">
                <label className="text-sm font-medium text-gray-700">Seleccionar tipo de reporte: </label>
                <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="ml-2 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="productos">Productos</option>
                    <option value="locatarios">Locatarios</option>
                    <option value="citas">Citas</option>
                    <option value="citas-periodo">Citas del Periodo</option>
                    <option value="citas-disponibles">Citas Disponibles</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                {renderReport()}
            </div>
        </div>
    );
};

export default ReportPage;