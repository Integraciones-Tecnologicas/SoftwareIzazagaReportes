import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "../Pages/LoginPage"
import PrivateRoutes from "./PrivateRoutes"
import {  AdminRoutes} from "./AdminRoutes";

let status = 'admin'

export const AppRouter = () => {

    if (status === 'checking') return <div className="loading">Checking credentials...</div>

    return (
        <BrowserRouter>
            <Routes>
                {
                    status === 'admin'
                        ? <Route path="/*" element={<AdminRoutes />} /> :
                    (status === 'locatario'
                        ? <Route path="/*" element={<PrivateRoutes />} /> 
                        : <Route path="login" element={<LoginPage />} />)
                }

                <Route path='*' element={<Navigate to='/login' replace />} />
            </Routes>
        </BrowserRouter>
    )
}