import { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../store/store';

const ReportPage = () => {
    const [reportType, setReportType] = useState('citas'); // Estado para el tipo de reporte
    const [filter, setFilter] = useState('all'); // Estado para el filtro de estado
    const [searchTerm, setSearchTerm] = useState(''); // Estado para la búsqueda

    const [locatarios, setLocatarios] = useState([]);
    const [productos, setProductos] = useState([]);
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUser = useStore((state) => state.currentUser); // Obtén el usuario actual del store
    const locatarioId = currentUser?.locatarioId; // Obtén el LocatarioId del usuario actual

    // Función para obtener locatarios
    const fetchLocatarios = async () => {
        const locatariosData = [];
        let id = 1; // Empezar desde el ID 1
        const maxAttempts = 7; // Límite máximo de IDs a verificar
        let attempts = 0;

        try {
            while (attempts < maxAttempts) {
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_API_SERVER}/api/locatario/${id}`
                    );
                    locatariosData.push(response.data); // Agregar el locatario al array
                    id++; // Incrementar el ID para la siguiente solicitud
                } catch (error) {
                    // Si el servidor devuelve un 404, significa que no hay más locatarios
                    if (error.response && error.response.status === 404) {
                        break;
                    } else if (locatariosData.LocatarioId == '0') {
                        break;
                    } else {
                        throw error; // Lanzar otros errores
                    }
                }
                attempts++;
            }

            setLocatarios(locatariosData); // Actualizar el estado con los locatarios obtenidos
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener productos
    const fetchProductos = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_SERVER}/productos`, {
                params: { LocatarioId: locatarioId },
            });
            // Acceder a response.data.SDTProds para obtener la lista de productos
            setProductos(response.data.SDTProds || []);
        } catch (error) {
            setError(error.message);
        }
    };

    // Función para obtener citas
    const fetchCitas = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_SERVER}/api/entradas-confirmadas`);
            setCitas(response.data.SDTEntradaCitas || []);
        } catch (error) {
            setError(error.message);
        }
    };

    // Cargar datos según el tipo de reporte
    useEffect(() => {
        setLoading(true);
        setError(null);

        switch (reportType) {
            case 'productos':
                fetchProductos().finally(() => setLoading(false));
                break;
            case 'locatarios':
                if (currentUser?.locatarioId === 0) {
                    fetchLocatarios().finally(() => setLoading(false));
                } else {
                    setError("No tienes permisos para ver esta opción.");
                    setLoading(false);
                }
                break;
            case 'citas':
            case 'citas-periodo':
            case 'citas-disponibles':
                fetchCitas().finally(() => setLoading(false));
                break;
            default:
                setLoading(false);
                break;
        }
    }, [reportType]);

    if (loading) return <p className="text-center text-gray-600">Cargando...</p>;
    if (error) return <p className="text-center text-red-600">Error: {error}</p>;

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
        return appointments.filter(app => new Date(`${app.EntradaFechaCap}T${app.CitaHoraInicio}`) <= now);
    };

    // Función para filtrar citas disponibles
    const filterAvailableAppointments = (appointments) => {
        const now = new Date();
        return appointments.filter(app => new Date(`${app.EntradaFechaCap}T${app.CitaHoraInicio}`) > now);
    };

    // Renderizar el reporte seleccionado
    const renderReport = () => {
        switch (reportType) {
            case 'productos':
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nombre</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">SKU</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Precio</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-600">
                                {productos.map((producto) => (
                                    <tr key={producto.ProdId}>
                                        <td className="px-4 py-2 text-sm text-gray-900">{producto.ProdsDescrip}</td>
                                        <td className="px-4 py-2 text-sm text-gray-900">{producto.ProdsSKU}</td>
                                        <td className="px-4 py-2 text-sm text-gray-900">${producto.ProdsPrecio1}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'locatarios':
                if (currentUser?.locatarioId !== 0) {
                    return <p className="text-center text-red-600">No tienes permisos para ver esta opción.</p>;
                }
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nombre</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-600">
                                {locatarios.map((locatario) => (
                                    <tr key={locatario.LocatarioId}>
                                        <td className="px-4 py-2 text-sm text-gray-900">{locatario.LocatarioNombre}</td>
                                        <td className="px-4 py-2 text-sm text-gray-900">{locatario.LocatarioEmail}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'citas':
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fecha</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Hora</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Folio</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-600">
                                {citas.map((cita) => (
                                    <tr key={cita.EntradaId}>
                                        <td className="px-4 py-2 text-sm text-gray-900">{cita.EntradaFechaCap}</td>
                                        <td className="px-4 py-2 text-sm text-gray-900">{cita.CitaHoraInicio}</td>
                                        <td className="px-4 py-2 text-sm text-gray-900">{cita.EntradaId}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'citas-periodo':
                const pastAppointments = filterAppointmentsByPeriod(citas);
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fecha</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Hora</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Folio</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-600">
                                {pastAppointments.map((cita) => (
                                    <tr key={cita.EntradaId}>
                                        <td className="px-4 py-2 text-sm text-gray-900">{cita.EntradaFechaCap}</td>
                                        <td className="px-4 py-2 text-sm text-gray-900">{cita.CitaHoraInicio}</td>
                                        <td className="px-4 py-2 text-sm text-gray-900">{cita.EntradaId}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'citas-disponibles':
                const availableAppointments = filterAvailableAppointments(citas);
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fecha</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Hora</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Folio</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-600">
                                {availableAppointments.map((cita) => (
                                    <tr key={cita.EntradaId}>
                                        <td className="px-4 py-2 text-sm text-gray-900">{cita.EntradaFechaCap}</td>
                                        <td className="px-4 py-2 text-sm text-gray-900">{cita.CitaHoraInicio}</td>
                                        <td className="px-4 py-2 text-sm text-gray-900">{cita.EntradaId}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            default:
                return <p>Selecciona un tipo de reporte.</p>;
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Reportes de Admin</h2>
            <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">Seleccionar tipo de reporte: </label>
                <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="ml-2 p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                    <option value="productos">Productos</option>
                    {currentUser?.locatarioId === 0 && <option value="locatarios">Locatarios</option>}
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