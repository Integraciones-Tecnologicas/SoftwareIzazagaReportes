import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import FormRegister from "../components/FormRegister";
import Appointment from "../components/Appointment";
import EntryCapture from "../components/EntryCapture/EntryCapture";
import ReviewEntry from "../components/ReviewEntry";
import Header from "../components/Header"
import CatalogPage from "../pages/CatalogPage"

export const AdminRoutes = () => {
    return (
        <>
            <Header />
            <Routes>                

                <Route index element={<HomePage />} />
                <Route path='/registro' element={<FormRegister />} />
                <Route path='/agendar-cita' element={<Appointment />} />
                <Route path='/catalogo-productos' element={<CatalogPage />} />
                <Route path='/captura-entrada' element={<EntryCapture />} />
                <Route path='/revision-ingreso' element={<ReviewEntry />} />

                <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
        </>
    );
};