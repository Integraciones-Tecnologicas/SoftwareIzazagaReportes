import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../Pages/LoginPage";
import PrivateRoutes from "./PrivateRoutes";
import { AdminRoutes } from "./AdminRoutes";
import useStore from "../store/store";
import Prueba2 from "../components/Pruebas/Prueba2";

export const AppRouter = () => {
  const currentUser = useStore((state) => state.currentUser);

  if (currentUser === null) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path='/prueba' element={<Prueba2 />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {currentUser.role === "admin" ? (
          <Route path="/*" element={<AdminRoutes />} />
        ) : (
          <Route path="/*" element={<PrivateRoutes />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};