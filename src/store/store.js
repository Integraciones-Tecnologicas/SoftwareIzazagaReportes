import { create } from "zustand";

const useStore = create((set, get) => ({
  entries: [], // Productos
  modifiedEntries: [], // Productos con cantidades
  savedReports: [], // Reportes con distintos productos con folio
  selectedTime: null,
  appointments: [], // Cada cita ahora incluirá el ID del usuario
  usedFolios: [], // Se marca usado para no volverlos a registrar
  tenants: [], // Almacenar locatarios
  currentUser: null, // Usuario actual (admin o locatario)
  currentFolio: null, // Nuevo estado para el folio actual
  inProgressReports: {}, // Reportes en progreso por usuario

  
  // Función para agregar locatarios
  addTenant: (tenant) => {
    set((state) => {
      const existingTenant = state.tenants.find((t) => t.nameTenant === tenant.nameTenant);
      const emailInUse = state.tenants.find(
        (t) => t.email === tenant.email && t.nameTenant !== tenant.nameTenant
      );

      if (emailInUse) {
        alert("Este correo ya está en uso por otro usuario.");
        return state; // No actualizar ni agregar
      }

      if (existingTenant) {
        // Si el locatario existe, actualizamos sus datos
        return {
          tenants: state.tenants.map((t) =>
            t.nameTenant === tenant.nameTenant ? { ...t, ...tenant } : t
          ),
        };
      } else {
        // Si es un nuevo locatario, lo agregamos
        return {
          tenants: [...state.tenants, { ...tenant, id: `TENANT-${Date.now()}` }],
        };
      }
    });
  },
  
  // Función para eliminar locatarios
  deleteTenant: (nameTenant) => {
      set((state) => ({
        tenants: state.tenants.filter((tenant) => tenant.nameTenant !== nameTenant),
      }));
  },

  
  

  // Función para iniciar sesión
  login: (email, password) => {
    const { tenants, addInProgressReport, getInProgressReport } = get();
    const user = tenants.find((tenant) => tenant.email === email && tenant.password === password);
  
    if (user) {
      set({ currentUser: { ...user, id: user.id || `USER-${Date.now()}` } }); // Asegurar que el usuario tenga un ID único
  
      // Recuperar el reporte en progreso del usuario
      const inProgressReport = getInProgressReport(user.id);
      if (inProgressReport) {
        set({
          modifiedEntries: inProgressReport.products,
          selectedTime: inProgressReport.selectedTime,
          currentFolio: inProgressReport.id,
        });
      }
  
      return true;
    } else if (email === "admin" && password === "123456") {
      set({ currentUser: { name: "Admin", role: "admin", id: "admin" } }); // Asignar un ID único al admin
      return true;
    } else {
      return false;
    }
  },


  // Función para cerrar sesión
  logout: () => {
    set({ currentUser: null });
  },

  // Función para agregar una entrada
  addEntry: (entry) => {
    set((state) => {
      const existingEntryIndex = state.entries.findIndex((e) => e.sku === entry.sku);
  
      if (existingEntryIndex >= 0) {
        const updatedEntries = [...state.entries];
        updatedEntries[existingEntryIndex] = { ...updatedEntries[existingEntryIndex], ...entry };
  
        const updatedModifiedEntries = state.modifiedEntries.map((modifiedEntry) => {
          if (modifiedEntry.sku === entry.sku) {
            return {
              ...modifiedEntry,
              ...entry,
              quantity: modifiedEntry.quantity,
            };
          }
          return modifiedEntry;
        });
  
        return { entries: updatedEntries, modifiedEntries: updatedModifiedEntries };
      } else {
        const newEntry = {
          ...entry,
          id: `ID-${Date.now()}`,
          createdBy: state.currentUser.id || state.currentUser.name, // Asociar el ID o nombre del usuario actual
        };
  
        return { entries: [...state.entries, newEntry] };
      }
    });
  },

  // Función para actualizar entradas modificadas
  updateModifiedEntries: (entry) => {
    set((state) => {
      const existingEntryIndex = state.entries.findIndex((e) => e.sku === entry.sku);
      if (existingEntryIndex >= 0) {
        const updatedModifiedEntries = [...state.modifiedEntries];
        const newEntry = {
          ...state.entries[existingEntryIndex],
          quantity: entry.quantity,
          id: `ID-${Date.now()}`,
          folio: state.currentFolio ?? `FOLIO-${Date.now()}`, // Usar el folio actual o generar uno nuevo
          createdBy: state.currentUser,
          status: "pendiente", // Establecer el estado como "pendiente"
        };

        // Guardar el reporte en progreso
        if (state.currentUser) {
          const inProgressReport = {
            id: newEntry.folio,
            products: updatedModifiedEntries,
            selectedTime: state.selectedTime,
            createdBy: state.currentUser,
            status: "pendiente",
          };
          state.addInProgressReport(state.currentUser.id, inProgressReport);
        }

        updatedModifiedEntries.push(newEntry);
        return { modifiedEntries: updatedModifiedEntries };
      } else {
        return { modifiedEntries: state.modifiedEntries };
      }
    });
  },

  // Función para eliminar una entrada modificada por ID
  removeModifiedEntryById: (id) =>
    set((state) => ({
      modifiedEntries: state.modifiedEntries.filter((entry) => entry.id !== id),
    })),

  // Función para seleccionar el tiempo
  setSelectedTime: (time) => set(() => ({ selectedTime: time })),

  // Función para guardar un reporte
  saveReport: () =>
    set((state) => {
      if (state.modifiedEntries.length > 0) {
        const existingReportIndex = state.savedReports.findIndex(
          (report) => report.id === state.currentFolio && report.status === "pendiente"
        );

        const newReport = {
          id: state.currentFolio || `REP-${Date.now()}`, // Usar el folio actual o generar uno nuevo
          products: [...state.modifiedEntries],
          selectedTime: state.selectedTime,
          createdBy: state.currentUser,
          status: "pendiente", // Mantener el estado como "pendiente"
        };

        if (existingReportIndex !== -1) {
          // Si el reporte ya existe, actualizarlo
          const updatedReports = [...state.savedReports];
          updatedReports[existingReportIndex] = newReport;

          return {
            savedReports: updatedReports,
            modifiedEntries: [],
            selectedTime: null,
            currentFolio: null, // Reiniciar el folio actual
          };
        } else {
          // Si el reporte no existe, agregarlo como nuevo
          return {
            savedReports: [...state.savedReports, newReport],
            modifiedEntries: [],
            selectedTime: null,
            currentFolio: null, // Reiniciar el folio actual
          };
        }
      }
      return {};
    }),

  // Función para actualizar el estado de un reporte a "completo"
  completeReport: (folio) => {
    set((state) => {
      const updatedSavedReports = state.savedReports.map((report) =>
        report.id === folio ? { ...report, status: "completo" } : report
      );

      // Limpiar el reporte en progreso del usuario
      if (state.currentUser) {
        state.clearInProgressReport(state.currentUser.id);
      }

      return { savedReports: updatedSavedReports };
    });
  },

  // Función para verificar si un folio está usado
  isFolioUsed: (folio) => {
    return get().usedFolios.includes(folio);
  },

  // Función para agregar una cita
  addAppointment: (appointment) => {
    const { currentUser, completeReport } = get();
    set((state) => ({
      appointments: [...state.appointments, { ...appointment, userId: currentUser.id }],
      usedFolios: [...state.usedFolios, appointment.folio],
    }));

    // Cambiar el estado del reporte a "completo"
    completeReport(appointment.folio);
  },

  // Función para verificar si un tiempo está disponible
  isTimeAvailable: (date, time, duration) => {
    const { currentUser, appointments } = get();
    const startTime = new Date(`${date}T${time}`);
    const endTime = new Date(startTime);

    if (duration === "30 min") endTime.setMinutes(endTime.getMinutes() + 30);
    if (duration === "1 hora") endTime.setHours(endTime.getHours() + 1);
    if (duration === "2 horas") endTime.setHours(endTime.getHours() + 2);

    if (startTime.getHours() < 10 || startTime.getHours() >= 18) {
      return false;
    }

    return !appointments.some((appointment) => {
      if (appointment.userId !== currentUser.id || appointment.date !== date) return false;
      const appointmentStart = new Date(`${appointment.date}T${appointment.time}`);
      const appointmentEnd = new Date(appointmentStart);
      if (appointment.duration === "30 min") appointmentEnd.setMinutes(appointmentEnd.getMinutes() + 30);
      if (appointment.duration === "1 hora") appointmentEnd.setHours(appointmentEnd.getHours() + 1);
      if (appointment.duration === "2 horas") appointmentEnd.setHours(appointmentEnd.getHours() + 2);

      return (
        (startTime >= appointmentStart && startTime < appointmentEnd) ||
        (endTime > appointmentStart && endTime <= appointmentEnd) ||
        (startTime <= appointmentStart && endTime >= appointmentEnd)
      );
    });
  },

  // Función para obtener solo las entradas creadas por el usuario actual
  getEntriesByCurrentUser: () => {
    const { entries, currentUser } = get();
    return entries.filter((entry) => entry.createdBy === (currentUser?.id || currentUser?.name));
  },

  // Función para obtener solo los reportes creados por el usuario actual
  getReportsByCurrentUser: () => {
    const { savedReports, currentUser } = get();
    return savedReports.filter((report) => report.createdBy?.id === currentUser?.id);
  },

  // Función para agregar un reporte en progreso
  addInProgressReport: (userId, report) => {
    set((state) => ({
      inProgressReports: {
        ...state.inProgressReports,
        [userId]: report, // Asociar el reporte con el usuario
      },
    }));
  },

  // Función para obtener el reporte en progreso de un usuario
  getInProgressReport: (userId) => {
    return get().inProgressReports[userId];
  },

  // Función para limpiar el reporte en progreso de un usuario
  clearInProgressReport: (userId) => {
    set((state) => {
      const updatedInProgressReports = { ...state.inProgressReports };
      delete updatedInProgressReports[userId]; // Eliminar el reporte en progreso del usuario
      return { inProgressReports: updatedInProgressReports };
    });
  },
  
  loadPendingReport: (folio) => {
    const report = get().savedReports.find((r) => r.id === folio && r.status === "pendiente");
    if (report) {
      set({
        modifiedEntries: [...report.products], // Cargar los productos del reporte
        selectedTime: report.selectedTime, // Cargar el tiempo seleccionado
        currentFolio: report.id, // Establecer el folio actual
      });
    }
  },
  resetReportState: () => {
    set({
      modifiedEntries: [], // Limpiar las entradas modificadas
      selectedTime: null, // Reiniciar el tiempo seleccionado
      currentFolio: null, // Reiniciar el folio actual
    });
  },

}));

export default useStore;