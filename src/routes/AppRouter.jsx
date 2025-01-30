import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../Pages/LoginPage";
import PrivateRoutes from "./PrivateRoutes";
import { AdminRoutes } from "./AdminRoutes";
import useStore from "../store/store";

export const AppRouter = () => {
  const currentUser = useStore((state) => state.currentUser);

  if (currentUser === null) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
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