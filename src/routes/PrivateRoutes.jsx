import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import Appointment from "../components/Appointment";
import EntryCapture from "../components/EntryCapture/EntryCapture";
import Header from "../components/Header"
import CatalogPage from '../pages/CatalogPage';
import ReportPage from '../pages/ReportPage';

const PrivateRoutes = () => {
    return (
        <>
            <Header />
            <Routes>                

                <Route index element={<HomePage />} />
                <Route path='/agendar-cita' element={<Appointment />} />
                <Route path='/catalogo-productos' element={<CatalogPage />} />
                <Route path='/captura-entrada' element={<EntryCapture />} />
                <Route path='/reportes' element={<ReportPage />} />

                <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
        </>
    );
};

export default PrivateRoutes;