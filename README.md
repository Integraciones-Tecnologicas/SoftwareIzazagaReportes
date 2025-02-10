# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

Store:
login: (email, password) async => {

const { addInProgressReport, getInProgressReport } = get();
  
    // Caso especial: Admin hardcodeado
    if (email === "admin" && password === "123456") {
      set({
        currentUser: {
          id: "admin",
          name: "Admin",
          email: "admin",
          role: "admin", // Asignar el rol de admin
        },
      });
      return true; // Indicar que el inicio de sesión fue exitoso
    }
    try {
      // Autenticación normal: Hacer una solicitud POST al servidor
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Cuenta: email, Password: password }),
      });
  
      const data = await response.json();
  
      // Verificar si el acceso es válido
      if (data.Acceso === true) {
        // Si la autenticación es exitosa, establecer el usuario actual
        const user = {
          id: data.id || `USER-${Date.now()}`, // Asegurar que el usuario tenga un ID único
          name: data.name,
          email: email,
          role: data.role || "user", // Asignar un rol por defecto si no está en la respuesta
        };
  
        set({ currentUser: user });
  
        // Recuperar el reporte en progreso del usuario (si es necesario)
        const inProgressReport = getInProgressReport(user.id);
        if (inProgressReport) {
          set({
            modifiedEntries: inProgressReport.products,
            selectedTime: inProgressReport.selectedTime,
            currentFolio: inProgressReport.id,
          });
        }
  
        return true; // Indicar que el inicio de sesión fue exitoso
      } else {
        // Si el acceso es inválido, devolver false
        return false;
      }
    } catch (error) {
      console.error('Error en la autenticación:', error);
      return false; // Indicar que hubo un error
    }
};